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
import {Modal} from 'react-bootstrap'
import Facets from './facets/'

let FacetsWindow = ({facetsWindow, facetsList, fields, onHide, onSelectField, onAddCustomFilter}) => {
    let input;
    return (
        <Modal bsSize="large" show={facetsWindow.show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Filter Options</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label>Field : </label>
                <select
                    onChange={(e) => onSelectField(e.target.value)}
                    value={facetsWindow.fieldName} defaultValue="">
                    <option value={null}>--Please select a field---</option>
                    {Object.keys(fields).map((fieldName) => <option key={fieldName}
                                                                    value={fieldName}>{fieldName}</option>)}
                </select>
                <br/>
                <br/>
                {((!facetsWindow.fieldName) || facetsWindow.fieldName === '--Please select a field---') &&
                <div>
                    <form
                        className="form-inline"
                        onSubmit={e => {
                            e.preventDefault()
                            if (!input.value.trim()) {
                                return;
                            }
                            onAddCustomFilter(input.value);
                            onHide();
                        }}>


                        <label>Enter Custom Query: fq=</label>
                        <input width={400}
                               className="form-control"
                               defaultValue=""
                               ref={node => {
                                   input = node
                               }}/>

                        <button type="submit">
                            Add
                        </button>
                    </form>
                </div>
                }
                {(facetsList[facetsWindow.fieldName]) &&
                <Facets facets={facetsList[facetsWindow.fieldName]} onAddFilter={onHide}/>}
            </Modal.Body>
        </Modal>
    )
}
export default FacetsWindow;