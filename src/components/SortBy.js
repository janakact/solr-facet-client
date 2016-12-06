import React from 'react'
import {connect} from 'react-redux'
import {Panel, ListGroup} from 'react-bootstrap'
import {addSort} from '../actions'

// List of All Fields
let SortBy = ({sorts, fields, dispatch}) => {
    return (
        <Panel bsStyle="info" header="Sort By">

            <ListGroup>
                {sorts.map((filter, index) =>
                    <br/>
                )}
            </ListGroup>

            <label>Field : </label>
            <select
                onChange={
                    (e) => dispatch(addSort({field:fields[e.target.value], type:'asc'}))
                }
                defaultValue="">
                <option value={null} >--Please select a field---</option>
                {Object.keys(fields).map((fieldName) => <option key={fieldName} value={fieldName}>{fieldName}</option>)}
            </select>
            {

            }
            <label>Type : </label>
            <select
                defaultValue="">
                <option value="asc" >ASC</option>
                <option value="desc" >DESC</option>
            </select>

            {JSON.stringify(sorts)}<br/>
            {/*{JSON.stringify(fields)}<br/>*/}

        </Panel>
    );
}
SortBy = connect()(SortBy);
export default SortBy;