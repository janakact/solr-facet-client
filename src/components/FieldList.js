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
import {showFacetsWindow} from "../actions";
import {Panel, OverlayTrigger, Tooltip, ListGroupItem, ListGroup, Popover} from "react-bootstrap";


const tooltip = (stats) => {
        if (!stats) return (<Tooltip id="tooltip"><span><strong>No Stats Available</strong></span></Tooltip>)
        else
            return (
                <Popover id="tooltip"
                         title="Stats">
      <ul>
  {stats && Object.keys(stats).map((key) => (<li key={key }> {key} : {stats[key]}  </li>))}
  </ul>

                </Popover>
            )
    }
    ;

const tooltip2 = (
    <Tooltip id="tooltip"><strong>Holy guacamole!</strong> Check this info.</Tooltip>
);


// Single Field
const mapStateToPropsField = (state, ownProps) => ({});
const mapDispatchToPropsField = (dispatch, ownProps) => ({
    onClick: () => {
        dispatch(showFacetsWindow(ownProps.field.name))
    }
});
let Field = ({field, onClick}) => {
    return (
        <OverlayTrigger placement="right" overlay={tooltip(field.stats)}>
        <ListGroupItem
            onClick={onClick}>

                <span><strong>{field.name}</strong></span>
        </ListGroupItem>
        </OverlayTrigger>
    )
}
Field = connect(mapStateToPropsField, mapDispatchToPropsField)(Field);


// List of All Fields
let FieldList = ({fields}, dispatch) => {
    return (
        <Panel bsStyle="info" header="Available Fields">
            <ListGroup>
                {Object.keys(fields).map((fieldName, index) =>

                        <Field
                            key={fieldName}
                            field={fields[fieldName]}></Field>
                )}
            </ListGroup>
        </Panel>
    );
}
export default FieldList;
