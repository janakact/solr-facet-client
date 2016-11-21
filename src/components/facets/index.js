import React from 'react';
import TextOptions from './TextOptions'
import facetsTypes from '../../constants/FacetsTypes'

//Facets results for a single field
let Facets = (props) => {
    if(props.facets.type == facetsTypes.TEXT)
    return( <TextOptions {...props} />
    )
}

export default Facets;
