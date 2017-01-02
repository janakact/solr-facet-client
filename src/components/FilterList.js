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
let Filter = ({filterObject, onClick, onClickFilter, onClickFilterRemove}) => {
    return (
        <ListGroupItem>
            <strong>{filterObject.field?filterObject.field.name+" : ":""}</strong>{getFilterText(filterObject)}
            <a href="#">
                <span className="glyphicon glyphicon-remove pull-right" aria-hidden="true"
                      onClick={()=>onClickFilterRemove(filterObject)}></span>
            </a>
        </ListGroupItem>
    )
}


// List of All Fields
let FilterList = ({filters, onClickAddFilter, onClickFilter, onClickFilterRemove}) => {
    return (
        <Panel bsStyle="info" header="Applied Filters">

            <ListGroup>
                {filters.map((filter, index) =>
                    <Filter
                        key={index}
                        filterObject={filter}
                        onClickFilterRemove={onClickFilterRemove}></Filter>
                )}
            </ListGroup>

            <Button onClick={onClickAddFilter}>Add Filter</Button>
        </Panel>
    );
}
export default FilterList;
