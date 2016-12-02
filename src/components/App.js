import React from "react";
import {Row, Col, Grid} from "react-bootstrap";
import {connect} from "react-redux";
import ConnectionInfo from "../components/ConnectionInfo";
import FieldList from "../components/FieldList";
import FacetsList from "../components/FacetsList";
import FilterList from "../components/FilterList";
import DataBrowser from "../components/DataBrowser";


const mapStateToProps = (state, ownProps) => ({
    fields: state.fields,
    facetsList: state.facetsList,
    filters: state.filters,
    data: state.data
});
const mapDispatchToProps = (dispatch, ownProps) => ({
    // onClick: () => {
    //   dispatch(toggleSelectField(ownProps.field.name))
    // }
});
let App = ({fields, facetsList, filters, data}) => (
    <div>
        <Row className="show-grid">
            <Col xs={12} md={12}>
                <ConnectionInfo/>
            </Col>
        </Row>
        <Row>
            <Col xs={12} md={2}>
                <FilterList filters={filters}/>
                <FieldList fields={fields}/>
            </Col>
            <Col xs={12} md={10}>
                <DataBrowser data={data}/>
            </Col>
        </Row>
        <Row>
            <Col>
                <FacetsList facetsList={facetsList}/>
            </Col>
        </Row>
    </div>

)
App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App
