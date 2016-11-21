import React from 'react';
import { Row,Col, Panel } from 'react-bootstrap';
import Facets from './facets/'
// import
// import { request } from '../actions'



//All Facet Boxes
let FacetsList = ({ facetsList }) => {
  return (
      <Panel  bsStyle="info" header="Drilldown Options">
      <Row className="show-grid">
          {Object.keys(facetsList).map((fieldName,index)=>

              <Facets
                  key={fieldName}
                 facets={facetsList[fieldName]}>
              </Facets>
          )}
      </Row>
  </Panel>
  )
}
export default FacetsList
