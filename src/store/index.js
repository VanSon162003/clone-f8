import logger from "redux-logger";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootConfig = {
    key: "auth",
    storage,
};

const rootReducer = combineReducers({
    auth: authReducer,
});

export const store = configureStore({
    reducer: persistReducer(rootConfig, rootReducer),
    middleware: (getDefault) => [
        ...getDefault({ serializableCheck: false }),
        logger,
    ],
});

export const persistor = persistStore(store);
