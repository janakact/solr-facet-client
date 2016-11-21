import 'whatwg-fetch';
import * as actions from '../actions'
import facetsTypes from '../constants/FacetsTypes'

const _FIELDS_SUFFIX = "schema/fields";
const _FACETS_SUFFIX = "select?facet=on&indent=on&q=*:*&wt=json&rows=0";
const _HEATMAP_SUFFIX = "select?facet=on&indent=on&q=*:*&wt=json&rows=0";
const _DATA_SUFFIX = "select?indent=on&q=*:*&wt=json";
const _STATS_SUFFIX = 'select?q=*:*&indent=on&wt=json&rows=0&stats=true'
const _SPECIAL_CHARS = new Set(['+','-','&', '|', '!', '(', ')', '{', '}', '[', ']', '^', '"', '~', '*', '?', ':', '\\', ' ' ]);

const _HEATMAP_TYPES = ['location_rpt'];
const _NUMERIC_TYPES = ['long', 'double', 'int'];
const _STAT_NOT_SUPPORTED_TYPES = ['location_rpt', 'text_general']

const callConfig = { method: 'GET',
                    mode: 'cors',
                    cache: 'default',
                    dataType: 'jsonp',
                    jsonp: 'json.wrf',
                    crossDomain: true,
                    withCredentials: true};

class SolrClient
{
    state = {    };
    store = {};

    setStore(store){
        this.store = store;
        store.subscribe(()=>{
            this.state = this.store.getState();
        });
    }


    getFields()
    {
        let url = this.state.baseUrl+_FIELDS_SUFFIX;
        fetch(url,callConfig)
        .then(response => {
            return response.text()
          }).then(body =>{
            //Todo: Add code to extract field details and send them
            var fields = JSON.parse(body).fields;
            fields = fields.map(field=>({...field,selected:false}));
            var fieldsObject = {}
            for(let field of fields){
                fieldsObject[field.name] = field;

            }
            this.store.dispatch(actions.updateFields(fieldsObject));

            setTimeout(()=>{this.getStats(Object.keys(this.state.fields))});
          });
    }

    getFacetsForAllFields()
    {
        console.log("All")
        let i = 1;
        for(let fieldName of Object.keys(this.state.fields)){
            let field = this.state.fields[fieldName];
            if( field.selected===false) continue;
            setTimeout(()=>this.getFacets(field.name), 100*i)
            i+=1;
        }
        setTimeout(()=>this.getData(), 100);

    }

    getFacets(fieldName)
    {
        console.log("getFacet-"+fieldName)
        if(this.state.fields[fieldName] && !this.state.fields[fieldName].selected) {
            console.log("Error: request facets for not selected field")
            return
        };

      //Generate the request
      var url = this.state.baseUrl;
      let searchText = "";

      let fieldType = this.state.fields[fieldName].type;

    //   if(_HEATMAP_TYPES.indexOf(this.state.fields[fieldName].type) > 0){
      if(_HEATMAP_TYPES.indexOf(fieldType)>-1){
          url += _HEATMAP_SUFFIX;
          url+="&facet.heatmap="+fieldName;
      }
      else if( _NUMERIC_TYPES.indexOf(fieldType) > -1){
         return;
      }
      else{
          url += _FACETS_SUFFIX;
          if(this.state.facetsList[fieldName])
            searchText = this.state.facetsList[fieldName].searchText;

          url+="&facet.field="+fieldName;
          url+="&facet.contains="+this.encodeForSolr(searchText)
          url+="&facet.contains.ignoreCase=true";
          url+="&facet.limit=10";
      }

      console.log(url);
      console.log(_HEATMAP_TYPES);
      console.log(this.state.fields[fieldName].type);


      //Add Filters
      url+=this.generateFilterQuery(this.state.filters);

      //make promise
        fetch(url,callConfig)
        .then(response => {
          return response.text()
        }).then(body =>{
          //Convert data into a object list list
          let facetFields = this.extractFacetsFromData(body);
          facetFields[0].searchText = searchText;
          this.store.dispatch(actions.updateFacets(facetFields[0])) // it has results only for one field. We sends only that data. No need of an array
        });
    }


      getData()
      {
          let url = this.state.baseUrl+_DATA_SUFFIX;
          let dataState = this.state.data;

          url+=this.generateFilterQuery(this.state.filters);

          url+="&rows="+dataState.rows;
          url+="&start="+dataState.start;

          fetch(url, callConfig)
          .then(response => {
              return response.text()
          }).then(body =>{
              //console.log("data recieved"+new Date()+new Date().getMilliseconds());
              let jsonObject = JSON.parse(body);
              //Find columns
              let columns = new Set();
              for(let record of jsonObject.response.docs)
              {
                  for(let fieldName in record)
                  {
                      if(record.hasOwnProperty(fieldName))
                      columns.add(fieldName)
                  }
                  //console.log(JSON.stringify(Array.from(columns)));
              }
              //console.log(jsonObject.response.docs.length);
              //console.log("Returning data:"+new Date()+new Date().getMilliseconds());
              this.store.dispatch(actions.updateData({
                  jsonResponse:body,
                  url:url,
                  numFound:jsonObject.response.numFound,
                  start:dataState.start,
                  rows:dataState.rows,
                  docs:jsonObject.response.docs,
                  columnNames:Array.from(columns) })
              );

          });
  }

  getStats(fieldNameList){
      let url = this.state.baseUrl + _STATS_SUFFIX
      for(let fieldName of fieldNameList){
          if(_STAT_NOT_SUPPORTED_TYPES.indexOf(this.state.fields[fieldName].type)===-1)
          url+='&stats.field='+fieldName;
      }

      fetch(url,callConfig)
      .then(response => {
          return response.text()
        }).then(body =>{
          //Todo: Add code to extract field details and send them
           console.log(body)
            let stats = JSON.parse(body).stats.stats_fields;
            console.log(stats)
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
    generateFilterQuery(filterQueries)
    {
        let url = ""
        for(let fq of filterQueries)
        {
            url+="&fq="+fq.fieldName+":"+ this.encodeForSolr(fq.query);
        }
        return url;
    }

    extractFacetsFromData(data)
    {
        var facetsDataAll = JSON.parse(data).facet_counts;
        var facetFields = [];

        //Extract Text Facets options
        var facetsData = facetsDataAll.facet_fields;
        for(let facetField in facetsData)   //take facet data for a specific field
        {
            if(facetsData.hasOwnProperty(facetField))
            {
                let facetArray = facetsData[facetField];
                let facets = [];
                for(var i=0; i<facetArray.length;i+=2)  //loop through facet data array and convert them to (value,count) pairs
                {
                    if(facetArray[i+1]>0)
                        facets.push({value:facetArray[i],count:facetArray[i+1]})
                }
                facetFields.push({fieldName:facetField,facets:facets, searchText:"", type:facetsTypes.TEXT});
            }
        }

        //Extract Heat maps
        let heatMaps = facetsDataAll.facet_heatmaps;
        for(let heatMapFieldName in heatMaps){
            if(heatMaps.hasOwnProperty(heatMapFieldName)){
                facetFields.push({fieldName:heatMapFieldName, facets:heatMaps[heatMapFieldName], type:facetsTypes.HEAT_MAP})
            }
        }




        return facetFields;
    }

    encodeForSolr(str)
    {
        let newStr = "";
        for(let ch of str)
        {
          if(_SPECIAL_CHARS.has(ch))
              newStr+="\\";
          newStr+=ch;
        }
        return newStr;
    }



}
const solrClient = new SolrClient()
export default solrClient;
