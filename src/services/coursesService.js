import { createApi } from "@reduxjs/toolkit/query/react";

import baseQuery from "./baseQuery";

export const coursesApi = createApi({
    reducerPath: "coursesApi",
    baseQuery,
    tagTypes: ["CourseProgress", "UserLessonProgress"],
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
            providesTags: ["CourseProgress"],
        }),
        updateCourseProgress: builder.mutation({
            query: ({ courseId, lessonId }) => ({
                url: `/courses/${courseId}/progress`,
                method: "POST",
                body: { lesson_id: lessonId },
            }),
            invalidatesTags: ["CourseProgress", "UserLessonProgress"],
        }),

        // User Lesson Progress endpoints
        getUserLessonProgress: builder.query({
            query: ({ courseId }) => `/courses/${courseId}/user-lessons`,
            providesTags: ["UserLessonProgress"],
        }),
        updateUserCourseProgress: builder.mutation({
            query: ({ lessonId, watchDuration, lastPosition, completed }) => ({
                url: `/courses/user-course-progress`,
                method: "POST",
                body: { lessonId, watchDuration, lastPosition, completed },
            }),
            invalidatesTags: ["CourseProgress", "UserLessonProgress"],
        }),
        
        // Exercise endpoints
        getExerciseByLessonId: builder.query({
            query: ({ lessonId }) => `/exercises/lesson/${lessonId}`,
        }),
        submitExercise: builder.mutation({
            query: ({ exerciseId, submittedCode, status }) => ({
                url: `/exercises/${exerciseId}/submit`,
                method: "POST",
                body: { submitted_code: submittedCode, status },
            }),
            invalidatesTags: ["CourseProgress", "UserLessonProgress"],
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
    useGetExerciseByLessonIdQuery,
    useSubmitExerciseMutation,
} = coursesApi;
