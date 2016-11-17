import React from 'react';
import { Panel } from 'react-bootstrap';
import { Map, TileLayer } from 'react-leaflet';
// import HeatmapLayer from 'react-leaflet-heatmap-layer';

const position = [0, 0];

// 
// const mapToPoints = function(overView)
// {
// 	let grid = overView[15];
// 	if(grid==null) return []
// 	let points = [];
// 	for(let i=0; i<grid.length; i++)
// 	{
// 		if(grid[i]!=null){
// 		for(let j=0; j<grid[i].length; j++)
// 			points.push([i,j,grid[i][j]+1]);
// 		}
// 	}
// 	//return [[1,1,1.0]]
// 	return points;
// }
//
// const gradient = { '0.1': '#89BDE0', '0.2': '#96E3E6', '0.4': '#82CEB6', '0.6': '#FAF3A5', '0.8': '#F5D98B', '1.0': '#DE9A96'};

var OverviewBrowser = React.createClass({
	render:function(){return (
			<Panel  bsStyle="info" header="Overview" >
				<Map center={position} zoom={0} animate={true}>
				    <TileLayer
				      url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
				      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				    />


				</Map>
				{JSON.stringify(this.props.geoOverview)}
			</Panel>
)}
});

export default OverviewBrowser;
