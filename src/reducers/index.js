import types from '../constants/ActionTypes';
const initialState = {
    fetching:false,
    baseUrl:"http://localhost:8983/solr/gettingstarted/",
    fields:[],
    facetsList:{},
	filters:[]
}

const reducer = (state=initialState, action) => {
    console.log("----------------------------\nState:");
    console.log(state)
    console.log("Action:");
    console.log(action)

    switch (action.type) {
        case types.SET_BASEURL:
            return {...state,baseUrl:action.url, fetching:true}
        case types.REQUEST_FIELDS:
            return {...state,baseUrl:action.url, fetching:true}
        case types.UPDATE_FIELDS:
            return {...state,fields:action.fields, fetching:false}
        case types.TOGGLESELECT_FIELD:
            let newFacetsList2 = {...state.facetsList}
            delete newFacetsList2[action.fieldName]
            return {...state,
                facetsList:newFacetsList2,
                fields:state.fields.map((field)=>({...field,
                    selected:action.fieldName===field.name?!field.selected:field.selected}))}

        case types.REQUEST_FACETS:
            return {...state, fetching:true}
        case types.UPDATE_FACETS:
            let newFacetsList = {...state.facetsList}
            newFacetsList[action.facets.fieldName] = action.facets;
            return {...state, fetching:false, facetsList:newFacetsList}
        //
        case types.CHANGE_SEARCHTEXT_FACETS:
            let newFacetsListSearch = {...state.facetsList}
            newFacetsListSearch[action.fieldName] = {...newFacetsListSearch[action.fieldName],searchText:action.text};
            return {...state, fetching:true, facetsList:newFacetsListSearch}

        case types.ADD_FILTER:
            return {...state, filters:[...state.filters, action.filterObject ]}
        case types.REMOVE_FILTER:
            return {...state, filters:[...state.filters].filter((item)=>item.fieldName!=action.filterObject.fieldName)}

      default:
        return state;
  }
}

export default reducer;
