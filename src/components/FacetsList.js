import React from 'react';
import { ListGroup,ListGroupItem,Badge,Row,Col, Panel } from 'react-bootstrap';
import { connect } from 'react-redux'
// import { request } from '../actions'

let Facets = ({facets}) => {
    return(
        <Panel collapsible defaultExpanded header={facets.field} >

            <div  className="facet-list-scroll" >
            <ListGroup fill>
                    {facets.facets.map((facet,index)=>
                        <li>{facet.value}</li>
                    )}
            </ListGroup>
            </div>
        </Panel>
    )
}

let FacetsList = ({ facetsList }) => {
  return (
      <Panel  bsStyle="info" header="Drilldown Options">
      <Row className="show-grid">
          {Object.keys(facetsList).map((field,index)=>

          <Col xs={12} md={3} key={index}>
              <Facets
                 facets={facetsList[field]}>
              </Facets>
           </Col>
          )}
      </Row>
  </Panel>
  )
}
export default FacetsList
