import React from 'react'
import { connect } from 'react-redux'
import ConnectionInfo from '../components/ConnectionInfo'
import FieldList from '../components/FieldList'
import FacetsList from '../components/FacetsList'
import FilterList from '../components/FilterList'
import DataBrowser from '../components/DataBrowser'
import ReactSlider from 'react-slider'


const mapStateToProps = (state, ownProps) => ({
    fields:state.fields,
    facetsList:state.facetsList,
    filters:state.filters,
    data:state.data});
const mapDispatchToProps = (dispatch, ownProps) => ({
  // onClick: () => {
  //   dispatch(toggleSelectField(ownProps.field.name))
  // }
});
let App = ({fields,facetsList, filters, data}) => (
  <div>
    <ConnectionInfo/>
    <FieldList fields={fields}/>
    <FilterList filters={filters} />
    <FacetsList facetsList={facetsList}/>
    <DataBrowser data={data}/>

                            <ReactSlider defaultValue={50}  />
  </div>
)
App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App
