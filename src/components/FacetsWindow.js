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
import React from 'react';
import {connect} from 'react-redux'
import {Modal} from 'react-bootstrap'
import Facets from './facets/'
import {hideFacetsWindow, showFacetsWindow} from "../actions";

let FacetsWindow = ({facetsWindow, facetsList, fields, dispatch}) => {
    return (
        <Modal bsSize="large" show={facetsWindow.show} onHide={()=>dispatch(hideFacetsWindow())}>
            <Modal.Header closeButton>
                <Modal.Title>Filter Options</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label>Field : </label>
                <select
                    onChange={(e) => dispatch(showFacetsWindow(e.target.value))}
                    value={facetsWindow.fieldName} defaultValue="">
                    <option value={null} >--Please select a field---</option>
                    {Object.keys(fields).map((fieldName) => <option key={fieldName} value={fieldName}>{fieldName}</option>)}
                </select>
                <br/>
                <br/>
                {(facetsWindow.fieldName===null) && "Please Select a field"}
                {(facetsList[facetsWindow.fieldName]) && <Facets facets={facetsList[facetsWindow.fieldName]} onAddFilter={()=>dispatch(hideFacetsWindow())}/>}
            </Modal.Body>
        </Modal>
    )
}
FacetsWindow = connect()(FacetsWindow);
export default FacetsWindow;