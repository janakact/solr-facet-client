import React from 'react';
import { ListGroup,ListGroupItem,Badge,Grid,Row,Col, Panel } from 'react-bootstrap';

//Single entry inside a field
var Facet = React.createClass( {
	getInitialState: function () {
		return {
		}
	},
	handleClick(event) {
		this.props.onClickFacet(this.props.value)
	},
	render:function(){
		return(
			<ListGroupItem href="#" onClick={this.handleClick}>
				{this.props.value}<Badge>{this.props.count}</Badge>
			</ListGroupItem>
		)
		;}
	});

//Facet data for a single field
var FacetField = React.createClass( {
	getInitialState: function () {
		return {
		}
	},
	onClickFacet(value) {
		this.props.onClickFacet(this.props.field,value)
	},
	render:function(){
	return (

			<ListGroup>
      <ListGroupItem href="#" active>{this.props.field}</ListGroupItem>

			{this.props.facets.map((facet,index)=>
				<Facet
					{...facet}
					key={index}
					indexValue={index+1}
					onClickFacet={this.onClickFacet} />
			)}
		</ListGroup>

	);}
});

//Whole Item
var AvailableFacetFields = React.createClass( {
	getInitialState: function () {
		return {
		}
	},
	onClickFacet(field,value) {
		this.props.onClickFacet(field,value);
	},
	render:function(){
	return (

<Panel  bsStyle="info" header="Drilldown Options">
			    <Row className="show-grid">
					{this.props.fields.map((field,index)=>

				 	<Col xs={12} md={3} key={index}>
						<FacetField
							{...field}
							key={index}
							indexValue={index+1}
							onClickFacet={this.onClickFacet}
							 />
					 </Col>
					)}

		  </Row>
	</Panel>
	);}
});

export default AvailableFacetFields;
