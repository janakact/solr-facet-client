import React from 'react';
import {connect} from 'react-redux'
import {Modal} from 'react-bootstrap'
import Facets from './facets/'
import {hideFacetsWindow, showFacetsWindow} from "../actions";

let FacetsWindow = ({facetsWindow, facetsList, fields, dispatch}) => {
    return (
        <Modal bsSize="large" show={facetsWindow.show} onHide={()=>dispatch(hideFacetsWindow())}>
            <Modal.Header closeButton>
                <Modal.Title>Filter Options</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label>Field : </label>
                <select
                    onChange={(e) => dispatch(showFacetsWindow(e.target.value))}
                    value={facetsWindow.fieldName} defaultValue="">
                    <option value={null} >--Please select a field---</option>
                    {Object.keys(fields).map((fieldName) => <option key={fieldName} value={fieldName}>{fieldName}</option>)}
                </select>
                <br/>
                <br/>
                {(facetsWindow.fieldName===null) && "Please Select a field"}
                {(facetsList[facetsWindow.fieldName]) && <Facets facets={facetsList[facetsWindow.fieldName]} onAddFilter={()=>dispatch(hideFacetsWindow())}/>}
            </Modal.Body>
        </Modal>
    )
}
FacetsWindow = connect()(FacetsWindow);
export default FacetsWindow;