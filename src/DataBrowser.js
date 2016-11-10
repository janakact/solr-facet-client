import React from 'react';
import { Panel,Well, Pagination, Row, Col, Tab, Tabs } from 'react-bootstrap';
import {Table, Column, Cell} from 'fixed-data-table';
import GeoView from './GeoView'

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
		          <option value="10000">*10000</option>

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

var TableView = React.createClass({
    render()
    {
        return (


            <Table
                rowHeight={30}
                rowsCount={this.props.docs.length}
                width={1100}
                height={340}
                headerHeight={40}>

                <Column
                    header="#"
                    cell={({rowIndex, ...props}) => (<Cell>{rowIndex+1}</Cell>)}
                    width={100}
                    />
                {this.props.columnNames.map((columnName,index)=>

                    <Column
                        key={index}
                         header={<Cell>{columnName}</Cell>}
                         cell={({rowIndex, ...props}) => (
                           <Cell {...props}>
                             {this.props.docs[rowIndex][columnName]}
                           </Cell>
                         )}
                         width={100}
                        />
                   )}
       </Table>
        )
    }
});


var DataBrowser = React.createClass({
	render:function(){
		return(
			<Panel  bsStyle="info" header="Data" >
				<PageNav {...this.props.data} onPageSelect={this.props.onPageSelect}/>
				<Well bsSize="small">URL: <a href={this.props.data.url}><code >{this.props.data.url}</code></a></Well>

                    <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                    <Tab eventKey={1} title="Table">
                        <TableView columnNames={this.props.data.columnNames} docs={this.props.data.docs} start={this.props.data.start}/>
                    </Tab>

                    <Tab eventKey={2} title="JSON Response">
    					<pre className="pre-scrollable">
    					{this.props.data.text}
    					</pre>
                    </Tab>

                    <Tab eventKey={3} title="Map">
                        <GeoView docs={this.props.data.docs} field="Location" fields={this.props.data.columnNames}/>
                    </Tab>



                    </Tabs>
			</Panel>
		)
	}
});



export default DataBrowser;
