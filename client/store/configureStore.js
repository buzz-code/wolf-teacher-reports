import {applyMiddleware, compose, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {routerMiddleware} from 'connected-react-router';
import logger from 'redux-logger';

import createRootReducer from '../reducers';
import history from '../../common-modules/client/utils/history';

export {history};

const middlewares = [thunkMiddleware, logger, routerMiddleware(history)];

const store = createStore(createRootReducer(history), {}, compose(
    applyMiddleware(...middlewares)
    )
);

export default store;