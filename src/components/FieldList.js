import React from 'react'
import { connect } from 'react-redux'
import { toggleSelectField } from '../actions'
import { Button,Panel } from 'react-bootstrap';


// Single Field
const mapStateToPropsField = (state, ownProps) => ({});
const mapDispatchToPropsField = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(toggleSelectField(ownProps.field.name))
  }
});
let  Field = ({field, onClick}) => {
    return (
            <li
                className={"tag-cloud "+(field.selected ? 'tag-cloud-item-checked' : 'tag-cloud-item')}
                onClick={onClick}>

            	<strong>{field.name}</strong> : {field.type}
            </li>
    )
}
Field = connect(mapStateToPropsField, mapDispatchToPropsField)(Field);



// List of All Fields
let FieldList = ({fields},dispatch) =>  {
	return (
		<Panel  bsStyle="info" header="Available Fields">
			<ul>
			{fields.map((field,index)=>
				<Field
                    field={field}></Field>
			)}
		</ul>
	   </Panel>
	);}
export default FieldList;
