import React from 'react';
import { Panel,Well, Pagination, Row, Col } from 'react-bootstrap';

var PageNav  = React.createClass({
  getInitialState() {
    return {
    };
  },

	handleSelectPage(eventKey) {
		this.props.onPageSelect((eventKey-1)*this.props.rows,this.props.rows);
	},

	handleRowsChange(event) {
		this.props.onPageSelect(this.props.start-this.props.start%event.target.value,event.target.value);
	},
  render() {
    return (
        <div>
			    <Row className="show-grid">
					 <Col xs={2} md={3}>
					 <label>Records per Page:</label>
				<select onChange={this.handleRowsChange} value={this.props.rows}>
		          <option value="1">1</option>
		          <option value="10">10</option>
		          <option value="100">100</option>
		          <option value="1000">1000</option>

		        </select>
			</Col>
			 <Col xs={2} md={8}>
		      	<Pagination
			        prev
			        next
			        first
			        last
			        ellipsis
			        boundaryLinks
			        items={Math.ceil(this.props.numFound/this.props.rows)}
			        maxButtons={5}
			        activePage={1+(Math.ceil(this.props.start/this.props.rows))}
			        onSelect={this.handleSelectPage} />
			</Col>
			</Row>
		</div>
    );
  }
});


var DataBrowser = React.createClass({
	render:function(){
		return(
			<Panel  bsStyle="info" header="Data" >
				<PageNav {...this.props.data} onPageSelect={this.props.onPageSelect}/>
				<Well bsSize="small">URL: <a href={this.props.data.url}><code >{this.props.data.url}</code></a></Well>

					<pre className="pre-scrollable">
					{this.props.data.text}
					</pre>
			</Panel>
		)
	}
});

export default DataBrowser;
