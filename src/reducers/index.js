import { combineReducers } from 'redux'
import query from './query'
import result from './result'

const reducer = combineReducers({
  query,
  result
});

export default reducer;
