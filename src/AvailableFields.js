import React from 'react';

var AvailableField = React.createClass( {
	getInitialState: function () {
		return {
			checked:false
		}
	},
	handleChange(event) {
		var newState = !this.state.checked;
		this.props.onSelectionChange(event.target.value,newState);
		this.setState({checked:newState})
	},
	render:function(){
		return(
			<tr>
				<td>
				{this.props.name} : {this.props.type}
				</td>
				<td>
				<input
					checked={this.state.checked}
					type="checkbox"
					value={this.props.name}
					onClick={this.handleChange}
					/>
			</td>
			</tr>
		)
		;}
	});

var AvailableFields = React.createClass( {
	getInitialState: function () {
		return {
		}
	},
	handleChange(name,state) {
		this.props.onSelectionChange(name,state);
	},
	render:function(){
	return (
		<table>
			{this.props.fields.map((field,index)=>
				<AvailableField
					{...field}
					key={index}
					indexValue={index+1}
					onSelectionChange={this.handleChange}
					 />
			)}


		</table>
	);}
});

export default AvailableFields;
