import React from "react";
import { connect } from 'react-redux'
import { Map, TileLayer, CircleMarker, Popup, FeatureGroup, Circle } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"
import {addFilter} from '../actions'
import filterTypes from '../constants/FilterTypes'


const position = [0, 0];

const DocMarker = ({children, doc, field, fields}) => (
    <CircleMarker
        color='red'
        fillColor='red'
        fillOpacity={1}
        opacity={0.2}
        weight={10}
        center={doc[field].split(",").map(parseFloat)}
        radius={3}>
        <Popup>
            <ul>
                { fields.map((fieldName) =>
                    <li key={fieldName}>
                        <b>{fieldName}</b>:{doc[fieldName]}
                    </li>)
                }
            </ul>
        </Popup>

    </CircleMarker>
)


class DataMapClass extends React.Component {

    constructor(props) {
        super(props);
        this.state =  {shapes:[], selectedField:'Location'};
    }

    addFilter(){
        console.log("add filter")
        this.props.dispatch(addFilter({
            field: this.props.fields[this.state.selectedField],
            shapes: this.state.shapes,
            type: filterTypes.GEO_SHAPE
        }))
    }

    updateShape(item){

        console.log(item);
        console.log('update Shape');
        let shape;
        let shapeElement;
        if(item.type==="draw:created"){
            switch (item.layerType){
                case 'polygon':
                    shape = {type:'polygon', points:item.layer._latlngs[0]};
                    break;
                case 'circle':
                    shape = {type:'circle', point: item.layer._latlng, radius:item.layer._mRadius};
                    shapeElement = <Circle  radius={1000} center={[6.9271, 79.8612]} />;

                    break;
                case 'rectangle':
                    shape = {type: 'rectangle', points:item.layer._latlngs[0]};
            }
        }
        this.setState({shapes:[...this.state.shapes, shape]});
        this.addFilter();
    }

   render() {
       let data = this.props.data
       let locationSelect = "Location";
       return (<div>
           <select onChange={(e) => this.setState({'selectedField':e.target.value})} value={this.state.selectedField}    defaultValue="Location">
               {data.columnNames.map((field, index) => <option key={field} value={field}>{field}</option>)}
           </select>
           {this.state.selectedField}
           <Map
               center={position}
               zoom={2}
               minZoom={1}
               animate={true}
               id='map'>
               <TileLayer
                   url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                   attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                   continuousWorld={false}
                   noWrap={true}
               />

               {data.docs.map((doc, index) =>
                   <DocMarker
                       key={index}
                       doc={doc}
                       field={'Location'}
                       fields={data.columnNames}
                   />
               )}

               <FeatureGroup color='purple'>
                   <EditControl
                       position='topleft'
                       onCreated={this.updateShape.bind(this)}
                       onEdited={this.updateShape.bind(this)}
                       onDeleted={this.updateShape.bind(this)}
                       draw={{
                           polyline:false,
                           marker:false,
                           polygon: {
                               showArea:true
                           }
                       }}
                   />
               </FeatureGroup>

           </Map>
       </div>)
   }
}

let DataMap = connect()(DataMapClass)

export default DataMap;
