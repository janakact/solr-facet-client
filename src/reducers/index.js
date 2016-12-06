import types from "../constants/ActionTypes";
const initialState = {
    fetching: false,
    facetsWindow: {
        show: false,
        fieldName: null
    },
    baseUrl: "http://localhost:8983/solr/gettingstarted/",
    fields: {},
    facetsList: {},
    filters: [],
    sorts:[],
    data: {
        jsonResponse: "",
        url: "",
        numFound: 0,
        start: 0,
        rows: 10,
        docs: [],
        columnNames: []
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
        case types.SET_BASEURL:
            return {...state, baseUrl: action.url, fetching: true}
        case types.REQUEST_FIELDS:
            return {...state, baseUrl: action.url, fetching: true}
        case types.UPDATE_FIELDS:
            return {...state, fields: action.fields, fetching: false}
        case types.TOGGLESELECT_FIELD:
            //Delete facets
            let newFacetsList2 = {...state.facetsList}
            delete newFacetsList2[action.fieldName]

            let fields2 = {...state.fields}
            fields2[action.fieldName] = {...fields2[action.fieldName], selected: !fields2[action.fieldName].selected}

            //toggole field Name
            return {
                ...state,
                facetsList: newFacetsList2,
                fields: fields2
            }

        case types.TOGGLE_FACETS_WINDOW:
            return {...state, facetsWindow:{show:action.show, fieldName:action.fieldName}}

        case types.REQUEST_FACETS:
            return {...state, fetching: true}
        case types.UPDATE_FACETS:
            let newFacetsList = {...state.facetsList}
            newFacetsList[action.facets.field.name] = action.facets;
            return {...state, fetching: false, facetsList: newFacetsList}

        case types.UPDATE_STATS:
            let newFields = state.fields;
            for (let fieldName of Object.keys(action.stats)) {
                newFields[fieldName] = {...state.fields[fieldName], stats: action.stats[fieldName]}
            }
            return {...state, fields: newFields}

        //----------------------------------------------- changeing facets
        case types.CHANGE_FACETS_OPTIONS:
            let newFacetsListSearch = {...state.facetsList}
            newFacetsListSearch[action.fieldName] = {...newFacetsListSearch[action.fieldName], ...action.options};
            return {...state, fetching: true, facetsList: newFacetsListSearch}
        // ---------------------------------------------------------------

        case types.ADD_FILTER:
            return {
                ...state,
                filters: [...   state.filters, action.filterObject],
                data: {...state.data, start: 0} //Reset start
            }
        case types.ADD_TO_EDITING_FILTER:
            let added = false;
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
                filters: [...state.filters].filter((item) => item.field.name !== action.filterObject.field.name)
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
                    editing: filter == action.filter ? true : false
                }))
            }


        //Sort
        case types.ADD_SORT:
            return {
                ...state,
                sorts:[...state.sorts, action.sort]
            }


        //DataBrowser
        case types.UPDATE_DATA:
            return {...state, data: action.data}
        case types.UPDATE_PAGINATION:
            return {...state, data: {...state.data, start: action.start, rows: action.rows}}

        default:
            return state;
    }
}

export default reducer;
