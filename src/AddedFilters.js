import React from 'react';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6

// import { Panel } from 'react-bootstrap';


var AddedFilter = React.createClass({
    handleClick(event) {
        this.props.onRemoveClick(this.props.filter)
    },
    render:function()
    {
        return (
          <li className={"tag-cloud"}>{this.props.filter.field} : {this.props.filter.value}  <span onClick={this.handleClick} className="glyphicon glyphicon-remove"></span> </li>
        );
    }
});

var AddedFilters = React.createClass({
    render:function()
    {
      return (
  			<ul>
              {this.props.addedFilters.map((filter,index)=>
              <AddedFilter filter={filter} key={index} indexValue={index+1} onRemoveClick={this.props.onRemoveClick} />
              )}
            </ul>
        );
    }
})


export default AddedFilters;
