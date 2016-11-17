import types from '../constants/ActionTypes';

export const setBaseUrl = url => ({
  type: types.SET_BASEURL,
  url
});
