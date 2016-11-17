import React from 'react'
import { connect } from 'react-redux'
import ConnectionInfo from '../components/ConnectionInfo'
import FieldList from '../components/FieldList'
import FacetsList from '../components/FacetsList'


const mapStateToProps = (state, ownProps) => ({fields:state.query.fields, facetsList:state.query.facetsList});
const mapDispatchToProps = (dispatch, ownProps) => ({
  // onClick: () => {
  //   dispatch(toggleSelectField(ownProps.field.name))
  // }
});
let App = ({fields,facetsList}) => (
  <div>
      lol
    <ConnectionInfo/>
    <FieldList fields={fields}/>
    <FacetsList facetsList={facetsList}/>
  </div>
)
App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App
