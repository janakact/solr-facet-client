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
const types = {
    SET_BASEURL: 'SET_BASEURL',
    UPDATE_FIELDS: 'UPDATE_FIELDS',
    TOGGLESELECT_FIELD: 'TOGGLESELECT_FIELD',
    TOGGLE_FACETS_WINDOW: 'TOGGLE_FACETS_WINDOW',

    //Only for a single field
    REQUEST_FACETS: 'REQUEST_FACETS',
    UPDATE_STATS: 'UPDATE_STATS',
    UPDATE_FACETS: 'UPDATE_FACETS',
    CHANGE_FACETS_OPTIONS: 'CHANGE_FACETS_OPTIONS',


    //Add filters
    ADD_FILTER: 'ADD_FILTER',
    REMOVE_FILTER: 'REMOVE_FILTER',
    FINISH_FILTER_EDITING: 'FINISH_FILTER_EDITING',
    START_FILTER_EDITING: 'START_FILTER_EDITING',
    ADD_TO_EDITING_FILTER: 'ADD_TO_EDITING_FILTER',

    SET_SORT:'SET_SORT',

    // 'FAIL_TO_FETCH'
    UPDATE_DATA: 'UPDATE_DATA',
    UPDATE_PAGINATION: 'UPDATE_PAGINATION',

    //Time Slider -- on
    SET_TIMESLIDER_OPTIONS:'SET_TIMESLIDER_OPTIONS',

    //API calls tracking
    ADD_FETCHING_URL:'ADD_FETCHING_URL',
    REMOVE_FETCHING_URL:'REMOVE_FETCHING_URL',
    ADD_FETCHING_ERROR:'ADD_FETCHING_ERROR',
    REMOVE_FETCHING_ERROR:'REMOVE_FETCHING_ERROR',

    //load Query from a filte
    LOAD_FROM_FILE:'LOAD_FROM_FILE'

}

export default types;
