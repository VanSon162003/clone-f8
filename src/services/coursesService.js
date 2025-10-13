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
            query: ({ slug, offset = 0, limit = 10 }) =>
                `/courses/${slug}?limit=${limit}&offset=${offset}`,
        }),
        getAllCoursesVideo: builder.query({
            query: () => `/courses/videos`,
        }),

        // build.mutation
        registerCourse: builder.mutation({
            query: (data) => ({
                url: `/courses/register`,
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useGetAllCoursesQuery,
    useGetBySlugQuery,
    useGetAllCoursesVideoQuery,
    useRegisterCourseMutation,
} = coursesApi;
