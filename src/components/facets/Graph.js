import React from 'react';
import { ListGroup,ListGroupItem,Badge,Row,Col, Panel } from 'react-bootstrap';
import { connect } from 'react-redux'
import {addFilter} from '../../actions'

var LineChart = require("react-chartjs").Bar;
import ChartJS from 'chart.js'
import './graph.css'


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
        labels.push(" ");
        // labels.push(list[i]+'to' + (parseFloat(list[i]) + parseFloat(facets.facets.gap)));
        scatter.push({x:i, y:i*i})
    }



    return {
            labels:labels,
        // labels:labels,
            datasets:[
                {
                label: 'Scatter Dataset',
                data:values
                }
            ]

    } ;
}


const options = {
    animation : false,
        scales: {
            xAxes: [{
                position: 'top',
                // barThickness:20
            }]
        }
    }



//Facets results for a single field
let Graph = ({facets}) => {
    // setTimeout(()=>{initializeGraph( {data:getData(facets), options:options, width:1000, height:400}, 'graphItem')}, 1000)
    return(
    <Col xs={12} md={12} >
        <Panel collapsible defaultExpanded header={facets.fieldName} >
                <LineChart data={getData(facets)} options={options}  width={1000} height={400} />

            <div  className="facet-list-scroll" >
                    {JSON.stringify(facets)}
            </div>
        </Panel>
    </Col>
    )
}

export default Graph;
