// import logger from "redux-logger";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { setupListeners } from "@reduxjs/toolkit/query";
import headerReducer from "@/features/auth/headerSlice";
import { coursesApi } from "@/services/coursesService";
import { postsApi } from "@/services/postsService";
import { commentsApi } from "@/services/commentsService";
import { likesApi } from "@/services/likesService";
import { bookmarksApi } from "@/services/bookmarksService";
import { learningPathsApi } from "@/services/learningPathsService";

const rootConfig = {
    key: "auth",
    storage,
};

const rootReducer = combineReducers({
    auth: authReducer,
    header: headerReducer,

    [coursesApi.reducerPath]: coursesApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [likesApi.reducerPath]: likesApi.reducer,
    [bookmarksApi.reducerPath]: bookmarksApi.reducer,
    [learningPathsApi.reducerPath]: learningPathsApi.reducer,
});

export const store = configureStore({
    reducer: persistReducer(rootConfig, rootReducer),
    middleware: (getDefault) => [
        ...getDefault({ serializableCheck: false, immutableCheck: false }),
        coursesApi.middleware,
        postsApi.middleware,
        commentsApi.middleware,
        likesApi.middleware,
        bookmarksApi.middleware,
        learningPathsApi.middleware,
    ],
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
