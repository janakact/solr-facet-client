import React from 'react';
import { ListGroup,ListGroupItem,Badge,Row,Col, Panel } from 'react-bootstrap';
import LoadingIcon from './LoadingIcon';

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
				<p>{this.props.value} <Badge>{this.props.count}</Badge></p>
			</ListGroupItem>
		)
		;}
	});

//Facet data for a single field
var FacetField = React.createClass( {
	getInitialState: function () {
		return {
			searchText:"",
			loading:false
		}
	},
	handleChangeSeachText(event) {
		this.setState({searchText:event.target.value, loading:true})
		this.props.onSearchTextChange({field:this.props.field,text:event.target.value});
    },
	onClickFacet(value) {
		this.props.onClickFacet(this.props.field,value);
	},
	componentWillReceiveProps(nextProps)
	{
		if(this.state.searchText===nextProps.searchText)
		{
			this.setState({searchText:nextProps.searchText, loading:false});
		}
	},
	render:function(){
	return (


	<Panel collapsible defaultExpanded header={this.props.field} >
		<input type="text" onChange={this.handleChangeSeachText} value={this.state.searchText}></input>
		<LoadingIcon visible={this.state.loading}/>

		<div  className="facet-list-scroll" >
		<ListGroup fill>
				{!this.state.loading && this.props.facets.map((facet,index)=>
					<Facet
						{...facet}
						key={index}
						indexValue={index+1}
						onClickFacet={this.onClickFacet} />
				)}
		</ListGroup>
		</div>
	</Panel>

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

			    <Row className="show-grid">
					{this.props.fields.map((field,index)=>

				 	<Col xs={12} md={3} key={index}>
						<FacetField
							{...field}
							key={index}
							indexValue={index+1}
							onClickFacet={this.onClickFacet}
							onSearchTextChange={this.props.onSearchTextChange} />
					 </Col>
					)}

		  </Row>
	);}
});

export default AvailableFacetFields;
