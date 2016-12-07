import React from "react";
import {Row, Col, Grid} from "react-bootstrap";
import {connect} from "react-redux";
import ConnectionInfo from "../components/ConnectionInfo";
import FieldList from "../components/FieldList";
import FacetsWindow from "../components/FacetsWindow";
import FilterList from "../components/FilterList";
import DataBrowser from "../components/DataBrowser";
import SortBy from './SortBy'
import TimeSlider from './TimeSlider'


const mapStateToProps = (state, ownProps) => ({
    fields: state.fields,
    facetsList: state.facetsList,
    filters: state.filters,
    data: state.data,
    facetsWindow: state.facetsWindow,
    sort: state.sort,
    timeSliderOptions:state.timeSliderOptions
});
const mapDispatchToProps = (dispatch, ownProps) => ({
    // onClick: () => {
    //   dispatch(toggleSelectField(ownProps.field.name))
    // }
});
let App = ({fields, facetsList, filters, data, facetsWindow, sort, timeSliderOptions}) => (
    <div>
        <Row className="show-grid">
            <Col xs={12} md={12}>
                <ConnectionInfo/>
            </Col>
        </Row>
        <Row>
            <Col xs={12} md={2}>
                <SortBy fields={fields} sort={sort}/>
                <FilterList filters={filters}/>
                <FieldList fields={fields}/>
            </Col>
            <Col xs={12} md={10}>
                <TimeSlider facetsList={facetsList} fields={fields} timeSliderOptions={timeSliderOptions}/>
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
