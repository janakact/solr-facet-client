import React from 'react';
import TextOptions from './TextOptions'
import HeatMap from './HeatMap'
import GraphSlider from './GraphSlider'
import facetsTypes from '../../constants/FacetsTypes'

//Facets results for a single field
let Facets = (props) => {

    let type = props.facets.type;
    switch( type){
        case  facetsTypes.TEXT:
            return( <TextOptions {...props} /> );
        case facetsTypes.HEAT_MAP:
            return <HeatMap {...props} />
        case facetsTypes.NUMERIC_RANGE:
            return <GraphSlider {...props} />
        default:
            return null;

    }

}

export default Facets;
