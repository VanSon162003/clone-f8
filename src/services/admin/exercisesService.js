import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const exercisesManagementApi = createApi({
    reducerPath: "exercisesManagementApi",
    baseQuery,
    tagTypes: ["AdminExercises"],
    endpoints: (builder) => ({
        getExerciseByLessonId: builder.query({
            query: (lessonId) => `/exercises/lesson/${lessonId}`,
            providesTags: (_result, _err, lessonId) => [
                { type: "AdminExercises", id: lessonId },
            ],
        }),

        upsertExercise: builder.mutation({
            query: (body) => ({
                url: "/exercises",
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _err, arg) => [
                { type: "AdminExercises", id: arg.lesson_id },
            ],
        }),

        deleteExercise: builder.mutation({
            query: (lessonId) => ({
                url: `/exercises/lesson/${lessonId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _err, lessonId) => [
                { type: "AdminExercises", id: lessonId },
            ],
        }),
    }),
});

export const {
    useGetExerciseByLessonIdQuery,
    useUpsertExerciseMutation,
    useDeleteExerciseMutation,
} = exercisesManagementApi;
