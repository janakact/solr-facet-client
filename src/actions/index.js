import types from "../constants/ActionTypes";
import solrClient from "../api/solr-client";

// Connection and Schema related actions -----------------------------
// -------------------------------------------------------------------
//Set the base Url for solr instance. This removes all filters and facets.
//and then call getField() and getData() in background to load data from the new url
export const setBaseurl = (url) => {
    setTimeout(() => solrClient.getFields()
        .then(()=> {
            solrClient.getData();
        }), 10);
    return {
        type: types.SET_BASEURL,
        url
    }
};

// Called by SolrClient, when field data is fetched this is called to update the application state.
export const updateFields = (fields) => ({
    type: types.UPDATE_FIELDS,
    fields
})

// Called by SolrClient, when stats data is fetched this is called to update the application state.
// Stats contain min, max and avg values of each field
export const updateStats = (stats) => ({
    type: types.UPDATE_STATS,
    stats
})

// Facets related actions --------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
// Request facets data for a particular field. Field is marked as selected
export const requestFacets = (fieldName) => {
    setTimeout(() => {
        solrClient.getFacets(fieldName);
    }, 10);
    return {
        type: types.TOGGLESELECT_FIELD,
        fieldName
    }
}

//Show popup window, when user clicks on a field it is called.
export const showFacetsWindow = (fieldName = null) => {
    if (fieldName !== null)
        setTimeout(() => {
            solrClient.getFacets(fieldName);
        }, 10);
    return ({
        type: types.TOGGLE_FACETS_WINDOW,
        show: true,
        fieldName
    })
}

//Hide the window
export const hideFacetsWindow = () => ({
    type: types.TOGGLE_FACETS_WINDOW,
    show: false
})

// Called by SolrClient, when facets data is fetched this is called to update the application state.
export const updateFacets = (facets) => ({
    type: types.UPDATE_FACETS,
    facets
})


//When user types a query on the facets list this is called to add the text as a filter for facets.
//Then getFacets is called to request filtered facets.
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

//For Numeric fields
//Called when the selected range is changed. When user selected a new range, it is set and
//then call the getFacets() to request facets for new range
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

// TODO This is not used. Can be removed.
//When the shape of the particular field is changed.
export const changeFacetsGeoShape = (fieldName, shape) => {
    // setTimeout(() => {
    //     solrClient.getFacets(fieldName);
    // }, 10);
    return ({
        type: types.CHANGE_FACETS_OPTIONS,
        fieldName,
        options: {shape}
    });
}


// Filters Related Actions -------------------------------------------------
// -------------------------------------------------------------------------
// add the particular filter to filter list
// then request data and facets
export const addFilter = (filterObject) => {
    setTimeout(() => {
        solrClient.getFacetsForAllFields();
    }, 10);
    return ({
        type: types.ADD_FILTER,
        filterObject
    });
}

//TODO should be removed or updated
// Add to the current editing filter. THis is to be used to edit functionality of Filters. Currently not supported.
export const addToEditingFilter = (filterObject) => {
    setTimeout(() => {
        solrClient.getFacetsForAllFields();
    }, 10);
    return ({
        type: types.ADD_TO_EDITING_FILTER,
        filterObject
    });
}

//Remove a particular filter
export const removeFilter = (filterObject) => {
    setTimeout(() => {
        solrClient.getFacetsForAllFields();
    }, 10);
    return ({
        type: types.REMOVE_FILTER,
        filterObject
    })
}

export const finishFilterEditing = () => {
    return ({
        type: types.FINISH_FILTER_EDITING
    })
}

export const startFilterEditing = (filter) => {
    return ({
        type: types.START_FILTER_EDITING,
        filter
    })
}


//------------ Sort
export const setSort = (sort) => {
    setTimeout(() => {
        solrClient.getData();
    }, 10);
    return ({
        type: types.SET_SORT,
        sort
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


export const setTimesliderOptions = (options) => {
    setTimeout(() => solrClient.getData(), 10);
    return ({
        type: types.SET_TIMESLIDER_OPTIONS,
        options
    })
}

export const addFetchingUrl = (url) => {
    return {
        type: types.ADD_FETCHING_URL,
        url
    }
}

export const removeFetchingUrl = (url) => {
    return {
        type: types.REMOVE_FETCHING_URL,
        url
    }
}

export const addFetchingError = (e) => {
    return {
        type: types.ADD_FETCHING_ERROR,
        e
    }
}

export const removeFetchingError = (e) => {
    return {
        type: types.REMOVE_FETCHING_ERROR,
        e
    }
}