import types from '../constants/ActionTypes';
const initialState = {
    baseUrl:"",
    fields:[],
	filters:[]
}

const query = (state=initialState, action) => {
    console.log(state)
    console.log(action)
    switch (action.type) {
      case types.SET_BASEURL:
        return {...state,baseUrl:action.url}
      case types.REQUEST_FIELDS:
        return state
      default:
        return state;
  }
}

export default query;
