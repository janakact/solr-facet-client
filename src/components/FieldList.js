import React from 'react'
import { connect } from 'react-redux'
import { toggleSelectField } from '../actions'
import { Panel, OverlayTrigger, Tooltip } from 'react-bootstrap';


const tooltip = (stats) => (
  <Tooltip id="tooltip"><strong>Holy guacamole!</strong>{JSON.stringify(stats)}.</Tooltip>
);


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

                  <OverlayTrigger placement="left" overlay={tooltip(field.stats)}>
            	<span><strong>{field.name}</strong> : {field.type} </span>
                </OverlayTrigger>
            </li>
    )
}
Field = connect(mapStateToPropsField, mapDispatchToPropsField)(Field);



// List of All Fields
let FieldList = ({fields},dispatch) =>  {
	return (
		<Panel  bsStyle="info" header="Available Fields">
			<ul>
			{Object.keys(fields).map((fieldName,index)=>
				<Field
                    key={fieldName}
                    field={fields[fieldName]}></Field>
			)}
		</ul>
	   </Panel>
	);}
export default FieldList;
