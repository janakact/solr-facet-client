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
