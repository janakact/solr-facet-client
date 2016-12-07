import React from 'react'
import {connect} from 'react-redux'
import {Panel, ListGroup} from 'react-bootstrap'
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