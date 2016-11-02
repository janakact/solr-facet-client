import 'whatwg-fetch';

class SolrClient
{
  baseUrl = "";
  fieldsSufix = "schema/fields";
  facetSuffix = "select?facet=on&indent=on&q=*:*&wt=json";
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

  getFacets(fields,filterQueries)
  {
    //Generate the request
    var facetText = this.facetSuffix;
    for(let field of fields)
    facetText+="&facet.field="+field;

    alert(JSON.stringify(filterQueries))
    for(let fq of filterQueries)
    {
        facetText+="&fq="+fq.field+":"+fq.value;
    }

    //make promise
    var promise = new Promise(resolve => {
      fetch(this.baseUrl+facetText,this.callConfig)
      .then(response => {
        return response.text()
      }).then(body =>{
        //Convert data into a object list list
        var facetsData = JSON.parse(body).facet_counts.facet_fields;
        var facetFields = [];
        for(let facetField in facetsData)   //take facet data for a specific field
        {
            let facetArray = facetsData[facetField];
            let facets = [];
            for(var i=0; i<facetArray.length;i+=2)  //loop through facet data array and convert them to (value,count) pairs
            {
                facets.push({value:facetArray[i],count:facetArray[i+1]})
            }
            facetFields.push({field:facetField,facets:facets});
        }
        resolve(facetFields)
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



}

export default SolrClient;
