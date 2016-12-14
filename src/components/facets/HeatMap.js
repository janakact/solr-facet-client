import React from 'react';
import { Panel, Button } from 'react-bootstrap';
import { connect } from 'react-redux'
import { Map, TileLayer, ImageOverlay, FeatureGroup, Circle } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"
import {addFilter} from '../../actions'
import filterTypes from '../../constants/FilterTypes'

const position = [0,0]
//Facets results for a single field
class HeatMap extends React.Component {
    constructor(props) {
        super(props);
        this.state =  {shapes:[]};
    }

    addFilter(){
        console.log("add filter")
        this.props.dispatch(addFilter({
            field: this.props.facets.field,
            shapes: this.state.shapes,
            type: filterTypes.GEO_SHAPE
        }))
        if(this.props.onAddFilter)
            this.props.onAddFilter();
    }

    updateShape(item){

        console.log(item);
        console.log('update Shape');
        let shape;
        // let shapeElement;
        if(item.type==="draw:created"){
            switch (item.layerType){
                case 'polygon':
                    shape = {type:'polygon', points:item.layer._latlngs[0]};
                    break;
                case 'circle':
                    shape = {type:'circle', point: item.layer._latlng, radius:item.layer._mRadius};
                    // shapeElement = <Circle  radius={1000} center={[6.9271, 79.8612]} />;

                    break;
                case 'rectangle':
                    shape = {type: 'rectangle', points:item.layer._latlngs[0]};
                    break;
                default:
                    shape = null;
            }
        }
        this.setState({shapes:[...this.state.shapes, shape]});
    }

    render() {
        let {counts_png} = this.props.facets.options;
        return(
                <Panel collapsible defaultExpanded header={this.props.facets.field.name} >



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

                    <Button onClick={this.addFilter.bind(this)}> Apply Filter </Button>
                    {JSON.stringify(this.state.shapes)}
                </Panel>
        )
    }
}

HeatMap = connect()(HeatMap);

export default HeatMap;
