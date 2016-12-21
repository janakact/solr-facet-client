import React from 'react'
import {connect} from 'react-redux'
import {Panel} from 'react-bootstrap'
import {setSort} from '../actions'

let SavedQueryView = ({savedQueries, dispatch}) => {
    if (savedQueries.length > 0)
        return (
            <Panel bsStyle="info" header="Saved Queries">

            </Panel>)

    else
        return null;
}

SavedQueryView = connect()(SavedQueryView);

export default SavedQueryView;