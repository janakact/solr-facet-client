import React from 'react';
import { Col, Panel } from 'react-bootstrap';
import { connect } from 'react-redux'
import { Map, TileLayer, ImageOverlay, FeatureGroup, Circle } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"
import {changeFacetsGeoShape, addFilter} from '../../actions'


const position = [0,0]
//Facets results for a single field
let HeatMap = ({facets, dispatch}) => {
        let {counts_png,minX, minY, maxX, maxY} = facets.options;
    return(

                  <Col xs={12} md={12} >
        <Panel collapsible defaultExpanded header={facets.field.name} >



            <Map
                fitBoundsOnLoad
                center={position}
                zoom={1}
                animate={true}
                id='map'>
                <ImageOverlay url={'data:image/png;base64,'+counts_png} bounds={[[-90, -180], [90, 180]]} opacity={0.2} />
                <TileLayer
                  url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                <FeatureGroup>
                    <EditControl
                        position='topright'
                        onCreated={(item)=>{
                            console.log(item)
                            dispatch(changeFacetsGeoShape(facets.field.name, item.layer._latlngs))
                        }}
                        onEdited={(item)=>{console.log(item)}}
                        onDeleted={(item)=>{console.log(item)}}
                        draw={{
                            rectangle: false
                        }}
                    />
                    <Circle center={[51.51, -0.06]} radius={200} />
                </FeatureGroup>



            </Map>

            <div  className="facet-list-scroll" >
                    {JSON.stringify(facets)}
            </div>
        </Panel>
    </Col>
    )
}

HeatMap = connect()(HeatMap);

export default HeatMap;
