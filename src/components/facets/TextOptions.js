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
