import { createApi } from "@reduxjs/toolkit/query/react";

import baseQuery from "./baseQuery";

export const coursesApi = createApi({
    reducerPath: "coursesApi",
    baseQuery,
    endpoints: (builder) => ({
        getAllCourses: builder.query({
            query: () => `/courses`,
        }),

        getBySlug: builder.query({
            query: (slug) => `/courses/${slug}`,
        }),
        getAllCoursesVideo: builder.query({
            query: () => `/courses/videos`,
        }),
    }),
});

export const {
    useGetAllCoursesQuery,
    useGetBySlugQuery,
    useGetAllCoursesVideoQuery,
} = coursesApi;
