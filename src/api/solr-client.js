/*
 *  Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */
import "whatwg-fetch";
import * as actions from "../actions";
import facetsTypes from "../constants/FacetsTypes";
import filterTypes from "../constants/FilterTypes";

const _FIELDS_SUFFIX = "schema/fields";
const _FACETS_SUFFIX = "select?facet=on&indent=on&q=*:*&wt=json&rows=0";
const _HEATMAP_SUFFIX = "select?facet=on&indent=on&q=*:*&wt=json&rows=0&facet.heatmap.format=png&facet.heatmap.distErrPct=0.04";
const _NUMERIC_RANGE_SUFFIX = 'select?facet=on&indent=on&q=*:*&wt=json&rows=0';
const _DATA_SUFFIX = "select?indent=on&q=*:*&wt=json";
const _DATA_SUFFIX_CSV = "select?indent=on&q=*:*&wt=csv";
const _STATS_SUFFIX = 'select?q=*:*&indent=on&wt=json&rows=0&stats=true'
const _SPECIAL_CHARS = new Set(['+', '-', '&', '|', '!', '(', ')', '{', '}', '[', ']', '^', '"', '~', '*', '?', ':', '\\', ' ']);

const _HEATMAP_TYPES = ['location_rpt'];
const _NUMERIC_TYPES = ['long', 'double', 'int', 'date'];
const _NUMERIC_INT_TYPES = ['long', 'int']; //Used in calculating gap. If it is an Int field gap has to be rounded
const _STAT_NOT_SUPPORTED_TYPES = ['location_rpt', 'text_general']

const _RANGE_PARTITIONS_COUNT = 500;

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

// Map time gap to a solr competible Date Range ISO
const mapMillisToIsoDate = (gap) => {
    if (gap < 1000)
        return Math.ceil(gap) + 'MILLISECOND';
    gap /= 1000;

    if (gap < 60)
        return Math.ceil(gap) + 'SECOND';

    gap /= 60;
    if (gap < 60)
        return Math.ceil(gap) + 'MINUTE';

    gap /= 60;
    if (gap < 24)
        return Math.ceil(gap) + 'HOUR';

    gap /= 24;
    if (gap < 30)
        return Math.ceil(gap) + 'DAY';
}

class SolrClient {
    state = {};
    store = {};

    //When initiate set the store to subscribe for state changes
    setStore(store) {
        this.store = store;
        store.subscribe(() => {
            this.state = this.store.getState();
        });
    }

    getFields() {
        let url = this.state.baseUrl + _FIELDS_SUFFIX;
        this.store.dispatch(actions.addFetchingUrl(url));
        return fetch(url, callConfig)
            .then(response => {
                return response.text()
            })
            .then(body => {
                //Todo: Add code to extract field details and send them
                var fields = JSON.parse(body).fields;
                fields = fields.map(field => ({...field, selected: false}));
                var fieldsObject = {}
                for (let field of fields) {
                    fieldsObject[field.name] = field;
                }
                this.store.dispatch(actions.updateFields(fieldsObject));
                this.store.dispatch(actions.removeFetchingUrl(url));
            })
            .then(()=> {
                    return this.getStats(Object.keys(this.state.fields));
                }
            )
            .catch((e)=> {
                this.store.dispatch(actions.addFetchingError({title: "Error Fetching Fields", url: url, error: e}));
                this.store.dispatch(actions.removeFetchingUrl(url));
            });
    }

    //Call getFacest(), getData()
    getFacetsForAllFields() {
        console.log("All")
        let i = 1;
        for (let fieldName of Object.keys(this.state.fields)) {
            let field = this.state.fields[fieldName];
            if (field.selected === false)
                continue;
            this.getFacets(field.name);
        }
        //By default timeSliderOptions has a fild with name = ""
        if (this.state.timeSliderOptions.field.name !== "")
            this.getFacets(this.state.timeSliderOptions.field.name);
        this.getData();
    }

