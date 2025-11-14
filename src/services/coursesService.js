import { createApi } from "@reduxjs/toolkit/query/react";

import baseQuery from "./baseQuery";

export const coursesApi = createApi({
    reducerPath: "coursesApi",
    baseQuery,
    endpoints: (builder) => ({
        getAllCourses: builder.query({
            query: () => `/courses`,
        }),

        getCoursesUser: builder.query({
            query: () => `/courses/user`,
        }),

        getBySlug: builder.query({
            query: ({ slug }) => `/courses/${slug}`,
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

        // Progress endpoints
        getCourseProgress: builder.query({
            query: ({ courseId }) => `/courses/${courseId}/progress`,
        }),
        updateCourseProgress: builder.mutation({
            query: ({ courseId, lessonId }) => ({
                url: `/courses/${courseId}/progress`,
                method: "POST",
                body: { lesson_id: lessonId },
            }),
        }),

        // User Lesson Progress endpoints
        getUserLessonProgress: builder.query({
            query: ({ courseId }) => `/courses/${courseId}/user-lessons`,
        }),
        updateUserCourseProgress: builder.mutation({
            query: ({ lessonId, watchDuration, lastPosition, completed }) => ({
                url: `/courses/user-course-progress`,
                method: "POST",
                body: { lessonId, watchDuration, lastPosition, completed },
            }),
        }),
    }),
});

export const {
    useGetAllCoursesQuery,
    useGetBySlugQuery,
    useGetAllCoursesVideoQuery,
    useRegisterCourseMutation,
    useGetCourseProgressQuery,
    useUpdateCourseProgressMutation,
    useGetUserLessonProgressQuery,
    useUpdateUserCourseProgressMutation,
    useGetCoursesUserQuery,
} = coursesApi;
