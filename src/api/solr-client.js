import "whatwg-fetch";
import * as actions from "../actions";
import facetsTypes from "../constants/FacetsTypes";
import filterTypes from "../constants/FilterTypes";

const _FIELDS_SUFFIX = "schema/fields";
const _FACETS_SUFFIX = "select?facet=on&indent=on&q=*:*&wt=json&rows=0";
const _HEATMAP_SUFFIX = "select?facet=on&indent=on&q=*:*&wt=json&rows=0&facet.heatmap.format=png&facet.heatmap.distErrPct=0.04";
const _NUMERIC_RANGE_SUFFIX = 'select?facet=on&indent=on&q=*:*&wt=json&rows=0';
const _DATA_SUFFIX = "select?indent=on&q=*:*&wt=json";
const _STATS_SUFFIX = 'select?q=*:*&indent=on&wt=json&rows=0&stats=true'
const _SPECIAL_CHARS = new Set(['+', '-', '&', '|', '!', '(', ')', '{', '}', '[', ']', '^', '"', '~', '*', '?', ':', '\\', ' ']);

const _HEATMAP_TYPES = ['location_rpt'];
const _NUMERIC_TYPES = ['long', 'double', 'int', 'date'];
const _NUMERIC_INT_TYPES = ['long', 'int']; //Used in calculating gap. If it is an Int field gap has to be rounded
const _STAT_NOT_SUPPORTED_TYPES = ['location_rpt', 'text_general']

const _RANGE_PARTITIONS_COUNT = 50;

const _DATE_TYPE = 'date'

const callConfig = {
    method: 'GET',
    mode: 'cors',
    cache: 'default',
    dataType: 'jsonp',
    jsonp: 'json.wrf',
    crossDomain: true,
    withCredentials: true
};

const mapMillisToIsoDate = (gap) => {
    if(gap<1000)
        return Math.ceil(gap)+'MILLISECOND';
    gap/=1000;

    if(gap<60)
        return Math.ceil(gap) + 'SECOND';

    gap/=60;
    if(gap<60)
        return Math.ceil(gap) +'MINUTE';

    gap/=60;
    if(gap<24)
        return Math.ceil(gap) +'HOUR';

    gap/=24;
    if(gap<30)
        return Math.ceil(gap) +'DAY';
}

class SolrClient {
    state = {};
    store = {};

    setStore(store) {
        this.store = store;
        store.subscribe(() => {
            this.state = this.store.getState();
        });
    }


    getFields() {
        let url = this.state.baseUrl + _FIELDS_SUFFIX;
        fetch(url, callConfig)
            .then(response => {
                return response.text()
            }).then(body => {
            //Todo: Add code to extract field details and send them
            var fields = JSON.parse(body).fields;
            fields = fields.map(field => ({...field, selected: false}));
            var fieldsObject = {}
            for (let field of fields) {
                fieldsObject[field.name] = field;

            }
            this.store.dispatch(actions.updateFields(fieldsObject));

            setTimeout(() => {
                this.getStats(Object.keys(this.state.fields))
            });
        });
    }

    getFacetsForAllFields() {
        console.log("All")
        let i = 1;
        for (let fieldName of Object.keys(this.state.fields)) {
            let field = this.state.fields[fieldName];
            if (field.selected === false) continue;
            setTimeout(() => this.getFacets(field.name), 10 * i)
            i += 1;
        }

        setTimeout(() => {
            this.getStats(Object.keys(this.state.fields))
        });
        setTimeout(() => this.getData(), 10);

    }

