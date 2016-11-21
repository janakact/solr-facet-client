import React from 'react';
import TextOptions from './TextOptions'
import HeatMap from './HeatMap'
import Graph from './Graph'
import facetsTypes from '../../constants/FacetsTypes'

//Facets results for a single field
let Facets = (props) => {

    let type = props.facets.type;
    switch( type){
        case  facetsTypes.TEXT:
            return( <TextOptions {...props} /> );
        case facetsTypes.HEAT_MAP:
            return <HeatMap {...props} />
        case facetsTypes.GRAPH:
            return <Graph {...props} />
        default:
            return null;

    }

}

export default Facets;
