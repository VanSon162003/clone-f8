// import logger from "redux-logger";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { setupListeners } from "@reduxjs/toolkit/query";
import headerReducer from "@/features/auth/headerSlice";
import { coursesApi } from "@/services/coursesService";
import { postsApi } from "@/services/postsService";

const rootConfig = {
    key: "auth",
    storage,
};

const rootReducer = combineReducers({
    auth: authReducer,
    header: headerReducer,

    [coursesApi.reducerPath]: coursesApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
});

export const store = configureStore({
    reducer: persistReducer(rootConfig, rootReducer),
    middleware: (getDefault) => [
        ...getDefault({ serializableCheck: false }),
        coursesApi.middleware,
        postsApi.middleware,
    ],
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
