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
import React from 'react'
import {connect} from 'react-redux'
import {Panel} from 'react-bootstrap'
import {setSort} from '../actions'

// List of All Fields
let SortBy = ({sort, fields, dispatch}) => {
    return (
        <Panel bsStyle="info" header="Sort">
            <label>Sort By : </label>
            <select
                onChange={
                    (e) => dispatch(setSort({field:fields[e.target.value]}))
                }
                defaultValue="">
                <option value={null} >--Please select a field---</option>
                {Object.keys(fields).map((fieldName) => <option key={fieldName} value={fieldName}>{fieldName}</option>)}
            </select>
            {

            }
            <label>Type : </label>
            <select
                onChange={
                    (e) => dispatch(setSort({type:e.target.value}))
                }
                defaultValue="">
                <option value="asc" >ASC</option>
                <option value="desc" >DESC</option>
            </select>
        </Panel>
    );
}
SortBy = connect()(SortBy);
export default SortBy;