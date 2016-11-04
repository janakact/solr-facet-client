import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
// import logo from './logo.svg';
import './App.css';
import AddedFilters from './AddedFilters';
import AvailableFields from './AvailableFields';
import AvailableFacetFields from './AvailableFacetFields';
import DataBrowser from './DataBrowser';
import SolrClient from './solr-client';
import 'whatwg-fetch';


class App extends Component {


  constructor() {
        super();
        this.selectedAvailableFields = new Set();
        this.blockedFields = new Set();
        this.addedFilters = new Set();
        this.state = {
        addedFilters: [],//Array(9).fill({field:"field", value:"value"}),
        availableFields: [], //Array(3).fill({name:"Unknown", type:"uk"}),
        availableFacetFields:[],
        loadedData:{rows:10},
        query:"select?indent=on&q=*:*&wt=json",
        baseUrl:"http://localhost:8983/solr/wso2_data/"
        };
        this.solrClient = new SolrClient();
        this.solrClient.setBaseUrl(this.state.baseUrl);

        //   this.addFilter = this.addFilter.bind(this);
        this.submitTest = this.submitTest.bind(this);
        this.requestFields = this.requestFields.bind(this);
        this.requestFacets = this.requestFacets.bind(this);
        this.requestData = this.requestData.bind(this);

        //Text Listen
        this.handleChange = this.handleChange.bind(this);
        this.baseUrlChange = this.baseUrlChange.bind(this);
        this.onSchemaSelectionChange = this.onSchemaSelectionChange.bind(this);
        this.onClickFacet = this.onClickFacet.bind(this);
        this.onRemoveFilterClick = this.onRemoveFilterClick.bind(this);
    }

    resetState()
    {
        this.selectedAvailableFields = new Set();
        this.addedFilters = new Set();
        this.blockedFields = new Set();
        this.setState({
            addedFilters: [],//Array(9).fill({field:"field", value:"value"}),
            availableFields: [], //Array(3).fill({name:"Unknown", type:"uk"}),
            availableFacetFields:[],
            loadedData:{rows:10}
        })
    }

  // addFilter(){
  //   this.setState(prevState => ({
  //     addedFilters: prevState.addedFilters.concat([{field:"field1", value:"value"}])
  //   }));
  // }

  //Handler for test query submission
  componentDidMount()
  {
      this.requestFields();
  }

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
    this.resetState();
    this.solrClient.getFields()
    .then(data=>{
     this.setState(pre=>({availableFields:data}));
     this.requestData(0,this.state.loadedData.rows);
    });
  }

  requestFacets()
  {
     var fieldList = [];
     for(let fld of this.selectedAvailableFields)
     {
         if(this.blockedFields.has(fld)) continue;
         fieldList.push(fld);
     }

    //append to the promise
    this.solrClient.getFacets(fieldList,this.addedFilters)
    .then(data=>{
     this.setState(pre=>({availableFacetFields:data}));
     this.requestData(0,this.state.loadedData.rows);
    });
  }

    requestData(offset,count)
    {
        //append to the promise
        this.solrClient.getData(this.addedFilters,offset,count)
        .then((data)=>{
        this.setState(pre=>({loadedData:data}));
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
  onSchemaSelectionChange(fieldName,state)
  {
    if(state)
        this.selectedAvailableFields.add(fieldName)
    else
    {
        var canDelete = true;
        for(let fl of this.addedFilters)
        {
            if(fieldName===fl.field)
            {
                canDelete= false;
                break;
            }
        }
        if (canDelete || confirm('Are you sure you want to remove the field, applied filters will be removed too?')) {
            //remove field as well ass added filters from that field
            this.selectedAvailableFields.delete(fieldName)
            this.blockedFields.delete(fieldName);
            for(let fl of this.addedFilters)
            {
                if(fieldName===fl.field)
                {
                    this.addedFilters.delete(fl);
                }
            }
        }
        else {
            return false
        }
    }

    // alert(JSON.stringify(this.selectedAvailableFields));
    // for (let item of this.selectedAvailableFields) console.log(item);
    this.setState(pre=>({addedFilters: Array.from(this.addedFilters)}));
    this.requestFacets();
    return true;
  }

  onClickFacet(field,value){
    this.addedFilters.add({field:field, value:value});
    this.blockedFields.add(field);
    this.setState(pre=>({addedFilters: Array.from(this.addedFilters)}));
    // console.log(JSON.stringify(Array.from(this.addedFilters)));
    this.requestFacets();
  }

  onRemoveFilterClick(fl)
  {
      this.addedFilters.delete(fl);
      this.blockedFields.delete(fl.field);
      this.setState(pre=>({addedFilters: Array.from(this.addedFilters)}));
      this.requestFacets();
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

        <Button bsStyle="primary" onClick={this.requestFields}>Request Fields</Button><br/><br/>

            <AvailableFields fields={this.state.availableFields} onSelectionChange={this.onSchemaSelectionChange} onRequestFacets={this.requestFacets} />

            <AvailableFacetFields onClickFacet={this.onClickFacet} fields={this.state.availableFacetFields}/>


            <AddedFilters addedFilters={this.state.addedFilters} onRemoveClick={this.onRemoveFilterClick} />




            <DataBrowser data={this.state.loadedData} onPageSelect={this.requestData}> </DataBrowser>
                <input type="text"
                placeholder="Hello!"
                value={this.state.query}
                onChange={this.handleChange} className="Input" />


            <button onClick={this.submitTest}>Test</button>


        </div>

        <pre> {this.state.code}</pre>

      </div>
    );
  }
}




export default App;
