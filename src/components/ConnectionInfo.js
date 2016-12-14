import React from "react";
import {connect} from "react-redux";
import {requestFields} from "../actions";
import {Row, Col} from "react-bootstrap";

let ConnectionInfo = ({dispatch}) => {
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
                    dispatch(requestFields(input.value))
                }}>
            <Row>
                <Col  xs={8} md={10}>
                <input width={400}
                       className="form-control"
                       defaultValue="http://localhost:8983/solr/air/"
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
        </div>
    )
}
ConnectionInfo = connect()(ConnectionInfo)

export default ConnectionInfo
