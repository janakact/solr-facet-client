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
import {updatePagination, setSort, promptDownload} from "../actions";
import {Panel, Well, Pagination, Row, Col, Tab, Tabs, FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import {Table, Column, Cell} from "fixed-data-table";
import DataMap from "./DataMap";

// Data Browser
let PageNav = ({data, dispatch, fields, sort}) => {
    return (
        <div>
            <form className="form-inline">
                <label>
                    Records per Page:
                </label>
                <FormControl
                    inline
                    bsSize="small"
                    componentClass="select"
                    placeholder="select"
                    defaultValue={data.rows}
                    onChange={(event) => {
                        dispatch(updatePagination(data.start - data.start % event.target.value, event.target.value))
                    }}>

                    <option value="1">1</option>
                    <option value="10">10</option>
                    <option value="100">100</option>
                    <option value="1000">1000</option>
                    <option value="10000">*10000</option>
                </FormControl>
                &nbsp;
                &nbsp;
                &nbsp;
                &nbsp;
                <Pagination
                    className="form-control"
                    style={{padding: 0}}
                    inline
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
                &nbsp;
                &nbsp;
                &nbsp;
                &nbsp;

                <label>Sort By : </label>
                <select
                    onChange={
                        (e) => dispatch(setSort({field: fields[e.target.value]}))
                    }
                    value={sort.field?sort.field.name:""}>
                    <option value="">--Please select a field---</option>
                    {Object.keys(fields).map((fieldName) => <option key={fieldName}
                                                                    value={fieldName}>{fieldName}</option>)}
                </select>
                &nbsp;
                &nbsp;
                &nbsp;
                &nbsp;
                <label>Type : </label>
                <select
                    onChange={
                        (e) => dispatch(setSort({type: e.target.value}))
                    }
                    value={sort.type}>
                    <option value="asc">ASC</option>
                    <option value="desc">DESC</option>
                </select>
                &nbsp;
                &nbsp;
                &nbsp;
                &nbsp;

                <a href={data.url}>Solr Response</a>
                &nbsp;
                &nbsp;
                &nbsp;
                <a href="#" onClick={promptDownload} >Download All Data</a>

            </form>
        </div>
    );
}
PageNav = connect()(PageNav)


let TableView = ({data}) => {
    return (
        <Table
            rowHeight={30}
            rowsCount={data.docs.length}
            width={1430}
            height={600}
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
                    width={150}
                />
            )}
        </Table>
    )
};


let DataBrowser = ({data, fields, filters, sort}) => {
    return (
        <Panel bsStyle="info" header={"Data Browser ("+data.numFound+" results found)"}>
            <Tabs defaultActiveKey={3} id="uncontrolled-tab-example">
                <Tab eventKey={1} title="Table">
                    <TableView data={data}/>
                </Tab>

                <Tab eventKey={2} title="JSON Response">
                <pre className="pre-scrollable">
                {data.jsonResponse}
                </pre>
                </Tab>

                <Tab eventKey={3} title="Map">
                    <DataMap data={data} fields={fields} filters={filters}/>
                </Tab>
            </Tabs>
            <br/>

            <PageNav data={data} sort={sort} fields={fields}/>


        </Panel>
    );
}
export default DataBrowser;
