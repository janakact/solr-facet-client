/*
 *  Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */
import React from 'react'
import {connect} from 'react-redux'
import {Panel, Row, Col} from 'react-bootstrap'
import {setTimesliderOptions, requestFacets} from '../actions'
import filterTypes from '../constants/FilterTypes'
import DraggableSlider from './DraggableSlider'
import solrConsts from '../constants/Solr'
import DateTime from 'react-datetime'

const isSlidable = (fieldName, fields) => {
    let type = fields[fieldName].type;
    return solrConsts.DATE_TYPES.indexOf(type) > -1 || solrConsts.NUMERIC_TYPES.indexOf(type) > -1
}
// List of All Fields
let TimeSlider = ({facetsList, fields, dispatch, timeSliderOptions}) => {


    let facets = timeSliderOptions.field &&
    facetsList[timeSliderOptions.field.name] ? facetsList[timeSliderOptions.field.name] : false;
    let filterRange = timeSliderOptions.filter ? timeSliderOptions.filter.range : facets.fullRange;
    return (
        <Panel bsStyle="info" header="Time Slider">
            <Row>
                <Col xs={12} md={4}>
                    <label>Field : </label>
                    <select
                        onChange={
                            (e) => {
                                if (e.target.value !== "") {
                                    dispatch(requestFacets(e.target.value))
                                    dispatch(setTimesliderOptions({field: fields[e.target.value], filter: null}))
                                }
                                else {
                                    dispatch(setTimesliderOptions({field: {name: "", type: ""}, filter: null}))
                                }
                            }
                        }
                        value={timeSliderOptions.field.name}>
                        <option value="">--Please select a field---</option>
                        {Object.keys(fields).filter((fieldName)=>isSlidable(fieldName, fields)).map((fieldName) =>
                            <option
                                key={fieldName} value={fieldName}>{fieldName}</option>)}
                    </select>
                </Col>
                {facets && facets.field.type === 'date' &&
                <Col xs={12} md={8}>
                    <Row>
                        <Col xs={6} md={3}>
                            <label>
                                From:
                            </label><br/>
                            <DateTime
                                value={filterRange[0]}
                                onChange={(value)=> {
                                    if (value >= facets.fullRange[0] && value <= filterRange[1])
                                        dispatch(setTimesliderOptions({
                                            filter: {
                                                field: timeSliderOptions.field,
                                                range: [value, filterRange[1]],
                                                type: filterTypes.NUMERIC_RANGE_FILTER
                                            }
                                        }))
                                }}
                            />
                        </Col>

                        <Col xs={6} md={3}>
                            <label>
                                To:
                            </label><br/>
                            <DateTime
                                value={filterRange[1]}
                                onChange={(value)=> {
                                    if (value <= facets.fullRange[1] && value >= filterRange[0])
                                        dispatch(setTimesliderOptions({
                                            filter: {
                                                field: timeSliderOptions.field,
                                                range: [filterRange[0], value],
                                                type: filterTypes.NUMERIC_RANGE_FILTER
                                            }
                                        }))
                                }}
                            />
                        </Col>
                    </Row>
                </Col>}

                {
                    facets && facets.field.type !== 'date' &&
                    <Col xs={12} md={8}>
                        <Row>
                            <Col xs={6} md={3}>
                                <label>
                                    From:
                                </label><br/>
                                <input
                                    type="number"
                                    value={filterRange[0]}
                                    onChange={(e)=> {
                                        let value = e.target.value;
                                        if (value >= facets.fullRange[0] && value <= filterRange[1])
                                            dispatch(setTimesliderOptions({
                                                filter: {
                                                    field: timeSliderOptions.field,
                                                    range: [value, filterRange[1]],
                                                    type: filterTypes.NUMERIC_RANGE_FILTER
                                                }
                                            }))
                                    }}
                                />
                            </Col>

                            <Col xs={6} md={3}>
                                <label>
                                    To:
                                </label><br/>
                                <input
                                    type="number"
                                    value={filterRange[1]}
                                    onChange={(e)=> {
                                        let value = e.target.value;
                                        if (value <= facets.fullRange[1] && value >= filterRange[0])
                                            dispatch(setTimesliderOptions({
                                                filter: {
                                                    field: timeSliderOptions.field,
                                                    range: [filterRange[0], value],
                                                    type: filterTypes.NUMERIC_RANGE_FILTER
                                                }
                                            }))
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>

                }
            </Row>


            <div>
                {
                    facets &&
                    <div style={{padding: 20}}>
                        <br/>
                        <br/>
                        <DraggableSlider
                            dragRange={filterRange}
                            fullRange={facets.fullRange}
                            tipFormatter={ facets.field.type === 'date' ? (item)=> new Date(item).toString() : item=>item}
                            type={facets.field.type === 'date' ? 'time' : 'int'}
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
                    </div>

                }
            </div>
            <br/>
            <br/>
        </Panel>
    )
}

TimeSlider = connect()(TimeSlider);

export default TimeSlider;