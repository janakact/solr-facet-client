import React from 'react';

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
			<tr onClick={this.handleClick} value={this.props.value}>
				<td>
				{this.props.value}
				</td>
				<td>
				{this.props.count}
				</td>
			</tr>
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
		<div>
			{this.props.field}
		<table>
			{this.props.facets.map((facet,index)=>
				<Facet
					{...facet}
					key={index}
					indexValue={index+1}
					onClickFacet={this.onClickFacet} />
			)}
		</table>
		<br/>
	</div>
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
		<div>
			Facets
			{this.props.fields.map((field,index)=>
				<FacetField
					{...field}
					key={index}
					indexValue={index+1}
					onClickFacet={this.onClickFacet}
					 />
			)}
		</div>
	);}
});

export default AvailableFacetFields;
