import { applyMiddleware, combineReducers, legacy_createStore } from "redux";

import { reducer as productReducer } from "@/reducers/product";
import { reducer as authReducer } from "@/reducers/auth";
import { thunk } from "redux-thunk";
import logger from "redux-logger";

const initState = {};

const rootReducer = combineReducers({
    product: productReducer,
    auth: authReducer,
});

const store = legacy_createStore(
    rootReducer,
    initState,
    applyMiddleware(thunk, logger)
);

export default store;
