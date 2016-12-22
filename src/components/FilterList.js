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
import {connect} from "react-redux";
import {removeFilter, showFacetsWindow} from "../actions";
import {Panel, ListGroupItem, ListGroup, Button} from "react-bootstrap";
import filterTypes from "../constants/FilterTypes";


const getFilterText = (filterObj) => {
    switch (filterObj.type) {
        case filterTypes.TEXT_FILTER:
            return filterObj.query;
        case filterTypes.NUMERIC_RANGE_FILTER:
            let range = filterObj.range
            if (filterObj.field.type === 'date')
                range = filterObj.range.map((item) => (new Date(item).toISOString()))
            return '[' + range[0] + ' TO ' + range[1] + ']';
        case filterTypes.GEO_SHAPE:
            return JSON.stringify(filterObj.shapes.map(shape=>shape.type));
        case filterTypes.CUSTOM:
            return filterObj.content;
        default:
            return "<Undefined Filter>"

    }
}


// Single Field
const mapStateToPropsField = (state, ownProps) => ({});
const mapDispatchToPropsField = (dispatch, ownProps) => ({
    onClick: () => {
        dispatch(removeFilter(ownProps.filterObject))
    }
});
let Filter = ({filterObject, onClick}) => {
    return (
        <ListGroupItem>
            <strong>{filterObject.field?filterObject.field.name+" : ":""}</strong>{getFilterText(filterObject)}
            <a href="#">
                <span className="glyphicon glyphicon-remove pull-right" aria-hidden="true" onClick={onClick}></span>
            </a>
        </ListGroupItem>
    )
}
Filter = connect(mapStateToPropsField, mapDispatchToPropsField)(Filter);


// List of All Fields
let FilterList = ({filters, dispatch}) => {
    return (
        <Panel bsStyle="info" header="Applied Filters">

            <ListGroup>
                {filters.map((filter, index) =>
                    <Filter
                        key={index}
                        filterObject={filter}></Filter>
                )}
            </ListGroup>

            <Button onClick={()=> dispatch(showFacetsWindow())}>Add Filter</Button>
        </Panel>
    );
}
FilterList = connect()(FilterList);
export default FilterList;
