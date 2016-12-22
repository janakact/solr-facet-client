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
import types from "../constants/ActionTypes";
const initialState = {
    fetchingUrls: [], //Add to this list when requesting data from Solr. If length===0 means no fetching.
    fetchingErrors:[], //Add to this list when error occurred during fetching or passing
    savedQueries:[],
    facetsWindow: {
        show: false,
        fieldName: null
    },
    timeSliderOptions:{
        field:{name:"", type:""}
    },
    baseUrl: "http://localhost:8983/solr/gettingstarted/",
    fields: {},
    facetsList: {},
    filters: [],
    sort:{field:null, type:'asc'},
    data: {
        jsonResponse: "",
        url: "",
        numFound: 0,
        start: 0,
        rows: 10,
        docs: [],
        columnNames: [],
        urlAllData:""
    }
}

const reducer = (state = initialState, action) => {

    // //Log the state and change
    console.log("----------------------------\nBefore State:");
    console.log(state)
    console.log("Action:");
    console.log(action)
    console.log("\n\n")

    switch (action.type) {
        //Schema and Conection
        case types.SET_BASEURL:
            return {...initialState, baseUrl: action.url}
        case types.UPDATE_FIELDS:
            return {...state, fields: action.fields}
        case types.TOGGLESELECT_FIELD:
            return {...state, fetching: true}
        case types.UPDATE_STATS:
            let newFields = state.fields;
            for (let fieldName of Object.keys(action.stats)) {
                newFields[fieldName] = {...state.fields[fieldName], stats: action.stats[fieldName]}
            }
            return {...state, fields: newFields}

        //Facets
        case types.TOGGLE_FACETS_WINDOW:
            return {...state, facetsWindow:{show:action.show, fieldName:action.fieldName}}
        case types.REQUEST_FACETS:
            return {...state, fetching: true}
        case types.UPDATE_FACETS:
            let newFacetsList = {...state.facetsList}
            newFacetsList[action.facets.field.name] = action.facets;
            return {...state, fetching: false, facetsList: newFacetsList}
        case types.CHANGE_FACETS_OPTIONS:
            let newFacetsListSearch = {...state.facetsList}
            newFacetsListSearch[action.fieldName] = {...newFacetsListSearch[action.fieldName], ...action.options};
            return {...state, fetching: true, facetsList: newFacetsListSearch}

        //Filters
        case types.ADD_FILTER:
            return {
                ...state,
                filters: [...state.filters, action.filterObject],
                data: {...state.data, start: 0} //Reset start
            }
        case types.ADD_TO_EDITING_FILTER:
            let newFilters = [];
            if (state.filters.filter(item=>item.editing).length === 0)
                newFilters = [...state.filters, action.filterObject]
            else
                newFilters = state.filters.map((filter)=>(filter.editing ? action.filterObject : filter));
            return {
                ...state,
                filters: newFilters,
                data: {...state.data, start: 0} //Reset start
            }
        case types.REMOVE_FILTER:
            return {
                ...state,
                filters: [...state.filters].filter((item) => item != action.filterObject)
            }
        case types.FINISH_FILTER_EDITING:
            return {
                ...state,
                filters: state.filters.map((filter) => ({...filter, editing: false}))
            }
        case types.START_FILTER_EDITING:
            return {
                ...state,
                filters: state.filters.map((filter, index) => ({
                    ...filter,
                    editing: filter === action.filter ? true : false
                }))
            }
        case types.SET_TIMESLIDER_OPTIONS: //this is also a filter
            return {...state, timeSliderOptions:{...state.timeSliderOptions, ...action.options}}

        //Sort
        case types.SET_SORT:
            return {
                ...state,
                sort:{...state.sort,...action.sort}
            }

        //DataBrowser
        case types.UPDATE_DATA:
            return {...state, data: action.data}
        case types.UPDATE_PAGINATION:
            return {...state, data: {...state.data, start: action.start, rows: action.rows}}


        //API call tracking
        case types.ADD_FETCHING_URL:
            return {...state, fetchingUrls:[...state.fetchingUrls, action.url]}
        case types.REMOVE_FETCHING_URL:
            return {...state, fetchingUrls:state.fetchingUrls.filter((url)=>url!==action.url)}
        case types.ADD_FETCHING_ERROR:
            return {...state, fetchingErrors:[...state.fetchingErrors, action.e]}
        case types.REMOVE_FETCHING_ERROR:
            return {...state, fetchingErrors:state.fetchingErrors.filter((e)=>e.url!==action.e.url)}

        //Load from file
        case types.LOAD_FROM_FILE:
            return {...initialState, ...JSON.parse(action.fileContent)}


        default:
            return state;
    }
}

export default reducer;
