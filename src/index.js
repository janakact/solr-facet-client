import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'

import './index.css';
import '../node_modules/fixed-data-table/dist/fixed-data-table.css';

const store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
        <div className="container" >
            <App />
        </div>
    </Provider>,
  document.getElementById('root')
);
