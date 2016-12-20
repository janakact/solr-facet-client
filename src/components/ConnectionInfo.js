import React from "react";
import {connect} from "react-redux";
import {setBaseurl, removeFetchingError, loadFromFile} from "../actions";
import {Row, Col, Alert} from "react-bootstrap";

let ConnectionInfo = ({dispatch, baseUrl, fetchingErrors, generateQueryObject}) => {
    let input;//
    //input.value = "http://localhost:8983/solr/gettingstarted/";
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(generateQueryObject()));

    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    if (!input.value.trim()) {
                        return
                    }
                    dispatch(setBaseurl(input.value))
                }}>

                <Row>
                    <Col xs={8} md={4}>
                        <input width={400}
                               className="form-control"
                               defaultValue={baseUrl}
                               ref={node => {
                                   input = node
                               }}/>
                    </Col>

                    <Col xs={4} md={2}>
                        <button type="submit">
                            Connect
                        </button>
                    </Col>
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
                </Row>

            </form>
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
