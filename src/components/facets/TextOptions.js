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
import {ListGroup, ListGroupItem, Badge, Panel} from 'react-bootstrap';
import {connect} from 'react-redux'
import {changeFacetsSearchText, addFilter} from '../../actions'
import filterTypes from '../../constants/FilterTypes'

//Single Facet Element. Query Oprtion
let Facet = ({head, count, field, dispatch, onAddFilter}) => {
    return (
        <ListGroupItem href="#"
                       onClick={()=> {
                           dispatch(addFilter({field: field, query: head, type: filterTypes.TEXT_FILTER}))
                           if (onAddFilter)
                               onAddFilter();
                       }}>
            <p>{head} <Badge>{count}</Badge></p>
        </ListGroupItem>
    )
}
Facet = connect()(Facet)


//Search Box for a single field
let SearchBox = ({fieldName, dispatch}) => {
    let input;
    return (
        <form
            onSubmit={e => {
                e.preventDefault()
                dispatch(changeFacetsSearchText(fieldName, input.value))
            }}>
            <input
                ref={node => {
                    input = node
                }}/>
        </form>
    )
}
SearchBox = connect()(SearchBox);


//Facets results for a single field
let TextOptions = ({facets, onAddFilter}) => {
    console.log(facets);
    return (
        <Panel collapsible defaultExpanded header={facets.field.name}>
            <SearchBox fieldName={facets.field.name}/>
            <div className="facet-list-scroll">
                <ListGroup fill>
                    {facets.options.headers.map((head, index)=>
                        <Facet head={head} count={facets.options.counts[index]} field={facets.field} key={head} onAddFilter={onAddFilter}/>
                    )}
                </ListGroup>
            </div>
        </Panel>
    )
}

export default TextOptions;
