import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const searchApi = createApi({
    reducerPath: "searchApi",
    baseQuery,
    endpoints: (builder) => ({
        search: builder.query({
            query: ({ q }) => ({
                url: `/search?q=${q}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useSearchQuery } = searchApi;
