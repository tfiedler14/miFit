import { combineReducers } from 'redux';
import data from './data/reducers';
import location from './location/reducers'
import auth from './auth/reducers'
import errors from './errors/reducers'
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
    data,
    location,
    auth,
    errors,
    form: formReducer
})
export default rootReducer;