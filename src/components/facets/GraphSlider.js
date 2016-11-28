import React from 'react';
import {Col, Panel, Button} from 'react-bootstrap';
import {connect} from 'react-redux'
import InputRange from 'react-input-range';
import {changeFacetsNumericRange, addFilter} from '../../actions'
import filterTypes from '../../constants/FilterTypes'

var LineChart = require("react-chartjs").Line;


// var MyComponent = React.createClass({
//   render: function() {
//     return <LineChart data={chartData} options={chartOptions} width="600" height="250"/>
//   }
// });


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
    let type = facets.field.type==='date'?'time':'linear'
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
            <LineChart data={getData(facets)} options={getOptions(facets)} redraw width={1000} height={400}/>
        </div>
    )
}


// -------------------------------------------------------------------------------------------------
const mapSelectedRange = (selectedRange) => {
    return {min: selectedRange[0], max: selectedRange[1]};
}
class GraphSlider extends React.Component {

    constructor(props) {
        super(props);

        console.log("---")
        console.log(props.facets);
        let range = mapSelectedRange(props.facets.selectedRange);
        this.state = {
            selectedRange: range,
            selectingRange: range
        };
    }

    componentWillReceiveProps(nextProps) {
        let range = mapSelectedRange(nextProps.facets.selectedRange);
        this.setState(
            {
                selectedRange: range,
                selectingRange: range
            });
    }

    handleSlideChange(component, values) {
        this.setState({
            selectingRange: values,
        });
    }

    handleSlideChangeComplete(component, values) {

        this.props.dispatch(changeFacetsNumericRange(this.props.facets.field.name, [values.min, values.max]))
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
            range: [values.min, values.max],
            type: filterTypes.NUMERIC_RANGE_FILTER
        }))
    }

    render() {
        let fullRange = this.props.facets.fullRange;
        // let extraGapFromEdges = (fullRange[1] - fullRange[0]) / 50; //Add some extra gaps to edges to make sure all points are visible
        return (
            <Col xs={12} md={12}>
                <Panel collapsible defaultExpanded header={this.props.facets.field.name}>
                    <Graph {...this.props}  />
                    <br/>
                    <InputRange
                        minValue={this.state.selectedRange.min}
                        maxValue={this.state.selectedRange.max}
                        value={this.state.selectingRange}
                        onChange={this.handleSlideChange.bind(this)}
                        onChangeComplete={this.handleSlideChangeComplete.bind(this)}
                    />


                    <br/>

                    <InputRange
                        minValue={fullRange[0] }
                        maxValue={fullRange[1] }
                        value={this.state.selectingRange}
                        onChange={this.handleSlideChange.bind(this)}
                        onChangeComplete={this.handleSlideChangeComplete.bind(this)}
                    />


                    <Button onClick={this.addFilter.bind(this)}> Apply Filter </Button>
                </Panel>
            </Col>
        );
    }
}
;

GraphSlider = connect()(GraphSlider);
export default GraphSlider;
