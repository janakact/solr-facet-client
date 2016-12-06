import React from "react";
import {connect} from "react-redux";
import {removeFilter, startFilterEditing, showFacetsWindow, hideFacetsWindow} from "../actions";
import {Panel, ListGroupItem, ListGroup, Button} from "react-bootstrap";
import filterTypes from "../constants/FilterTypes";


const getFilterText = (filterObj) => {
    switch (filterObj.type) {
        case filterTypes.TEXT_FILTER:
            return filterObj.query;
        case filterTypes.NUMERIC_RANGE_FILTER:
            let range = filterObj.range
            if(filterObj.field.type=='date')
                range = filterObj.range.map((item) => (new Date(item).toISOString()))
            return '[' + range[0] + ' TO ' + range[1] + ']';
        case filterTypes.GEO_SHAPE:
            return JSON.stringify(filterObj.shapes);
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
        <ListGroupItem
            className="tag-cloud tag-cloud-item"
            onClick={onClick} >
            <strong>{filterObject.field.name}</strong> : {getFilterText(filterObject)}
        </ListGroupItem>
    )
}
Filter = connect(mapStateToPropsField, mapDispatchToPropsField)(Filter);


// List of All Fields
let FilterList = ({filters, dispatch}) => {
    return (
        <Panel bsStyle="info" header="Applied Filters">

            <ListGroup>
                {filters.map((filter, index) =>
                    <Filter
                        key={index}
                        filterObject={filter}></Filter>
                )}
            </ListGroup>

            <Button onClick={()=> dispatch(showFacetsWindow())}>Add Filter</Button>
        </Panel>
    );
}
FilterList = connect()(FilterList);
export default FilterList;
