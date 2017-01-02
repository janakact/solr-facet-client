/*
 *  Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */
import React from "react";
import {Row, Col} from "react-bootstrap";
import {connect} from "react-redux";
import ConnectionInfo from "../components/ConnectionInfo";
import FieldList from "../components/FieldList";
import FacetsWindow from "../components/FacetsWindow";
import FilterList from "../components/FilterList";
import DataBrowser from "../components/DataBrowser";
import SortBy from './SortBy'
import TimeSlider from './TimeSlider'
import SavedQueryView from './SavedQueryView'
import filterTypes from '../constants/FilterTypes'


//Actions
import {hideFacetsWindow, showFacetsWindow, removeFilter, addFilter, removeFetchingError, setBaseurl} from "../actions/index";

const generateQueryObject = (state) => {
    let queryState = {
        baseUrl: state.baseUrl,
        filters: state.filters,
        sort: state.sort,
        timeSliderOptions: state.timeSliderOptions
    }
    return queryState;
}

const mapStateToProps = (state, ownProps) => ({
    fields: state.fields,
    facetsList: state.facetsList,
    filters: state.filters,
    data: state.data,
    facetsWindow: state.facetsWindow,
    sort: state.sort,
    timeSliderOptions: state.timeSliderOptions,
    baseUrl: state.baseUrl,
    fetchingUrls: state.fetchingUrls,
    fetchingErrors: state.fetchingErrors,
    savedQueries: state.savedQueries,
    generateQueryObject: () => generateQueryObject(state)
});
const mapDispatchToProps = (dispatch, ownProps) => ({
    onClickField: (field) => {
        dispatch(showFacetsWindow(field.name))
    },
    onClickAddFilterInFilterList: (filter) => {
        dispatch(showFacetsWindow())
    },
    onClickFilterRemove: (filterObject) => {
        dispatch(removeFilter(filterObject))
    },
    onHideFacetsWindow: () => {
        dispatch(hideFacetsWindow());
    },
    onSelectFieldInFacetsWindow: (fieldName) => {
        dispatch(showFacetsWindow(fieldName))
    },
    onAddCustomFilterInFacetsWindow: (content) => {
        dispatch(addFilter({type: filterTypes.CUSTOM, content: content}))
    },
    onSubmitConnectionInfo: (url) => {
        dispatch(setBaseurl(url))
    },
    onClickFetchingErrorCloseIcon: (error) => {
        dispatch(removeFetchingError(error))
    }

});
let App = ({
    fields,
    facetsList,
    filters,
    data,
    facetsWindow,
    sort,
    timeSliderOptions,
    baseUrl,
    fetchingErrors,
    fetchingUrls,
    generateQueryObject,
    savedQueries,

    onClickField,
    onClickAddFilterInFilterList,
    onClickFilterRemove,
    onHideFacetsWindow,
    onSelectFieldInFacetsWindow,
    onAddCustomFilterInFacetsWindow,
    onSubmitConnectionInfo,
    onClickFetchingErrorCloseIcon
}) => {


    return (
        <div>
            <Row className="show-grid">
                <Col xs={12} md={12}>
                    <ConnectionInfo baseUrl={baseUrl}
                                    fetchingErrors={fetchingErrors}
                                    fetchingUrls={fetchingUrls}
                                    generateQueryObject={generateQueryObject}
                                    onSubmit={onSubmitConnectionInfo}
                                    onRemoveFetchingError={onClickFetchingErrorCloseIcon}/>
                    <br/>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={2}>
                    <SavedQueryView savedQueries={savedQueries}/>
                    <FilterList filters={filters} onClickAddFilter={onClickAddFilterInFilterList}
                                onClickFilterRemove={onClickFilterRemove}/>
                    <FieldList fields={fields} onClickField={onClickField}/>
                </Col>
                <Col xs={12} md={10}>
                    <TimeSlider facetsList={facetsList} fields={fields} timeSliderOptions={timeSliderOptions}/>
                    <DataBrowser data={data} fields={fields} filters={filters} sort={sort}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FacetsWindow facetsList={facetsList}
                                  facetsWindow={facetsWindow}
                                  fields={fields}
                                  onHide={onHideFacetsWindow}
                                  onSelectField={onSelectFieldInFacetsWindow}
                                  onAddCustomFilter={onAddCustomFilterInFacetsWindow}/>
                </Col>
            </Row>
        </div>

    )
}
App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App
