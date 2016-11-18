import React from 'react'
import { connect } from 'react-redux'
import { removeFilter } from '../actions'
import { Button,Panel } from 'react-bootstrap';


// Single Field
const mapStateToPropsField = (state, ownProps) => ({});
const mapDispatchToPropsField = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(removeFilter(ownProps.filterObject))
  }
});
let  Filter = ({filterObject, onClick}) => {
    return (
            <li className="tag-cloud tag-cloud-item"
                onClick={onClick}>

            	<strong>{filterObject.fieldName}</strong> : {filterObject.query}
            </li>
    )
}
Filter = connect(mapStateToPropsField, mapDispatchToPropsField)(Filter);



// List of All Fields
let FilterList = ({filters},dispatch) =>  {
	return (
		<Panel  bsStyle="info" header="Available Filters">
			<ul>
			{filters.map((filter,index)=>
				<Filter
                    filterObject={filter}></Filter>
			)}
		</ul>
	   </Panel>
	);}
export default FilterList;