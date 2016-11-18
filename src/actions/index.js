import types from '../constants/ActionTypes';
import solrClient from '../api/solr-client'
// export const setBaseUrl = url => {
//     setTimeout(() => {solrClient.getFields();}, 100);
//     return {
//         type: types.SET_BASEURL,
//         url:url
//     }
// };

//Fields
export const requestFields = (url) =>{
    setTimeout(() => {solrClient.getFields();}, 100);
    return {
        type:types.REQUEST_FIELDS,
        url
    }
};

export const updateFields = (fields) =>({
    type:types.UPDATE_FIELDS,
    fields
})

export const toggleSelectField = (fieldName) =>{
    setTimeout(() => {solrClient.getFacets(fieldName);}, 100);
    return {
        type:types.TOGGLESELECT_FIELD,
        fieldName
    }
}




//Facets
// export const requestFacets = (fieldName) => {
//     setTimeout(()=>{solrClient.getFacets(fieldName)});
//     return {
//     type:types.REQUEST_FACETS,
//     fieldName
//     }
// })

export const updateFacets = (facets) => ({
    type:types.UPDATE_FACETS,
    facets
})

export const changeSearchTextFacets = (fieldName, text) => {
    setTimeout(() => {solrClient.getFacets(fieldName);}, 100);
    return({
        type:types.CHANGE_SEARCHTEXT_FACETS,
        fieldName,
        text
    });
}

export const addFilter = (filterObject) => {
    setTimeout(() => {solrClient.getFacetsForAllFields();}, 100);
    return({
        type:types.ADD_FILTER,
        filterObject
    });
}

export const removeFilter = (filterObject) => {
    return ({
        type:types.REMOVE_FILTER,
        filterObject
    })
}
