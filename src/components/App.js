import React from "react";
import {Row, Col, Grid} from "react-bootstrap";
import {connect} from "react-redux";
import ConnectionInfo from "../components/ConnectionInfo";
import FieldList from "../components/FieldList";
import FacetsWindow from "../components/FacetsWindow";
import FilterList from "../components/FilterList";
import DataBrowser from "../components/DataBrowser";


const mapStateToProps = (state, ownProps) => ({
    fields: state.fields,
    facetsList: state.facetsList,
    filters: state.filters,
    data: state.data,
    facetsWindow:state.facetsWindow
});
const mapDispatchToProps = (dispatch, ownProps) => ({
    // onClick: () => {
    //   dispatch(toggleSelectField(ownProps.field.name))
    // }
});
let App = ({fields, facetsList, filters, data, facetsWindow}) => (
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
                <DataBrowser data={data} fields={fields} filters={filters}/>
            </Col>
        </Row>
        <Row>
            <Col>
                <FacetsWindow facetsList={facetsList} facetsWindow={facetsWindow} fields={fields}/>
            </Col>
        </Row>
    </div>

)
App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App