    getFacets(fieldName) {
        if (this.state.fields[fieldName] && !this.state.fields[fieldName].selected) {
            console.log("Error: request facets for not selected field")
            return
        }
        ;

        //Generate the request
        var url = this.state.baseUrl;
        let searchText = "";

        let fieldType = this.state.fields[fieldName].type;

        //   if(_HEATMAP_TYPES.indexOf(this.state.fields[fieldName].type) > 0){
        if (_HEATMAP_TYPES.indexOf(fieldType) > -1) {
            url += _HEATMAP_SUFFIX;
            url += "&facet.heatmap=" + fieldName;
        }
        else if (_NUMERIC_TYPES.indexOf(fieldType) > -1) {
            url += _NUMERIC_RANGE_SUFFIX;
            url += "&facet.range=" + fieldName;
            let range = [this.state.fields[fieldName].stats.min, this.state.fields[fieldName].stats.max];
            if (this.state.facetsList[fieldName] && this.state.facetsList[fieldName].range) {
                range = this.state.facetsList[fieldName].range;
                if (this.state.fields[fieldName].type == _DATE_TYPE)
                    range = range.map(this.mapDateToSolr);
                console.log(range)
            }
            url += "&facet.range.start=" + range[0]
            url += "&facet.range.end=" + range[1]

            //Calculating the gap for the range facets. For numeric fields it has to be
            let gap = (range[1] - range[0]) / _RANGE_PARTITIONS_COUNT;
            if (_NUMERIC_INT_TYPES.indexOf(fieldType) > -1) {
                gap = Math.round(gap)
                if (gap <= 0) gap = 1;

            }

            if (_DATE_TYPE == this.state.fields[fieldName].type) {
                console.log(gap)
                console.log(range)
                let gapInMillis = ( Date.parse(range[1]) -  Date.parse(range[0]))/_RANGE_PARTITIONS_COUNT;
                console.log(gapInMillis);
                console.log("------------ gap");
                gap = '%2B'+mapMillisToIsoDate(gapInMillis);
                console.log(gap);

            }
            url += "&facet.range.gap=" + gap;

        }
        else {
            url += _FACETS_SUFFIX;
            if (this.state.facetsList[fieldName])
                searchText = this.state.facetsList[fieldName].searchText;

            url += "&facet.field=" + fieldName;
            url += "&facet.contains=" + this.encodeForSolr(searchText)
            url += "&facet.contains.ignoreCase=true";
            url += "&facet.limit=10";
        }

        //Add Filters
        url += this.generateFilterQuery(this.state.filters);

        //make promise
        fetch(url, callConfig)
            .then(response => {
                return response.text()
            }).then(body => {
            //Convert data into a object list list
            let facetFields = this.extractFacetsFromData(body);
            facetFields[0].searchText = searchText;
            this.store.dispatch(actions.updateFacets(facetFields[0])) // it has results only for one field. We sends only that data. No need of an array
        });
    }


    getData() {
        let url = this.state.baseUrl + _DATA_SUFFIX;
        let dataState = this.state.data;

        url += this.generateFilterQuery(this.state.filters);

        url += "&rows=" + dataState.rows;
        url += "&start=" + dataState.start;

        fetch(url, callConfig)
            .then(response => {
                return response.text()
            }).then(body => {
            //console.log("data recieved"+new Date()+new Date().getMilliseconds());
            let jsonObject = JSON.parse(body);
            //Find columns
            let columns = new Set();
            for (let record of jsonObject.response.docs) {
                for (let fieldName in record) {
                    if (record.hasOwnProperty(fieldName))
                        columns.add(fieldName)
                }
                //console.log(JSON.stringify(Array.from(columns)));
            }
            //console.log(jsonObject.response.docs.length);
            //console.log("Returning data:"+new Date()+new Date().getMilliseconds());
            this.store.dispatch(actions.updateData({
                    jsonResponse: body,
                    url: url,
                    numFound: jsonObject.response.numFound,
                    start: dataState.start,
                    rows: dataState.rows,
                    docs: jsonObject.response.docs,
                    columnNames: Array.from(columns)
                })
            );

        });
    }

    getStats(fieldNameList) {
        let url = this.state.baseUrl + _STATS_SUFFIX
        for (let fieldName of fieldNameList) {
            if (_STAT_NOT_SUPPORTED_TYPES.indexOf(this.state.fields[fieldName].type) === -1)
                url += '&stats.field=' + fieldName;
        }

        // url += this.generateFilterQuery(this.state.filters);

        fetch(url, callConfig)
            .then(response => {
                return response.text()
            }).then(body => {
                //Todo: Add code to extract field details and send them
                let stats = JSON.parse(body).stats.stats_fields;
                this.store.dispatch(actions.updateStats(stats));
            }
            //   this.store.dispatch(actions.updateFields(fieldsObject));
        );

    }

