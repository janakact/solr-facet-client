import React from 'react';
import { Button,Panel } from 'react-bootstrap';

var AvailableField = React.createClass( {
	getInitialState: function () {
		return {
			checked:false
		}
	},
	handleChange(event) {
		var newState = !this.state.checked;
		if(this.props.onSelectionChange(this.props.name,newState))
			this.setState({checked:newState});
	},
	render:function(){
		return(

			<li className={"tag-cloud "+(this.state.checked ? 'tag-cloud-item-checked' : 'tag-cloud-item')}
			onClick={this.handleChange}>
				<strong>{this.props.name}</strong> : {this.props.type}
				{/* A JSX comment

				<input
					checked={this.state.checked}
					type="checkbox"
					value={this.props.name}
					onClick={this.handleChange}
					/>
					*/}
			</li>
		)
		;}
	});

var AvailableFields = React.createClass( {
	getInitialState: function () {
		return {
		}
	},
	render:function(){
	if(!this.props.fields.length>0) return null;
	return (
		<Panel  bsStyle="info" header="Available Fields">
			<ul>
			{this.props.fields.map((field,index)=>
				<AvailableField
					{...field}
					key={index}
					indexValue={index+1}
					onSelectionChange={this.props.onSelectionChange}
					 />
			)}
		</ul>

        <Button  onClick={this.props.onRequestFacets}>Get Facets</Button>
	</Panel>
	);}
});

export default AvailableFields;
