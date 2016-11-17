import 'whatwg-fetch';
import * as actions from '../actions'

const fieldsSufix = "schema/fields";
const facetSuffix = "select?facet=on&indent=on&q=*:*&wt=json&rows=0";
const geoHeatMapSufix = "select?facet=on&indent=on&q=*:*&wt=json&rows=0";
const dataSuffix = "select?indent=on&q=*:*&wt=json";
const specialChars = new Set(['+','-','&', '|', '!', '(', ')', '{', '}', '[', ']', '^', '"', '~', '*', '?', ':', '\\', ' ' ]);

const callConfig = { method: 'GET',
                    mode: 'cors',
                    cache: 'default',
                    dataType: 'jsonp',
                    jsonp: 'json.wrf',
                    crossDomain: true,
                    withCredentials: true};

class SolrClient
{
    query = {    };
    store = {};
    constructor()
    {

    }

    setStore(store){
        this.store = store;
        store.subscribe(()=>{
            this.query = this.store.getState().query;
            console.log(this.query)
        });
    }


    getFields()
    {
        fetch(this.query.baseUrl+fieldsSufix,callConfig)
        .then(response => {
            return response.text()
          }).then(body =>{
            //Todo: Add code to extract field details and send them
            var fields = JSON.parse(body).fields;
            fields = fields.map(field=>({...field,selected:false}));
            this.store.dispatch(actions.updateFields(fields));
          });
    }

    getFacets(fieldName)
    {
        console.log("getFacet-"+fieldName)
        if(!this.query.fields.find((field)=>(field.name===fieldName)).selected) {
            console.log("Error---Requesting Facets for an unselected Field")
            return
        };

      //Generate the request
      var facetText = facetSuffix;
      facetText+="&facet.field="+fieldName;
    //   facetText+="&facet.contains="+this.encodeForSolr("");
      facetText+="&facet.contains.ignoreCase=true";
      facetText+="&facet.limit=10";

      //Add Filters
      facetText+=this.generateFilterQuery(this.query.filters);

      //make promise
        fetch(this.query.baseUrl+facetText,callConfig)
        .then(response => {
          return response.text()
        }).then(body =>{
          //Convert data into a object list list
          let facetFields = this.extractFacetsFromData(body);
        //   facetFields[0].searchText = searchText;
          this.store.dispatch(actions.updateFacets(facetFields[0])) // it has results only for one field. We sends only that data. No need of an array
        });
    }

  //
  //   getFacetsForAllFields(fields,filterQueries)
  //   {
  //       var promise = new Promise(resolve => {
  //       //Generate the request
  //       var facetText = this.facetSuffix;
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
  //           let dataText = this.dataSuffix;
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
  //           let geoText = this.geoHeatMapSufix;
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
  // encodeForSolr(str)
  // {
  //     let newStr = "";
  //     for(let ch of str)
  //     {
  //       if(this.specialChars.has(ch))
  //           newStr+="\\";
  //       newStr+=ch;
  //     }
  //     return newStr;
  // }


  //Static Support Methods
    generateFilterQuery(filterQueries)
    {
        let facetText = ""
        for(let fq of filterQueries)
        {
            facetText+="&fq="+fq.field+":"+ this.encodeForSolr(fq.value);
        }
        return facetText;
    }

    extractFacetsFromData(data)
    {
        var facetsData = JSON.parse(data).facet_counts.facet_fields;
        var facetFields = [];
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
                facetFields.push({field:facetField,facets:facets, searchText:""});
            }
        }
        return facetFields;
    }


}
const solrClient = new SolrClient()
export default solrClient;