    //
    //   getFacetsForAllFields(fields,filterQueries)
    //   {
    //       var promise = new Promise(resolve => {
    //       //Generate the request
    //       var url = this._FACETS_SUFFIX;
    //       for(let field of fields)
    //       facetText+="&facet.field="+field;
    //       facetText+="&facet.limit=10";
    //
    //       //Add Filters
    //       facetText+=this.generateFilterQuery(filterQueries);
    //
    //       //make promise
    //         fetch(this.baseUrl+facetText,this.callConfig)
    //         .then(response => {
    //           return response.text()
    //         }).then(body =>{
    //           //Convert data into a object list list
    //           let facetFields = this.extractFacetsFromData(body);
    //           resolve(facetFields)
    //         });
    //       });
    //       return promise;
    //   }
    //
    //   generateFilterQuery(filterQueries)
    //   {
    //       let facetText = ""
    //       for(let fq of filterQueries)
    //       {
    //           facetText+="&fq="+fq.field+":"+ this.encodeForSolr(fq.value);
    //       }
    //       return facetText;
    //   }
    //
    //   extractFacetsFromData(data)
    //   {
    //       var facetsData = JSON.parse(data).facet_counts.facet_fields;
    //       var facetFields = [];
    //       for(let facetField in facetsData)   //take facet data for a specific field
    //       {
    //           if(facetsData.hasOwnProperty(facetField))
    //           {
    //               let facetArray = facetsData[facetField];
    //               let facets = [];
    //               for(var i=0; i<facetArray.length;i+=2)  //loop through facet data array and convert them to (value,count) pairs
    //               {
    //                   if(facetArray[i+1]>0)
    //                       facets.push({value:facetArray[i],count:facetArray[i+1]})
    //               }
    //               facetFields.push({field:facetField,facets:facets, searchText:""});
    //           }
    //       }
    //       return facetFields;
    //   }
    //
    //   getData(filterQueries,start,rows)
    //   {
    //
    //       var promise = new Promise(resolve => {
    //           let dataText = this._DATA_SUFFIX;
    //
    //           dataText+=this.generateFilterQuery(filterQueries);
    //
    //           dataText+="&rows="+rows;
    //           dataText+="&start="+start;
    //
    //         fetch(this.baseUrl+dataText,this.callConfig)
    //         .then(response => {
    //           return response.text()
    //         }).then(body =>{
    //           //Todo: Add code to extract field details and send them
    //           //console.log("data recieved"+new Date()+new Date().getMilliseconds());
    //           let jsonObject = JSON.parse(body);
    //           //Find columns
    //           let columns = new Set();
    //           for(let record of jsonObject.response.docs)
    //           {
    //               for(let fieldName in record)
    //               {
    //                   if(record.hasOwnProperty(fieldName))
    //                       columns.add(fieldName)
    //               }
    //               //console.log(JSON.stringify(Array.from(columns)));
    //           }
    //           //console.log(jsonObject.response.docs.length);
    //           //console.log("Returning data:"+new Date()+new Date().getMilliseconds());
    //           resolve({
    //               text:body,
    //               url:this.baseUrl+dataText,
    //               numFound:jsonObject.response.numFound,
    //               start:start,
    //               rows:rows,
    //               docs:jsonObject.response.docs,
    //               columnNames:Array.from(columns) })
    //         });
    //       });
    //       return promise;
    //   }
    //
    //   getGeoOverview(filterQueries, heatField)
    //   {
    //       var promise = new Promise(resolve => {
    //           let geoText = this._HEATMAP_SUFFIX;
    //           geoText+=this.generateFilterQuery(filterQueries);
    //           geoText+="&facet.heatmap="+heatField;
    //
    //           fetch(this.baseUrl+geoText,this.callConfig)
    //           .then(response => {
    //             return response.text()
    //           }).then(body =>{
    //               //--- todo
    //               //console.log(body)
    //               let heatMap = JSON.parse(body).facet_counts.facet_heatmaps[heatField];
    //
    //               //console.log(heatMap);
    //               resolve(heatMap)
    //           });
    //
    //
    //       });
    //       return promise;
    //   }
    //
    //
    // getQuery(url)
    // {
    //   var promise = new Promise(resolve => {
    //   fetch(this.baseUrl+url,this.callConfig)
    //   .then(response => {
    //     return response.text()
    //   }).then(body =>{
    //     resolve(body)
    //   });
    //   });
    //   return promise;
    // }
    //
    // setBaseUrl(url)
    // {
    //     this.baseUrl = url;
    // }
    //
    //


