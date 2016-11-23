import React from 'react';
import { Col, Panel, Button } from 'react-bootstrap';
import { connect } from 'react-redux'
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
    if(!facets) return []

    let list = facets.facets.counts;
    let values = []
    let labels = []
    let scatter = []
    for(let i=0; i<list.length; i+=2){
        values.push(parseFloat(list[i+1]));
        // labels.push(" ");
        // labels.push(list[i]+'to' + (parseFloat(list[i]) + parseFloat(facets.facets.gap)));
        scatter.push({x: (parseFloat(list[i]) + parseFloat(facets.facets.gap)/2), y:parseFloat(list[i+1])})
    }



    return {
            labels:labels,
        // labels:labels,
            datasets:[
                {
                lineTension: 0,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                label: 'No. of Docs',
                data:scatter,
                pointRadius:0,
                fill: true ,
                }
            ]

    } ;
}


const getOptions = (minMaxValues) => ({
    animation : false,
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                ticks:
                {
                min:minMaxValues.min,
                max:minMaxValues.max
                }
            }]
        }
    })

//Facets results for a single field
let Graph = ({facets, minMaxValues}) => {
    // setTimeout(()=>{initializeGraph( {data:getData(facets), options:options, width:1000, height:400}, 'graphItem')}, 1000)
    return(
                    <div>
                        {JSON.stringify(minMaxValues)}
                <LineChart data={getData(facets)} options={getOptions(minMaxValues)}  redraw  width={1000} height={400} />
                </div>
    )
}







// -------------------------------------------------------------------------------------------------
class GraphSlider extends React.Component {
    constructor(props) {
    super(props);

    let facets = props.facets.facets;

    this.state = {
      values: {
        min: facets.start,
        max:  facets.end,
      },
      valuesCompleted:{
          min:facets.start,
          max:facets.end
      }
    };
  }
  componentWillReceiveProps(nextProps){
      let facets = nextProps.facets.facets;
      this.setState({
          values: {
            min: facets.start,
            max:  facets.end,
          },
          valuesCompleted:{
              min:facets.start,
              max:facets.end
          }

      })
  }

  handleSlideChange(component, values) {
    this.setState({
      values: values,
    });
  }

  handleSlideChangeComplete(component, values){

      this.props.dispatch(changeFacetsNumericRange(this.props.facets.fieldName,[values.min, values.max]))
      this.setState({
        values: values,
        valuesCompleted:values
      });
  }

  //Adding the filter
  addFilter(){
      let values = this.state.valuesCompleted;
      this.props.dispatch(addFilter({
          fieldName:this.props.facets.fieldName,
          range:[values.min, values.max],
          type:filterTypes.NUMERIC_RANGE_FILTER}))
  }

  render() {

      let fullRange = this.props.facets.fullRange;
      let extraGapFromEdges = (fullRange[1]- fullRange[0])/5 ; //Add some extra gaps to edges to make sure all points are visible
    return (
    <Col xs={12} md={12} >
        <Panel collapsible defaultExpanded header={this.props.facets.fieldName} >
                <Graph {...this.props}  minMaxValues={this.state.valuesCompleted} />
                 <InputRange
                    minValue={fullRange[0]-extraGapFromEdges}
                    maxValue={fullRange[1]+extraGapFromEdges}
                    value={this.state.values}
                    onChange={this.handleSlideChange.bind(this)}
                    onChangeComplete={this.handleSlideChangeComplete.bind(this)}
                 />
             <Button onClick={this.addFilter.bind(this)} > Apply Filter </Button>
         </Panel>
     </Col>
    );
  }
};

GraphSlider = connect()(GraphSlider);
export default GraphSlider;
