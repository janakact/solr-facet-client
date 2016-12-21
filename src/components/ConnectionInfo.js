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
import {setBaseurl, removeFetchingError, loadFromFile} from "../actions";
import {Row, Col, Alert} from "react-bootstrap";



//A view to down load and re upload current query.
const DownloadQueryView = ({dataStr, dispatch}) =>
        <Col>
            <Row>
                <Col xs={4} md={3}>
                    <label>Download current query:</label><br/>
                    <a download={"query.json"} href={dataStr}>query.json</a>
                </Col>
                <Col xs={4} md={3}>
                    <label>Load from a file:</label>
                    <input type="file" onChange={e => {
                        try {
                            var file = e.target.files[0];

                            if (file) {
                                var reader = new FileReader();
                                reader.readAsText(file, "UTF-8");
                                reader.onload = function (evt) {
                                    console.log(evt.target.result);
                                    dispatch(loadFromFile(evt.target.result));
                                }
                                reader.onerror = function (evt) {
                                    console.log("Error reading file");
                                }
                            }
                        }
                        catch (Exception) {
                            console.log("Fail to load");
                        }

                    }} id="input"/>

                </Col>
            </Row>
        </Col>
    ;

let ConnectionInfo = ({dispatch, baseUrl, fetchingErrors, generateQueryObject}) => {
    let input;//
    //input.value = "http://localhost:8983/solr/gettingstarted/";
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(generateQueryObject()));

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
                            dispatch(setBaseurl(input.value))
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
                <Alert key={error.url} bsStyle="danger" onDismiss={()=>dispatch(removeFetchingError(error))}>
                    <strong>{error.title}: </strong> {error.url}
                </Alert>
            ))}
        </div>
    )
}
ConnectionInfo = connect()(ConnectionInfo)

export default ConnectionInfo
