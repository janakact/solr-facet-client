import React from 'react'
import { connect } from 'react-redux'
import ConnectionInfo from '../components/ConnectionInfo'
import FieldList from '../components/FieldList'
import FacetsList from '../components/FacetsList'
import FilterList from '../components/FilterList'


const mapStateToProps = (state, ownProps) => ({fields:state.fields, facetsList:state.facetsList, filters:state.filters});
const mapDispatchToProps = (dispatch, ownProps) => ({
  // onClick: () => {
  //   dispatch(toggleSelectField(ownProps.field.name))
  // }
});
let App = ({fields,facetsList, filters}) => (
  <div>
      lol
    <ConnectionInfo/>
    <FieldList fields={fields}/>
    <FilterList filters={filters} />
    <FacetsList facetsList={facetsList}/>
  </div>
)
App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App
