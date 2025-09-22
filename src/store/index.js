import logger from "redux-logger";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import { profileApi } from "@/services/ProfileService";
import { setupListeners } from "@reduxjs/toolkit/query";
import headerReducer from "@/features/auth/headerSlice";

const rootConfig = {
    key: "auth",
    storage,
};

const rootReducer = combineReducers({
    auth: authReducer,
    header: headerReducer,
    // [profileApi.reducerPath]: profileApi.reducer,
});

export const store = configureStore({
    reducer: persistReducer(rootConfig, rootReducer),
    middleware: (getDefault) => [
        ...getDefault({ serializableCheck: false }),
        // profileApi.middleware,
    ],
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
