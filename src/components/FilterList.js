import React from "react";
import {connect} from "react-redux";
import {removeFilter} from "../actions";
import {Panel} from "react-bootstrap";
import filterTypes from "../constants/FilterTypes";


const getFilterText = (filterObj) => {
    switch (filterObj.type) {
        case filterTypes.TEXT_FILTER:
            return filterObj.query;
        case filterTypes.NUMERIC_RANGE_FILTER:
            return '[' + filterObj.range[0] + ' TO ' + filterObj.range[1] + ']';
        default:
            return "<Undefined Filter>"

    }
}


// Single Field
const mapStateToPropsField = (state, ownProps) => ({});
const mapDispatchToPropsField = (dispatch, ownProps) => ({
    onClick: () => {
        dispatch(removeFilter(ownProps.filterObject))
    }
});
let Filter = ({filterObject, onClick}) => {
    return (
        <li className="tag-cloud tag-cloud-item"
            onClick={onClick}>
            <strong>{filterObject.fieldName}</strong> : {getFilterText(filterObject)}
        </li>
    )
}
Filter = connect(mapStateToPropsField, mapDispatchToPropsField)(Filter);


// List of All Fields
let FilterList = ({filters}, dispatch) => {
    return (
        <Panel bsStyle="info" header="Available Filters">
            <ul>
                {filters.map((filter, index) =>
                    <Filter
                        key={index}
                        filterObject={filter}></Filter>
                )}
            </ul>
        </Panel>
    );
}
export default FilterList;