    //Static Support Methods
    generateFilterQuery(filterQueries) {
        let url = ""
        for (let fq of filterQueries) {
            if (fq.type === filterTypes.TEXT_FILTER)
                url += "&fq=" + fq.field.name + ":" + this.encodeForSolr(fq.query);
            else if (fq.type === filterTypes.NUMERIC_RANGE_FILTER) {
                if(fq.field.type == _DATE_TYPE)
                    fq.range = fq.range.map(this.mapDateToSolr);
                url += "&fq=" + fq.field.name + ":[" + fq.range[0] + " TO " + fq.range[1] + "]";
            }
            else if(fq.type === filterTypes.GEO_SHAPE){
                url += this.shapeToSolrQuery(fq.shapes,fq.field);
            }
        }
        return url;
    }

    shapeToSolrQuery(shapes, field){
        if(shapes.length==0) return "";
        let url = "";
        for(let shape of shapes)
        {
            switch (shape.type){
            case 'circle':
                url+= " OR {!geofilt sfield="+this.encodeForSolr(field.name)+"}&pt="+shape.point.lat+","+shape.point.lng+"&d="+shape.radius/1000+"";
                break;
            case 'polygon':
                url+= " OR {!field f="+field.name+"}Intersects(POLYGON(("+(shape.points.reduce((txt,point)=> (txt+","+point.lat+" "+point.lng), "").substring(2))+"))";
                break;
            case 'rectangle':
                url+= " OR "+field.name+":["+shape.points[0].lat+","+shape.points[0].lng+" TO "+shape.points[2].lat+","+shape.points[2].lng+"]";
                break;
            }

        }
        console.log('Shape to solr query')
        console.log(url)
        return "&fq="+url.substring(4)+"";
    }

    extractFacetsFromData(data) {
        data = JSON.parse(data);
        let facetsDataAll = data.facet_counts;
        var facetFields = [];

        //Extract Text Facets options
        var facetsData = facetsDataAll.facet_fields;
        for (let facetField in facetsData)   //take facet data for a specific field
        {
            if (facetsData.hasOwnProperty(facetField)) {
                let facetArray = facetsData[facetField];
                let options = { headers:[], counts: []};
                for (var i = 0; i < facetArray.length; i += 2)  //loop through facet data array and convert them to (value,count) pairs
                {
                    if (facetArray[i + 1] > 0){
                        options.headers.push(facetArray[i]);
                        options.counts.push(facetArray[i + 1])
                    }
                }
                facetFields.push( facetsTypes.generators.text(this.state.fields[facetField],data.responseHeader.params.facet.contaions, options  ) );
            }
        }

        //Extract Heat maps
        let heatMaps = facetsDataAll.facet_heatmaps;
        for (let heatMapFieldName in heatMaps) {
            if (heatMaps.hasOwnProperty(heatMapFieldName)) {
                let heatMapList = heatMaps[heatMapFieldName];
                //Convert the list into an object
                let heatMapObject = {}
                for (let i = 0; i < heatMapList.length; i += 2)
                    heatMapObject[heatMapList[i]] = heatMapList[i + 1]
                facetFields.push(facetsTypes.generators.heatMap(this.state.fields[heatMapFieldName], null, heatMapObject));
            }
        }


        //Extract range facets
        let facetRanges = facetsDataAll.facet_ranges;
        for (let fieldName of Object.keys(facetRanges)) {
            let facets = facetRanges[fieldName];


            let stats = this.state.fields[fieldName].stats;
            let fullRange = [stats.min, stats.max];
            let selectedRange = [facets.start, facets.end];
            let options = {headers:[], counts:[], gap:1};
            for (let i = 0; i < facets.counts.length; i += 2) {
                options.headers.push(facets.counts[i]);
                options.counts.push(facets.counts[i+1]);
            }
            // ------------------------
            //Convert to Date objects if it is date type
            if (this.state.fields[fieldName].type == 'date') {
                fullRange = fullRange.map(Date.parse)
                selectedRange = selectedRange.map(Date.parse)
                options.headers =options.headers.map(Date.parse)
            }
            //-----------------------------------------
            facetFields.push(facetsTypes.generators.numericRange(this.state.fields[fieldName], fullRange, selectedRange,options));
        }


        return facetFields;
    }

    encodeForSolr(str) {
        let newStr = "";
        for (let ch of str) {
            if (_SPECIAL_CHARS.has(ch))
                newStr += "\\";
            newStr += ch;
        }
        return newStr;
    }

    mapDateToSolr(date) {
        date = new Date(date);
        console.log(date)
        return date.toISOString();
    }


}
const solrClient = new SolrClient()
export default solrClient;
