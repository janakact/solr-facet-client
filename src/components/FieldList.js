import React from "react";
import {connect} from "react-redux";
import {showFacetsWindow} from "../actions";
import {Panel, OverlayTrigger, Tooltip, ListGroupItem, ListGroup} from "react-bootstrap";


const tooltip = (stats) => {
        if (!stats) return (<Tooltip id="tooltip"><span><strong>No Stats Available</strong></span></Tooltip>)
        else
            return (
                <Tooltip id="tooltip"><span><strong>Stats</strong> <br/>

      <ul>
  {stats && Object.keys(stats).map((key) => (<li key={key }> {key} : {stats[key]}  </li>))}
  </ul>
</span>

                </Tooltip>
            )
    }
    ;


// Single Field
const mapStateToPropsField = (state, ownProps) => ({});
const mapDispatchToPropsField = (dispatch, ownProps) => ({
    onClick: () => {
        dispatch(showFacetsWindow(ownProps.field.name))
    }
});
let Field = ({field, onClick}) => {
    return (
        <ListGroupItem
            className={"tag-cloud " + (field.selected ? 'tag-cloud-item-checked' : 'tag-cloud-item')}
            onClick={onClick}>

            <OverlayTrigger placement="left" overlay={tooltip(field.stats)}>
                <span><strong>{field.name}</strong></span>
            </OverlayTrigger>
        </ListGroupItem>
    )
}
Field = connect(mapStateToPropsField, mapDispatchToPropsField)(Field);


// List of All Fields
let FieldList = ({fields}, dispatch) => {
    return (
        <Panel bsStyle="info" header="Available Fields">
            <ListGroup>
                {Object.keys(fields).map((fieldName, index) =>
                    <Field
                        key={fieldName}
                        field={fields[fieldName]}></Field>
                )}
            </ListGroup>
        </Panel>
    );
}
export default FieldList;
