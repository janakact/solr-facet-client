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
import React from 'react';
import {Panel, Button} from 'react-bootstrap';
import {connect} from 'react-redux'
import Rcslider from 'rc-slider';
import {changeFacetsNumericRange, addFilter} from '../../actions'
import filterTypes from '../../constants/FilterTypes'

var LineChart = require("react-chartjs").Line;

const getMarks = (range, type="int", labelFormatter=a=>a) => {
    let points = {};
    if(!range) return points;

    let gap =  (range[1]-range[0])/10 //Generate a gap depending on the range

    if(type==='time' || type=='date'){
        gap -= gap%Math.pow(10,Math.floor(Math.log10(gap)));
        let min = range[0]+gap
        min = min - min%gap;
        for(let i=min; i<range[1]; i+=gap)
        {
            points[i] = new Date(i).toString();
        }
    }
    else{
        gap -= gap%Math.pow(10,Math.floor(Math.log10(gap)));
        let min = range[0]+gap
        min = min - min%gap;
        for(let i=min; i<range[1]; i+=gap)
        {
            points[i] = labelFormatter(i);
        }
    }

    return points;
}


const getData = (facets) => {
    if (!facets) return []
    let labels = []
    let scatter = []
    for (let i = 0; i < facets.options.headers.length; i++) {
        scatter.push({
            x: (parseFloat(facets.options.headers[i]) + parseFloat(facets.options.gap) / 2),
            y: parseFloat(facets.options.counts[i])
        })
        labels.push(facets.options.headers[i]);
    }

    return {
        labels: labels,
        // labels:labels,
        datasets: [
            {
                lineTension: 0,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                label: 'No. of Docs',
                data: scatter,
                pointRadius: 0,
                fill: true,
            }
        ]

    };
}


const getOptions = (facets) => {
    console.log(facets.selectedRange);
    let type = facets.field.type === 'date' ? 'time' : 'linear'
    return {
        animation: false,
        scales: {
            xAxes: [{
                type: type,
                position: 'bottom',
                ticks: {
                    min: facets.selectedRange[0],
                    max: facets.selectedRange[1]
                }
            }]
        }
    }
}


//Facets results for a single field
let Graph = ({facets}) => {
    // setTimeout(()=>{initializeGraph( {data:getData(facets), options:options, width:1000, height:400}, 'graphItem')}, 1000)
    return (
        <div>
            <LineChart redraw data={getData(facets)} options={getOptions(facets)} width={1000} height={500}/>
        </div>
    )
}


// -------------------------------------------------------------------------------------------------
class GraphSlider extends React.Component {

    constructor(props) {
        super(props);

        console.log("---")
        console.log(props.facets);
        // let range = mapSelectedRange(props.facets.selectedRange);
        let range = props.facets.selectedRange;
        this.state = {
            selectedRange: range,
            selectingRange: range
        };
    }

    componentWillReceiveProps(nextProps) {
        // let range = mapSelectedRange(nextProps.facets.selectedRange);
        let range = nextProps.facets.selectedRange;
        this.setState(
            {
                selectedRange: range
            });
    }

    handleSlideChange(values) {
        this.setState({
            selectingRange: values,
        });
    }

    handleSlideChangeComplete(values) {

        this.props.dispatch(changeFacetsNumericRange(this.props.facets.field.name, values))
        this.setState({
            selectingRange: values,
            selectedRange: values
        });
    }

    //Adding the filter
    addFilter() {
        let values = this.state.selectedRange;
        this.props.dispatch(addFilter({
            field: this.props.facets.field,
            range: values,
            type: filterTypes.NUMERIC_RANGE_FILTER
        }))
        if(this.props.onAddFilter)
            this.props.onAddFilter();
    }

    render() {
        let fullRange = this.props.facets.fullRange;
        // let extraGapFromEdges = (fullRange[1] - fullRange[0]) / 50; //Add some extra gaps to edges to make sure all points are visible
        return (
                <Panel collapsible defaultExpanded header={this.props.facets.field.name}>
                    <Graph {...this.props}  />

                    {/*<label>Selected Range:</label>*/}
                    {/*<br/>*/}
                    {/*<Rcslider*/}
                        {/*marks={getMarks(this.state.selectedRange, this.props.facets.field.type)}*/}
                        {/*range={true}*/}
                        {/*defaultValue={this.state.selectedRange}*/}
                        {/*min={this.state.selectedRange[0]}*/}
                        {/*max={this.state.selectedRange[1]}*/}
                        {/*value={this.state.selectingRange}*/}
                        {/*onChange={this.handleSlideChange.bind(this)}*/}
                        {/*onAfterChange={this.handleSlideChangeComplete.bind(this)}*/}
                        {/*tipFormatter={this.props.facets.field.type === 'date' ? (item)=> new Date(item).toString() : item=>item}*/}
                    {/*/>*/}



                    <label>Full Range:</label>
                    <Rcslider
                        marks={getMarks(fullRange, this.props.facets.field.type)}
                        range={true}
                        min={fullRange[0] }
                        max={fullRange[1] }
                        value={this.state.selectingRange}
                        onChange={this.handleSlideChange.bind(this)}
                        onAfterChange={this.handleSlideChangeComplete.bind(this)}
                        tipFormatter={this.props.facets.field.type === 'date' ? (item)=> new Date(item).toString() : item=>item}
                    />

                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>


                    <Button onClick={this.addFilter.bind(this)}> Apply Filter </Button>
                </Panel>
        );
    }
}
;

GraphSlider = connect()(GraphSlider);
export default GraphSlider;
