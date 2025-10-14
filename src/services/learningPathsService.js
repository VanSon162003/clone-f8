import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const learningPathsApi = createApi({
    reducerPath: "learningPathsApi",
    baseQuery,
    endpoints: (builder) => ({
        listLearningPaths: builder.query({
            query: () => "/learning-paths",
        }),
        getLearningPathBySlug: builder.query({
            query: (slug) => `/learning-paths/${slug}`,
        }),
    }),
});

export const {
    useListLearningPathsQuery,
    useGetLearningPathBySlugQuery,
} = learningPathsApi;


