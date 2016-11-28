import types from "../constants/ActionTypes";
const initialState = {
    fetching: false,
    baseUrl: "http://localhost:8983/solr/gettingstarted/",
    fields: {},
    facetsList: {},
    filters: [],
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
            let newFilters = []
            let added = false;
            for(let filter of state.filters){
                if(filter.field.name===action.filterObject.field.name)
                {
                    newFilters.push(action.filterObject)
                    added = true;
                    break;
                }
                else
                    newFilters.push(filter)
            }
            if(!added)
                newFilters.push(action.filterObject);
            return {
                ...state,
                filters: newFilters,
                data: {...state.data, start: 0} //Reset start
            }
        case types.REMOVE_FILTER:
            return {
                ...state,
                filters: [...state.filters].filter((item) => item.fieldName !== action.filterObject.fieldName)
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
