import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AddedFilters from './AddedFilters';
import AvailableFields from './AvailableFields';
import AvailableFacetFields from './AvailableFacetFields';
import SolrClient from './solr-client';
import 'whatwg-fetch';


class App extends Component {


  constructor() {
      super();
      this.selectedAvailableFields = new Set();
      this.state = {
        addedFilters: [],//Array(9).fill({field:"field", value:"value"}),
        availableFields: [], //Array(3).fill({name:"Unknown", type:"uk"}),
        availableFacetFields:[],
        query:"select?indent=on&q=*:*&wt=json",
        baseUrl:"http://localhost:8983/solr/wso2_data/"
      };
      this.solrClient = new SolrClient();
      this.solrClient.setBaseUrl(this.state.baseUrl);

    //   this.addFilter = this.addFilter.bind(this);
      this.submitTest = this.submitTest.bind(this);
      this.requestFields = this.requestFields.bind(this);
      this.requestFacets = this.requestFacets.bind(this);

      //Text Listen
      this.handleChange = this.handleChange.bind(this);
      this.baseUrlChange = this.baseUrlChange.bind(this);
      this.onSchemaSelectionChange = this.onSchemaSelectionChange.bind(this);
      this.onClickFacet = this.onClickFacet.bind(this);
    }

  // addFilter(){
  //   this.setState(prevState => ({
  //     addedFilters: prevState.addedFilters.concat([{field:"field1", value:"value"}])
  //   }));
  // }

  //Handler for test query submission
  submitTest()
  {
        this.solrClient.getQuery(this.state.query)
        .then(body=>{
         this.setState(pre=>({code:body}));
        });
  }

  requestFields()
  {
    //   this.solrClient.getFields
    this.solrClient.getFields()
    .then(data=>{
     this.setState(pre=>({availableFields:data}));
    });
  }

  requestFacets()
  {
    //   this.solrClient.getFields
    this.solrClient.getFacets(this.selectedAvailableFields,this.state.addedFilters)
    .then(data=>{
     this.setState(pre=>({availableFacetFields:data}));
    });
  }

  handleChange(event) {
      this.setState({query: event.target.value});
  }

  baseUrlChange(event) {
      this.solrClient.setBaseUrl(event.target.value);
      this.setState({baseUrl: event.target.value});
  }

  //When user clicks on schema selection
  onSchemaSelectionChange(name,state)
  {
    if(state)
        this.selectedAvailableFields.add(name)
    else
        this.selectedAvailableFields.delete(name)

    // alert(JSON.stringify(this.selectedAvailableFields));
    for (let item of this.selectedAvailableFields) console.log(item);
  }

  onClickFacet(field,value){

       this.setState(pre=>({addedFilters: pre.addedFilters.concat([{field:field, value:value}])}));

  }

  render() {
    //   <div className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <h2>Facet Search</h2>
    //   </div>
    return (
      <div className="App">
        <div>
            <input type="text"
            placeholder="Base URL"
            value={this.state.baseUrl}
            onChange={this.baseUrlChange} className="Input" />

            <button  onClick={this.requestFields}>Request Fields</button>
            <button  onClick={this.requestFacets}>Get Facets</button>

            <AvailableFields fields={this.state.availableFields} onSelectionChange={this.onSchemaSelectionChange} />
            <br/><br/>

            <AvailableFacetFields onClickFacet={this.onClickFacet} fields={this.state.availableFacetFields}/>

                <input type="text"
                placeholder="Hello!"
                value={this.state.query}
                onChange={this.handleChange} className="Input" />


            <button onClick={this.submitTest}>Test</button>


            <AddedFilters addedFilters={this.state.addedFilters}  />
        </div>

        <pre> {this.state.code}</pre>

      </div>
    );
  }
}




export default App;
