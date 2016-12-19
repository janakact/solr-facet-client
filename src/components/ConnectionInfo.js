import React from "react";
import {connect} from "react-redux";
import {setBaseurl, removeFetchingError} from "../actions";
import {Row, Col, Alert} from "react-bootstrap";

let ConnectionInfo = ({dispatch, baseUrl, fetchingErrors}) => {
    let input;//
    //input.value = "http://localhost:8983/solr/gettingstarted/";

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
                <Col  xs={8} md={10}>
                <input width={400}
                       className="form-control"
                       defaultValue={baseUrl}
                       ref={node => {
                           input = node
                       }}/>
                </Col>

                <Col  xs={4} md={2}>
                <button type="submit">
                    Connect
                </button>
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
