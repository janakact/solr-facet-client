import types from "../constants/ActionTypes";
import solrClient from "../api/solr-client";
// export const setBaseUrl = url => {
//     setTimeout(() => {solrClient.getFields();}, 100);
//     return {
//         type: types.SET_BASEURL,
//         url:url
//     }
// };

//Fields
export const requestFields = (url) => {
    setTimeout(() => {
        solrClient.getFields();
    }, 10);
    setTimeout(() => {
        solrClient.getFacetsForAllFields();
    }, 10);
    return {
        type: types.REQUEST_FIELDS,
        url
    }
};

export const updateFields = (fields) => ({
    type: types.UPDATE_FIELDS,
    fields
})

export const updateStats = (stats) => ({
    type: types.UPDATE_STATS,
    stats
})

export const toggleSelectField = (fieldName) => {
    setTimeout(() => {
        solrClient.getFacets(fieldName);
    }, 10);
    return {
        type: types.TOGGLESELECT_FIELD,
        fieldName
    }
}

export const updateFacets = (facets) => ({
    type: types.UPDATE_FACETS,
    facets
})


//----------------------------------------------- Change facets
export const changeFacetsSearchText = (fieldName, searchText) => {
    setTimeout(() => {
        solrClient.getFacets(fieldName);
    }, 10);
    return ({
        type: types.CHANGE_FACETS_OPTIONS,
        fieldName,
        options: {searchText}
    });
}

export const changeFacetsNumericRange = (fieldName, range) => {
    setTimeout(() => {
        solrClient.getFacets(fieldName);
    }, 10);
    return ({
        type: types.CHANGE_FACETS_OPTIONS,
        fieldName,
        options: {range}
    });
}
// ------------------------------------------------------------------------
export const addFilter = (filterObject) => {
    setTimeout(() => {
        solrClient.getFacetsForAllFields();
    }, 10);
    return ({
        type: types.ADD_FILTER,
        filterObject
    });
}

export const removeFilter = (filterObject) => {
    setTimeout(() => {
        solrClient.getFacetsForAllFields();
    }, 10);
    return ({
        type: types.REMOVE_FILTER,
        filterObject
    })
}


export const updateData = (data) => {
    return ({
        type: types.UPDATE_DATA,
        data
    })
}

export const updatePagination = (start, rows) => {
    setTimeout(() => {
        solrClient.getData();
    }, 10);
    return ({
        type: types.UPDATE_PAGINATION,
        start,
        rows
    })
}
