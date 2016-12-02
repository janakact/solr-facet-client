import React from 'react';
import Draggable from 'react-draggable'; // The default
import { ListGroup,ListGroupItem,Badge,Panel, Col } from 'react-bootstrap';
import { connect } from 'react-redux'
import {changeFacetsSearchText, addFilter} from '../../actions'
import filterTypes from '../../constants/FilterTypes'

//Single Facet Element. Query Oprtion
let Facet = ({head,count, field, dispatch}) => {
    return(
        <ListGroupItem href="#" onClick={()=>{dispatch(addFilter({field:field, query:head, type:filterTypes.TEXT_FILTER}))}}>
            <p>{head} <Badge>{count}</Badge></p>
        </ListGroupItem>
    )
}
Facet = connect()(Facet)


//Search Box for a single field
let SearchBox = ({fieldName,dispatch}) => {
    let input;
    return (
        <form
            onSubmit={e => {
              e.preventDefault()
              dispatch(changeFacetsSearchText(fieldName,input.value))
        }}>
          <input
              ref={node => {
              input = node
          }} />
        </form>
    )
}
SearchBox = connect()(SearchBox);


//Facets results for a single field
let TextOptions = ({facets}) => {
    console.log(facets);
    return(

        <Draggable
            zIndex={1000}>
        <Col xs={12} md={3} >
        <Panel collapsible defaultExpanded header={facets.field.name} >
            <SearchBox fieldName={facets.field.name}/>
            <div  className="facet-list-scroll" >
            <ListGroup fill>
                    {facets.options.headers.map((head,index)=>
                        <Facet head={head} count={facets.options.counts[index]} field={facets.field} key={head}/>
                    )}
            </ListGroup>
            </div>
        </Panel>
        </Col>
    </Draggable>
    )
}

export default TextOptions;
