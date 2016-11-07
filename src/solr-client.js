import 'whatwg-fetch';

class SolrClient
{
  baseUrl = "";
  fieldsSufix = "schema/fields";
  facetSuffix = "select?facet=on&indent=on&q=*:*&wt=json&rows=0";
  dataSuffix = "select?indent=on&q=*:*&wt=json";
  specialChars = new Set(['+','-','&', '|', '!', '(', ')', '{', '}', '[', ']', '^', '"', '~', '*', '?', ':', '\\' ]);
  constructor()
  {
    this.callConfig = { method: 'GET',
                  mode: 'cors',
                  cache: 'default',
                   dataType: 'jsonp',
                   jsonp: 'json.wrf',
                   crossDomain: true,
                  withCredentials: true};
    // this.baseUrl = "http://localhost:8983/solr/wso2_data/";

  }


  getFields()
  {
    var promise = new Promise(resolve => {
      fetch(this.baseUrl+this.fieldsSufix,this.callConfig)
      .then(response => {
        return response.text()
      }).then(body =>{
        //Todo: Add code to extract field details and send them
        var fields = JSON.parse(body).fields;
        resolve(fields)
      });
    });
    return promise;
  }

    getFacetsForSingleField(field,filterQueries,searchText)
    {
      //Generate the request
      var facetText = this.facetSuffix;
      facetText+="&facet.field="+field;
      facetText+="&facet.contains="+this.encodeForSolr(searchText);
      facetText+="&facet.contains.ignoreCase=true";
      facetText+="&facet.limit=10";

      //Add Filters
      facetText+=this.generateFilterQuery(filterQueries);

      //make promise
      var promise = new Promise(resolve => {
        fetch(this.baseUrl+facetText,this.callConfig)
        .then(response => {
          return response.text()
        }).then(body =>{
          //Convert data into a object list list
          let facetFields = this.extractFacetsFromData(body);
          resolve(facetFields[0]) // it has results only for one field. We sends only that data. No need of an array
        });
      });
      return promise;
    }

    getFacetsForAllFields(fields,filterQueries)
    {
        //Generate the request
        var facetText = this.facetSuffix;
        for(let field of fields)
        facetText+="&facet.field="+field;
        facetText+="&facet.limit=10";

        //Add Filters
        facetText+=this.generateFilterQuery(filterQueries);

        //make promise
        var promise = new Promise(resolve => {
          fetch(this.baseUrl+facetText,this.callConfig)
          .then(response => {
            return response.text()
          }).then(body =>{
            //Convert data into a object list list
            let facetFields = this.extractFacetsFromData(body);
            resolve(facetFields)
          });
        });
        return promise;
    }

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
                facetFields.push({field:facetField,facets:facets});
            }
        }
        return facetFields;
    }

    getData(filterQueries,start,rows)
    {
        let dataText = this.dataSuffix;
        for(let fq of filterQueries)
        {
          dataText+="&fq="+fq.field+":"+ this.encodeForSolr(fq.value);
        }

        dataText+="&rows="+rows;
        dataText+="&start="+start;

        var numFound = 0;
        var promise = new Promise(resolve => {
          fetch(this.baseUrl+dataText,this.callConfig)
          .then(response => {
            return response.text()
          }).then(body =>{
            //Todo: Add code to extract field details and send them
            numFound = JSON.parse(body).response.numFound;
            resolve({text:body,url:this.baseUrl+dataText,numFound:numFound, start:start, rows:rows})
          });
        });
        return promise;
    }



  getQuery(url)
  {
    var promise = new Promise(resolve => {
    fetch(this.baseUrl+url,this.callConfig)
    .then(response => {
      return response.text()
    }).then(body =>{
      resolve(body)
    });
    });
    return promise;
  }

  setBaseUrl(url)
  {
      this.baseUrl = url;
  }


  encodeForSolr(str)
  {
      let newStr = "";
      for(let ch of str)
      {
        if(this.specialChars.has(ch))
            newStr+="\\";
        newStr+=ch;
      }
      return newStr;
  }


}

export default SolrClient;
