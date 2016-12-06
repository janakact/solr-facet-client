import React from "react";
import { connect } from 'react-redux'
import { Map, TileLayer, CircleMarker, Popup, FeatureGroup, Circle, Rectangle } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"
import {addToEditingFilter, finishFilterEditing} from '../actions'
import filterTypes from '../constants/FilterTypes'
import {Button} from "react-bootstrap";


const center = [0, 0];

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

const GeoShapeFilter = ({filter}) => (
    <FeatureGroup>
        {filter.shapes.map(shape=>{
            if(shape.type==='circle')
                return (<Circle center={[shape.point.lat,shape.point.lng]} radius={shape.radius} />)
            else if(shape.type==='rectangle')
                return (<Rectangle bounds={shape.points.map((point) => [point.lat, point.lng])} />)
        })}
    </FeatureGroup>
)


class DataMapClass extends React.Component {

    constructor(props) {
        super(props);
        this.state =  { selectedField:'Location', mapKey:0, zoom:2, center:center}; //Editing Filter index = -1 means not editing enything
    }

    reDrawMap(){
        this.setState({mapKey:this.state.mapKey+1});
    }

    updateShape(item){
        console.log('update Shape------------------------------------------ ');
        console.log(this.refs.drawFeatureGroup);
        let layers = this.refs.drawFeatureGroup.leafletElement._layers;
        console.log(layers);
        let shapes = []
        for(let layerId of Object.keys(layers)){
            //If polygon
            let shape;
            if(layers[layerId]._latlngs){
                console.log("Poly")
                shape = {type:'rectangle', points:layers[layerId]._latlngs[0]};
            }
            else if(layers[layerId]._latlng){
                console.log("Circle")
                shape = {type:'circle', point: layers[layerId]._latlng, radius:layers[layerId]._mRadius};
            }
            shapes.push(shape)
        }
        console.log(shapes);
        this.props.dispatch(addToEditingFilter({
            field: this.props.fields[this.state.selectedField],
            shapes: shapes,
            type: filterTypes.GEO_SHAPE,
            editing:true
        }))
        let map = this.refs.drawFeatureGroup.context.map;
        this.setState({ zoom:map._zoom, center:[map._lastCenter.lat, map._lastCenter.lng]});
    }

    finishEditing(){
        this.props.dispatch(finishFilterEditing());
        this.reDrawMap();
    }


   render() {
       let data = this.props.data
       let locationSelect = "Location";
       return (<div>
           <select onChange={(e) => {
               this.setState({'selectedField':e.target.value});
               this.reDrawMap();
            }
           } value={this.state.selectedField}    defaultValue="Location">
               {data.columnNames.map((field, index) => <option key={field} value={field}>{field}</option>)}
           </select>
           {this.state.selectedField}

           <Button onClick={this.finishEditing.bind(this)}>Finish Editing</Button>
           <Map
               key={this.state.mapKey}
               center={this.state.center}
               zoom={this.state.zoom}
               minZoom={1}
               animate={true}
               id='map'>
               <TileLayer
                   url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                   attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                   continuousWorld={false}
                   noWrap={true}
               />
               <FeatureGroup ref="drawFeatureGroup" color='red'>
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

                   {/*{*/}
                       {/*this.props.filters.map((filter) => {*/}
                       {/*if(filter.field.name===this.state.selectedField && filter.type===filterTypes.GEO_SHAPE && filter.editing===true){*/}
                           {/*return <GeoShapeFilter filter={filter}/>*/}
                       {/*}*/}
                       {/*else*/}
                           {/*return null;*/}
                   {/*})}*/}

               </FeatureGroup>

               <FeatureGroup>
                   {this.props.filters.map((filter) => {
                       if(filter.field.name===this.state.selectedField && filter.type===filterTypes.GEO_SHAPE && filter.editing!==true){
                            return <GeoShapeFilter filter={filter}/>
                       }
                       else
                        return null;
                   })}
               </FeatureGroup>



               {data.docs.map((doc, index) =>
                   <DocMarker
                       key={index}
                       doc={doc}
                       field={'Location'}
                       fields={data.columnNames}
                   />
               )}



           </Map>
       </div>)
   }
}

let DataMap = connect()(DataMapClass)

export default DataMap;
