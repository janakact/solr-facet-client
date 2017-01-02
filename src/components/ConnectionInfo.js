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
import {Row, Col, Alert} from "react-bootstrap";

let ConnectionInfo = ({baseUrl, fetchingErrors, onSubmit, onRemoveFetchingError}) => {
    let input;
    return (
        <div>

            <Row>
                <Col xs={8} md={4}>
                    <form
                        className="form-inline"
                        onSubmit={e => {
                            e.preventDefault()
                            if (!input.value.trim()) {
                                return
                            }
                            onSubmit(input.value);
                        }}>

                        <input width={400}
                               className="form-control"
                               defaultValue={baseUrl}
                               ref={node => {
                                   input = node
                               }}/>

                        <button type="submit">
                            Connect
                        </button>
                    </form>
                </Col>
                {/*<DownloadQueryView dispatch={dispatch} dataStr={dataStr} />*/}
            </Row>

            {fetchingErrors.map((error)=>(
                <Alert key={error.url} bsStyle="danger" onDismiss={()=>onRemoveFetchingError(error)}>
                    <strong>{error.title}: </strong> {error.url}
                </Alert>
            ))}
        </div>
    )
}
export default ConnectionInfo
