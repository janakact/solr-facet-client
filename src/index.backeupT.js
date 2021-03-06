import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import solrClient from "./api/solr-client";
import {createStore} from "redux";
import {Provider} from "react-redux";
import reducer from "./reducers";
import * as actions from "./actions";
import "./index.css";
import "../node_modules/fixed-data-table/dist/fixed-data-table.css";

const store = createStore(reducer);
store.subscribe(() => {
    console.log(store.getState())
}); //To log all changes

solrClient.setStore(store);

store.dispatch(actions.setBaseurl("http://localhost:8983/solr/gettingstarted/"))


const div = document.createElement('div');
const mapm = document.createElement('map');

ReactDOM.render(<Provider store={store}>
    <div className="container">
        <App />
    </div>
</Provider>, div);
