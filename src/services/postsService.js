import { createApi } from "@reduxjs/toolkit/query/react";

import baseQuery from "./baseQuery";

export const postsApi = createApi({
    reducerPath: "postsApi",
    baseQuery,
    endpoints: (builder) => ({
        getPopularPosts: builder.query({
            query: () => `/posts/popular`,
        }),
    }),
});

export const { useGetPopularPostsQuery } = postsApi;
