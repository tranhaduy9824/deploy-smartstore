import { combineReducers, createStore } from 'redux';
import alertReducer from './reducers/alertReducer';
import loadingReducer from './reducers/loadingReducer';

const rootReducer = combineReducers({
    alert: alertReducer,
    loading: loadingReducer
});

const store = createStore(rootReducer);

export { store };
