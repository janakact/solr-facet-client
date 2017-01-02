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
import React from "react";
import {connect} from 'react-redux'
import {Map, TileLayer, CircleMarker, Popup, FeatureGroup, Circle, Rectangle, Pane, ZoomControl} from 'react-leaflet';
import {EditControl} from "react-leaflet-draw"
import {addToEditingFilter, finishFilterEditing} from '../actions'
import filterTypes from '../constants/FilterTypes'
import {Button} from "react-bootstrap";
import solrConsts from '../constants/Solr'


const center = [0, 0];

const isALocationField = (field) => {
    let type = field.type;
    // return true;
    return solrConsts.LOCATION_TYPES.indexOf(type) > -1 ;

}

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
        {filter.shapes.map((shape,index)=> {
            if (shape.type === 'circle')
                return (<Circle key={index} center={[shape.point.lat, shape.point.lng]} radius={shape.radius}/>)
            else if (shape.type === 'rectangle')
                return (<Rectangle key={index} bounds={shape.points.map((point) => [point.lat, point.lng])}/>)
            return null;
        })}
    </FeatureGroup>
)


class DataMapClass extends React.Component {

    constructor(props) {
        super(props);
        this.state = {selectedField: 'Location', mapKey: 0, zoom: 2, center: center, editing: false}; //Editing Filter index = -1 means not editing enything
    }

    reDrawMap() {
        this.setState({mapKey: this.state.mapKey + 1});
    }

    updateShape(item) {
        console.log('update Shape------------------------------------------ ');
        console.log(this.refs.drawFeatureGroup);
        let layers = this.refs.drawFeatureGroup.leafletElement._layers;
        console.log(layers);
        let shapes = []
        for (let layerId of Object.keys(layers)) {
            //If polygon
            let shape;
            if (layers[layerId]._latlngs) {
                console.log("Poly")
                shape = {type: 'rectangle', points: layers[layerId]._latlngs[0]};
            }
            else if (layers[layerId]._latlng) {
                console.log("Circle")
                shape = {type: 'circle', point: layers[layerId]._latlng, radius: layers[layerId]._mRadius};
            }
            shapes.push(shape)
        }
        console.log(shapes);
        this.props.dispatch(addToEditingFilter({
            field: this.props.fields[this.state.selectedField],
            shapes: shapes,
            type: filterTypes.GEO_SHAPE,
            editing: true
        }))
        let map = this.refs.drawFeatureGroup.context.map;
        if(map._zoom && map._lastCenter )
            this.setState({zoom: map._zoom, center: [map._lastCenter.lat, map._lastCenter.lng], editing: true});
        this.finishEditing();
    }

    finishEditing() {
        this.props.dispatch(finishFilterEditing());
        this.setState({editing: false});
        this.reDrawMap();
    }


    render() {
        let data = this.props.data
        return (<div>
            <Map
                key={this.state.mapKey}
                center={this.state.center}
                zoom={this.state.zoom}
                minZoom={1}
                animate={true}
                zoomControl={false}
                id='map'>
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    continuousWorld={false}
                    noWrap={true}
                />

                <ZoomControl position='topright'/>
                <FeatureGroup ref="drawFeatureGroup" color='red'>
                    <EditControl
                        position='topright'
                        onCreated={this.updateShape.bind(this)}
                        onEdited={this.updateShape.bind(this)}
                        onDeleted={this.updateShape.bind(this)}
                        draw={{
                            polyline: false,
                            marker:false,
                            polygon: {
                                showArea: true
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
                        if (filter.field && filter.field.name === this.state.selectedField && filter.type === filterTypes.GEO_SHAPE && filter.editing !== true) {
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
                        field={this.state.selectedField}
                        fields={data.columnNames}
                    />
                )}


                {

                    <Pane>
                        <div className="map_button_group">


                            <select onChange={(e) => {
                                this.setState({'selectedField': e.target.value});
                                {/*this.reDrawMap();*/}
                            }
                            } value={this.state.selectedField}>
                                {data.columnNames.filter((fieldName)=>isALocationField(this.props.fields[fieldName])).map((field, index) => <option key={field}
                                                                                value={field}>{field}</option>)}
                            </select>
                            <br/>
                            <br/>

                            {this.state.editing &&
                            <Button onClick={this.finishEditing.bind(this)}>Finish Editing</Button>}

                        </div>
                    </Pane>
                }

            </Map>
        </div>)
    }
}

let DataMap = connect()(DataMapClass)

export default DataMap;
