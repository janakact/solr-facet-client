import React from 'react';
var LoadingIcon = React.createClass({
	render:function () {
		if(this.props.visible)
			return (<div fill><div className="loader fill"></div></div>);
		return null;
	}
})

export default LoadingIcon;
