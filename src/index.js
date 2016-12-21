/*
 *  Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */
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
import "../node_modules/leaflet/dist/leaflet.css";
import "../node_modules/rc-slider/dist/rc-slider.min.css";
import "../node_modules/leaflet-draw/dist/leaflet.draw.css"
import "../node_modules/react-datetime/css/react-datetime.css"

const store = createStore(reducer);
store.subscribe(()=>{console.log(store.getState())}); //To log all changes

solrClient.setStore(store);

store.dispatch(actions.setBaseurl("http://localhost:8983/solr/air3/"))
ReactDOM.render(
    <Provider store={store}>
        <div className="container_all">
            <App />

        </div>
    </Provider>,
    document.getElementById('root')
);
