import React from "react";
import {connect} from "react-redux";
import {updatePagination} from "../actions";
import {Panel, Well, Pagination, Row, Col, Tab, Tabs} from "react-bootstrap";
import {Table, Column, Cell} from "fixed-data-table";
import DataMap from "./DataMap";


// Data Browser
let PageNav = ({data, dispatch}) => {
    return (
        <div>
            <Row className="show-grid">
                <Col xs={2} md={3}>
                    <label>
                        Records per Page:
                    </label>
                    <select
                        defaultValue={data.rows}
                        onChange={(event) => {
                            dispatch(updatePagination(data.start - data.start % event.target.value, event.target.value))
                        }}>
                        <option value="1">1</option>
                        <option value="10">10</option>
                        <option value="100">100</option>
                        <option value="1000">1000</option>
                        <option value="10000">*10000</option>
                    </select>
                </Col>
                <Col xs={2} md={8}>
                    <Pagination
                        prev
                        next
                        first
                        last
                        ellipsis
                        boundaryLinks
                        items={Math.ceil(data.numFound / data.rows)}
                        maxButtons={5}
                        activePage={1 + (Math.ceil(data.start / data.rows))}
                        onSelect={(eventKey) => {
                            dispatch(updatePagination((eventKey - 1) * data.rows, data.rows))
                        }}/>
                </Col>
            </Row>
        </div>
    );
}
PageNav = connect()(PageNav)


let TableView = ({data}) => {
    return (
        <Table
            rowHeight={30}
            rowsCount={data.docs.length}
            width={1100}
            height={340}
            headerHeight={40}>

            <Column
                header="#"
                cell={({rowIndex, ...props}) => (
                    <Cell>
                        {rowIndex + 1 + data.start}
                    </Cell>
                )}
                width={100}
            />
            {data.columnNames.map((columnName, index) =>

                <Column
                    key={index}
                    header={
                        <Cell>
                            {columnName}
                        </Cell>
                    }
                    cell={({rowIndex, ...props}) => (
                        <Cell {...props}>
                            {data.docs[rowIndex][columnName]}
                        </Cell>
                    )}
                    width={100}
                />
            )}
        </Table>
    )
};


let DataBrowser = ({data}) => {
    return (
        <Panel bsStyle="info" header="Data Browser">
            <PageNav data={data}/>
            <Well bsSize="small">URL: <a href={data.url}><code >{data.url}</code></a></Well>

            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                <Tab eventKey={1} title="Table">
                    <h4>Airport_Details</h4>
                    <TableView data={data}/>
                </Tab>

                <Tab eventKey={2} title="JSON Response">
                <pre className="pre-scrollable">
                {data.jsonResponse}
                </pre>
                </Tab>

                <Tab eventKey={3} title="Map">
                    <DataMap data={data}/>
                </Tab>
            </Tabs>

        </Panel>
    );
}
export default DataBrowser;
