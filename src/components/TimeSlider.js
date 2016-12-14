import React from 'react'
import {connect} from 'react-redux'
import {Panel, ListGroup} from 'react-bootstrap'
import {setTimesliderOptions, requestFacets, addFilter} from '../actions'
import filterTypes from '../constants/FilterTypes'
import DraggableSlider from './DraggableSlider'

// List of All Fields
let TimeSlider = ({facetsList, fields, dispatch, timeSliderOptions}) => {


    let facets = timeSliderOptions.field &&
    facetsList[timeSliderOptions.field.name] ? facetsList[timeSliderOptions.field.name] : false;

    return (
        <Panel bsStyle="info" header="Time Slider">
            <label>Field : </label>
            <select
                onChange={
                    (e) => {
                        dispatch(requestFacets(e.target.value))
                        dispatch(setTimesliderOptions({field: fields[e.target.value], filter:null}))
                    }
                }
                defaultValue="">
                <option value={null}>--Please select a field---</option>
                {Object.keys(fields).map((fieldName) => <option key={fieldName} value={fieldName}>{fieldName}</option>)}
            </select>


            {
                facets &&
                <DraggableSlider
                    fullRange={facets.fullRange}
                    tipFormatter={ facets.field.type === 'date' ? (item)=> new Date(item).toString() : item=>item}
                    onAfterChange={
                        (values)=> {
                            dispatch(setTimesliderOptions({
                                filter: {
                                    field: timeSliderOptions.field,
                                    range: values,
                                    type: filterTypes.NUMERIC_RANGE_FILTER
                                }
                            }))
                        }}
                />

            }
        </Panel>
    )
}

TimeSlider = connect()(TimeSlider);

export default TimeSlider;