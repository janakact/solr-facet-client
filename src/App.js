import React, { Component } from 'react';
import { Button, Panel } from 'react-bootstrap';
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
        loadedData:{start:0,rows:10, columnNames:[], docs:[]},
        geoOverview:{},
        query:"select?indent=on&q=*:*&wt=json",
        baseUrl:"http://localhost:8983/solr/gettingstarted/"
        };
        this.solrClient = new SolrClient();
        this.solrClient.setBaseUrl(this.state.baseUrl);

        //   this.addFilter = this.addFilter.bind(this);
        this.submitTest = this.submitTest.bind(this);
        this.requestFields = this.requestFields.bind(this);
        this.requestFacets = this.requestFacets.bind(this);
        this.requestFacetsSingleField = this.requestFacetsSingleField.bind(this);
        this.requestData = this.requestData.bind(this);
        this.requestOverview = this.requestOverview.bind(this);

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
            loadedData:{start:0,rows:10, columnNames:[], docs:[]},
            geoOverview:{}
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
        this.solrClient.getFacetsForAllFields(fieldList,this.addedFilters)
        .then(data=>{
        this.setState(pre=>({availableFacetFields:data}));
        });
    }

    requestFacetsSingleField(searchRequest)
    {
        this.solrClient.getFacetsForSingleField(searchRequest.field,this.addedFilters,searchRequest.text)
        .then( result=>{
            for(var i of this.state.availableFacetFields)
                if(i.field===searchRequest.field)
                {
                    i.facets = result.facets;
                    i.searchText = result.searchText;

                    break;
                }
                    //this.state.availableFacetFields.push(result);
            this.setState(pre=>({
                availableFacetFields:this.state.availableFacetFields
            }));
        });
    }



    requestData(offset,count)
    {
        //append to the promise
        this.solrClient.getData(this.addedFilters,offset,count)
        .then((data)=>{
        this.setState(pre=>({loadedData:data}));
        });

        this.requestOverview();
    }

    requestOverview()
    {
        this.solrClient.getGeoOverview(this.addedFilters,"Location")
        .then( data=> {

            // console.log("At Request:-\n"+ JSON.stringify(data));
            this.setState(pre => ({geoOverview:data}));
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
    //TODO comment to dinable field dissapiar:
    this.blockedFields.add(field);
    this.setState(pre=>({addedFilters: Array.from(this.addedFilters)}));
    // console.log(JSON.stringify(Array.from(this.addedFilters)));
    this.requestFacets();
    this.requestData(0,this.state.loadedData.rows);
  }

  onRemoveFilterClick(fl)
  {
      this.addedFilters.delete(fl);
      this.blockedFields.delete(fl.field);
      this.setState(pre=>({addedFilters: Array.from(this.addedFilters)}));
      this.requestFacets();
      this.requestData(0,this.state.loadedData.rows);
  }

  render() {
    //   <div className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <h2>Facet Search</h2>
    //   </div>
    return (
      <div className="App">
            <input type="text"
            placeholder="Base URL"
            value={this.state.baseUrl}
            onChange={this.baseUrlChange} className="Input" />

        <Button bsStyle="primary" onClick={this.requestFields}>Request Fields</Button><br/><br/>

            <AvailableFields
                fields={this.state.availableFields}
                onSelectionChange={this.onSchemaSelectionChange}
                onRequestFacets={this.requestFacets} />



            <Panel  bsStyle="info" header="Drilldown Options">
                <AddedFilters
                    addedFilters={this.state.addedFilters}
                    onRemoveClick={this.onRemoveFilterClick} />

                <AvailableFacetFields
                    onClickFacet={this.onClickFacet}
                    onSearchTextChange={this.requestFacetsSingleField}
                    fields={this.state.availableFacetFields} />
            </Panel>



            <DataBrowser
                data={this.state.loadedData}
                onPageSelect={this.requestData}
                geoOverview={this.state.geoOverview}> </DataBrowser>


            {/*
            <input type="text"
                placeholder="Hello!"
                value={this.state.query}
                onChange={this.handleChange} className="Input" />
            <button onClick={this.submitTest}>Test</button>
            <pre> {this.state.code}</pre>*/}

      </div>
    );
  }
}




export default App;
