import React from 'react';
import { ListGroup,ListGroupItem,Badge,Row,Col, Panel } from 'react-bootstrap';
import { connect } from 'react-redux'
import {addFilter} from '../../actions'



//Facets results for a single field
let Graph = ({facets}) => {
    return(
        <Panel collapsible defaultExpanded header={facets.fieldName} >
            <SearchBox fieldName={facets.fieldName}/>
            <div  className="facet-list-scroll" >
                    {JSON.stringify(facets)}
            </div>
        </Panel>
    )
}

export default Graph;