    getFacets(fieldName) {
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
                if (this.state.fields[fieldName].type === _DATE_TYPE)
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

            if (_DATE_TYPE === this.state.fields[fieldName].type) {
                console.log(gap)
                console.log(range)
                let gapInMillis = ( Date.parse(range[1]) - Date.parse(range[0])) / _RANGE_PARTITIONS_COUNT;
                console.log(gapInMillis);
                console.log("------------ gap");
                gap = '%2B' + mapMillisToIsoDate(gapInMillis);
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
        url += this.generateFilterQuery();

        //make promise
        this.store.dispatch(actions.addFetchingUrl(url));
        return fetch(url, callConfig)
            .then(response => {
                return response.text()
            })
            .then(body => {
                //Convert data into a object list list
                let facetFields = this.extractFacetsFromData(body);
                facetFields[0].searchText = searchText;
                this.store.dispatch(actions.updateFacets(facetFields[0])) // it has results only for one field. We sends only that data. No need of an array
                this.store.dispatch(actions.removeFetchingUrl(url));
            })
            .catch((e)=> {
                this.store.dispatch(actions.addFetchingError({
                    title: "Error Fetching Facets for Field:" + fieldName,
                    url: url,
                    error: e
                }));
                this.store.dispatch(actions.removeFetchingUrl(url));
            });
    }

    getData(promptDownload = false) {
        let url = this.state.baseUrl + (promptDownload?_DATA_SUFFIX_CSV:_DATA_SUFFIX);
        let dataState = this.state.data;

        url += this.generateFilterQuery();
        url += this.generateSortQuery(this.state.sort)

        if(!promptDownload)
        {
            url += "&rows=" + dataState.rows;
            url += "&start=" + dataState.start;
        }
        else
        {
            url += "&rows="+dataState.numFound;
            url += "&start="+0;
            window.open(url)
            return;
        }

        this.store.dispatch(actions.addFetchingUrl(url));
        return fetch(url, callConfig)
            .then(response => {
                return response.text()
            })
            .then(body => {
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
                //console.log("Returning data:"+new Date()+new Date().getMilliseconds())
                // ;
                let data = {
                    jsonResponse: body,
                    url: url,
                    numFound: jsonObject.response.numFound,
                    start: dataState.start,
                    rows: dataState.rows,
                    docs: jsonObject.response.docs,
                    columnNames: Array.from(columns)
                };
                this.store.dispatch(actions.updateData(data));
                this.store.dispatch(actions.removeFetchingUrl(url));

            })
            .catch((e)=> {
                this.store.dispatch(actions.addFetchingError({title: "Error Fetching Data", url: url, error: e}));
                this.store.dispatch(actions.removeFetchingUrl(url));
            });
    }

    getStats(fieldNameList) {
        let url = this.state.baseUrl + _STATS_SUFFIX
        for (let fieldName of fieldNameList) {
            if (_STAT_NOT_SUPPORTED_TYPES.indexOf(this.state.fields[fieldName].type) === -1)
                url += '&stats.field=' + fieldName;
        }

        // url += this.generateFilterQuery(this.state.filters);

        this.store.dispatch(actions.addFetchingUrl(url));
        return fetch(url, callConfig)
            .then(response => {
                return response.text()
            }).then(body => {
                    //Todo: Add code to extract field details and send them
                    let stats = JSON.parse(body).stats.stats_fields;
                    this.store.dispatch(actions.updateStats(stats));
                    this.store.dispatch(actions.removeFetchingUrl(url));
                }
                //   this.store.dispatch(actions.updateFields(fieldsObject));
            )
            .catch((e)=> {
                this.store.dispatch(actions.addFetchingError({title: "Error Fetching Stats", url: url, error: e}));
                this.store.dispatch(actions.removeFetchingUrl(url));
            });
    }

    //  URL Generation methods ---------------------------------------------------------------------------
    //  --------------------------------------------------------------------------------------------------
    generateFilterQuery() {
        let filterQueries = [...this.state.filters]
        if (this.state.timeSliderOptions.filter)
            filterQueries.push(this.state.timeSliderOptions.filter); //Append if there is a slider query

        let url = ""
        for (let fq of filterQueries) {
            if (fq.type === filterTypes.TEXT_FILTER)
                url += "&fq=" + fq.field.name + ":" + this.encodeForSolr(fq.query);
            else if (fq.type === filterTypes.NUMERIC_RANGE_FILTER) {
                if (fq.field.type === _DATE_TYPE)
                    fq.range = fq.range.map(this.mapDateToSolr);
                url += "&fq=" + fq.field.name + ":[" + fq.range[0] + " TO " + fq.range[1] + "]";
            }
            else if (fq.type === filterTypes.GEO_SHAPE) {
                url += this.shapeToSolrQuery(fq.shapes, fq.field);
            }
        }
        return url;
    }

    generateSortQuery(sort) {
        let url = "";
        if (sort.field) {
            url += "&sort=" + sort.field.name + " " + sort.type
        }
        return url;
    }

    shapeToSolrQuery(shapes, field) {
        if (shapes.length === 0) return "";
        let url = "";
        for (let shape of shapes) {
            switch (shape.type) {
                case 'circle':
                    url += " OR {!geofilt sfield=" + this.encodeForSolr(field.name) + "}&pt=" + shape.point.lat + "," + shape.point.lng + "&d=" + shape.radius / 1000 + "";
                    break;
                case 'polygon':
                    url += " OR {!field f=" + field.name + "}Intersects(POLYGON((" + (shape.points.reduce((txt, point)=> (txt + "," + point.lat + " " + point.lng), "").substring(2)) + "))";
                    break;
                case 'rectangle':
                    url += " OR " + field.name + ":[" + shape.points[0].lat + "," + shape.points[0].lng + " TO " + shape.points[2].lat + "," + shape.points[2].lng + "]";
                    break;
                default:
                    url = "";
            }

        }
        console.log('Shape to solr query')
        console.log(url)
        return "&fq=" + url.substring(4) + "";
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

    // To generate facet objects using solr response -----------------------------------------------------------------------------------
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
                let options = {headers: [], counts: []};
                for (var i = 0; i < facetArray.length; i += 2)  //loop through facet data array and convert them to (value,count) pairs
                {
                    if (facetArray[i + 1] > 0) {
                        options.headers.push(facetArray[i]);
                        options.counts.push(facetArray[i + 1])
                    }
                }
                facetFields.push(facetsTypes.generators.text(this.state.fields[facetField], data.responseHeader.params.facet.contaions, options));
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
            let options = {headers: [], counts: [], gap: 1};
            for (let i = 0; i < facets.counts.length; i += 2) {
                options.headers.push(facets.counts[i]);
                options.counts.push(facets.counts[i + 1]);
            }
            // ------------------------
            //Convert to Date objects if it is date type
            if (this.state.fields[fieldName].type === 'date') {
                fullRange = fullRange.map(Date.parse)
                selectedRange = selectedRange.map(Date.parse)
                options.headers = options.headers.map(Date.parse)
            }
            //-----------------------------------------
            facetFields.push(facetsTypes.generators.numericRange(this.state.fields[fieldName], fullRange, selectedRange, options));
        }


        return facetFields;
    }

    //Map JS Date object to Solr ISO date format
    mapDateToSolr(date) {
        date = new Date(date);
        console.log(date)
        return date.toISOString();
    }
}

//This library do not export the static class, this exports the object of the class.
const solrClient = new SolrClient()
export default solrClient;
