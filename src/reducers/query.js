import types from '../constants/ActionTypes';
const initialState = {
    fetching:false,
    baseUrl:"http://localhost:8983/solr/gettingstarted/",
    fields:[],
    facetsList:{},
	filters:[]
}

const query = (state=initialState, action) => {
    console.log(state)
    console.log(action)
    switch (action.type) {
        case types.SET_BASEURL:
            return {...state,baseUrl:action.url, fetching:true}
        case types.REQUEST_FIELDS:
            return {...state,baseUrl:action.url, fetching:true}
        case types.UPDATE_FIELDS:
            return {...state,fields:action.fields, fetching:false}
        case types.TOGGLESELECT_FIELD:
            return {...state,fields:state.fields.map((field)=>({...field,
                selected:action.fieldName===field.name?!field.selected:field.selected}))}

        case types.REQUEST_FACETS:
            return {...state, fetching:true}
        case types.UPDATE_FACETS:
            let newFacetsList = {...state.facetsList}
            newFacetsList[action.facets.field] = action.facets;
            return {...state, fetching:false, facetsList:newFacetsList}
      default:
        return state;
  }
}

export default query;
