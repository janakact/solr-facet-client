import React from "react";
import {connect} from "react-redux";
import {showFacetsWindow} from "../actions";
import {Panel, OverlayTrigger, Tooltip, ListGroupItem, ListGroup, Popover} from "react-bootstrap";


const tooltip = (stats) => {
        if (!stats) return (<Tooltip id="tooltip"><span><strong>No Stats Available</strong></span></Tooltip>)
        else
            return (
                <Popover id="tooltip"
                         title="Stats">
      <ul>
  {stats && Object.keys(stats).map((key) => (<li key={key }> {key} : {stats[key]}  </li>))}
  </ul>

                </Popover>
            )
    }
    ;

const tooltip2 = (
    <Tooltip id="tooltip"><strong>Holy guacamole!</strong> Check this info.</Tooltip>
);


// Single Field
const mapStateToPropsField = (state, ownProps) => ({});
const mapDispatchToPropsField = (dispatch, ownProps) => ({
    onClick: () => {
        dispatch(showFacetsWindow(ownProps.field.name))
    }
});
let Field = ({field, onClick}) => {
    return (
        <OverlayTrigger placement="right" overlay={tooltip(field.stats)}>
        <ListGroupItem
            onClick={onClick}>

                <span><strong>{field.name}</strong></span>
        </ListGroupItem>
        </OverlayTrigger>
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
