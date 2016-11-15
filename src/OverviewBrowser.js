import React from 'react';
import { Panel,Well, Pagination, Row, Col, Tab, Tabs } from 'react-bootstrap';
import { Map, CircleMarker, Popup, TileLayer } from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';

const position = [0, 0];



var OverviewBrowser = React.createClass({
	render:function(){return (
			<Panel  bsStyle="info" header="Overview" >
				<Map center={position} zoom={1} animate={true}>
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
