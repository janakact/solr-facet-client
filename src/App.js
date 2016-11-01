import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AddedFilters from './AddedFilters';
import SolrClient from './solr-client';
import 'whatwg-fetch';


class App extends Component {

  constructor() {
      super();
      this.state = {
        addedFilters: Array(9).fill({field:"field", value:"value"}),
        query:"http://localhost:8983/solr/wso2_data/select?indent=on&q=*:*&wt=json"
      };

      this.addFilter = this.addFilter.bind(this);
      this.submitTest = this.submitTest.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }

  addFilter(){
    this.setState(prevState => ({
      addedFilters: prevState.addedFilters.concat([{field:"field1", value:"value"}])
    }));
  }

  submitTest()
  {
    // var myInit = { method: 'GET',
    //                mode: 'cors',
    //                cache: 'default',
    //                 dataType: 'jsonp',
    //                 jsonp: 'json.wrf',
    //                 crossDomain: true,
    //                withCredentials: true};
    // //fetch('http://localhost:8983/solr/wso2_data/select?indent=on&q=*:*&wt=json',myInit)
    // fetch(this.state.query,myInit)
    // .then(response => {
    //   return response.text()
    // }).then(body =>{
    //   this.setState(pre => ({code:body}))
    // });

   var client = new SolrClient();
   client.getFields("select?indent=on&q=*:*&wt=json")
   .then(body=>{
     this.setState(pre=>({code:body}));
   });


  }

  handleChange(event) {
      this.setState({query: event.target.value});
  }


  render() {
    return (
      <div className="App">



        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Facet Search</h2>
        </div>



        <div>
        <button onClick={this.addFilter}>Add</button><br/>


          <input type="text"
          placeholder="Hello!"
          value={this.state.query}
          onChange={this.handleChange} />
        <button onClick={this.submitTest}>Test</button>


        <AddedFilters addedFilters={this.state.addedFilters} />
        </div>

        <textarea value= {this.state.code}></textarea>

      </div>
    );
  }
}




export default App;
