import React from 'react';
import { Map, CircleMarker, Popup, TileLayer } from 'react-leaflet';

const position = [0, 0];

// import { Panel } from 'react-bootstrap';
// import MapGL from 'react-map-gl';


// import mapboxgl  from '../node_modules/mapbox-gl';

// mapboxgl.accessToken = '<your access token here>';
// var map = new mapboxgl.Map({
//     container: 'map_view',
//     style: 'mapbox://styles/mapbox/streets-v9'
// });

const DocMarker = ({children, doc, field, fields}) => (
	<CircleMarker
		color='red'
		fillColor='red'
		center={doc[field].split(",").map(parseFloat)}
		radius={5}>
	<Popup>
		<ul>
		{ fields.map((fieldName)=>
			<li key={fieldName}>
				<b>{fieldName}</b>:{doc[fieldName]}
			</li>)
		}
		</ul>
	</Popup>

   </CircleMarker>
)


var GeoView = React.createClass({
	getInitialState() {
		return {
			locationField:"Location"
		};
	},
	handleLocationFieldChange(event){
		this.setState({locationField:event.target.value})
	},
	render(){
		return (<div>
			<select onChange={this.handleLocationFieldChange} value={this.state.locationField}>
				{this.props.fields.map((field,index) => <option key={field} value={field}>{field}</option> )}
			</select>

			<Map
				fitBoundsOnLoad
				center={position}
				zoom={1}
				animate={true}>
			    <TileLayer
			      url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
			      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			    />
			{this.props.docs.map((doc,index)=>
				<DocMarker
					key = {index}
					doc={doc}
					field={this.state.locationField}
					fields={this.props.fields}
					/>

				)}

			</Map>
		</div>)
	}
});

export default GeoView;
