import 'whatwg-fetch';

class SolrClient
{
  baseUrl = "";
  constructor()
  {
    this.callConfig = { method: 'GET',
                  mode: 'cors',
                  cache: 'default',
                   dataType: 'jsonp',
                   jsonp: 'json.wrf',
                   crossDomain: true,
                  withCredentials: true};
    this.baseUrl = "http://localhost:8983/solr/wso2_data/";
  }


  getFields(url)
  {
    var promise = new Promise(resolve => {
      fetch(this.baseUrl+url,this.callConfig)
      .then(response => {
        return response.text()
      }).then(body =>{
        //Todo: Add code to extract field details and send them
        resolve(body)
      });
    });
    return promise;
  }



}

export default SolrClient;
