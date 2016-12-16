import React from 'react'
import {connect} from 'react-redux'
import {Panel} from 'react-bootstrap'
import {setTimesliderOptions, requestFacets} from '../actions'
import filterTypes from '../constants/FilterTypes'
import DraggableSlider from './DraggableSlider'
import solrConsts from '../constants/Solr'

const isSlidable = (fieldName,fields) =>{
    let type = fields[fieldName].type;
    return solrConsts.DATE_TYPES.indexOf(type)>-1 || solrConsts.NUMERIC_TYPES.indexOf(type)>-1
}
// List of All Fields
let TimeSlider = ({facetsList, fields, dispatch, timeSliderOptions}) => {


    let facets = timeSliderOptions.field &&
    facetsList[timeSliderOptions.field.name] ? facetsList[timeSliderOptions.field.name] : false;
    return (
        <Panel bsStyle="info" header="Time Slider" style={{overflow: 'hidden'}}>
            <label>Field : </label>
            <select
                onChange={
                    (e) => {
                        if(e.target.value!=="")
                            dispatch(requestFacets(e.target.value))
                        dispatch(setTimesliderOptions({field: fields[e.target.value], filter:null}))
                    }
                }
                defaultValue="">
                <option value="">--Please select a field---</option>
                {Object.keys(fields).filter((fieldName)=>isSlidable(fieldName,fields)).map((fieldName) => <option key={fieldName} value={fieldName}>{fieldName}</option>)}
            </select>

            <br/>

            <div>
            {
                facets &&
                <DraggableSlider
                    fullRange={facets.fullRange}
                    tipFormatter={ facets.field.type === 'date' ? (item)=> new Date(item).toString() : item=>item}
                    type={facets.field.type === 'date'?'time':'int'}
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
            </div>
            <br/>
            <br/>
        </Panel>
    )
}

TimeSlider = connect()(TimeSlider);

export default TimeSlider;