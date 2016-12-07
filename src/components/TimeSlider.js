import React from 'react'
import {connect} from 'react-redux'
import {Panel, ListGroup} from 'react-bootstrap'
import {setTimesliderOptions, requestFacets} from '../actions'
import DraggableSlider from './DraggableSlider'

// List of All Fields
let TimeSlider = ({facetsList, fields, dispatch, timeSliderOptions}) => {

    return (
        <Panel bsStyle="info" header="Time Slider">
            <label>Field : </label>
            <select
                onChange={
                    (e) => {
                        dispatch(requestFacets(e.target.value))
                        dispatch(setTimesliderOptions({field:fields[e.target.value]}))
                    }
                }
                defaultValue="">
                <option value={null} >--Please select a field---</option>
                {Object.keys(fields).map((fieldName) => <option key={fieldName} value={fieldName}>{fieldName}</option>)}
            </select>


            <DraggableSlider
                fullRange={[0,10000]}
                tipFormatter={ (item)=> new Date(item).toString()} />
        </Panel>
    )
}

TimeSlider = connect()(TimeSlider);

export default TimeSlider;