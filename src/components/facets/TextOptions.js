import React from 'react';
import { ListGroup,ListGroupItem,Badge,Row,Col, Panel } from 'react-bootstrap';
import { connect } from 'react-redux'
import {changeSearchTextFacets, addFilter} from '../../actions'

//Single Facet Element. Query Oprtion
let Facet = ({value,count, fieldName, dispatch}) => {
    return(
        <ListGroupItem href="#" onClick={()=>{dispatch(addFilter({fieldName:fieldName, query:value}))}}>
            <p>{value} <Badge>{count}</Badge></p>
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
              dispatch(changeSearchTextFacets(fieldName,input.value))
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
    return(
        <Panel collapsible defaultExpanded header={facets.fieldName} >
            <SearchBox fieldName={facets.fieldName}/>
            <div  className="facet-list-scroll" >
            <ListGroup fill>
                    {facets.facets.map((facet,index)=>
                        <Facet {...facet} fieldName={facets.fieldName} key={facet.value}>{facet.value}</Facet>
                    )}
            </ListGroup>
            </div>
        </Panel>
    )
}

export default TextOptions;
