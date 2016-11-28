import React from 'react';
import { Col, Panel } from 'react-bootstrap';
import { connect } from 'react-redux'
import {addFilter} from '../../actions'
import { Map, TileLayer, ImageOverlay } from 'react-leaflet';


const position = [0,0]
//Facets results for a single field
let HeatMap = ({facets}) => {
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
                <ImageOverlay url={'data:image/png;base64,'+counts_png} bounds={[[0, -180], [90, 180]]} opacity={0.9} />
                <TileLayer
                  url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />


            </Map>

            <div  className="facet-list-scroll" >
                    {JSON.stringify(facets)}
            </div>
        </Panel>
    </Col>
    )
}

export default HeatMap;
