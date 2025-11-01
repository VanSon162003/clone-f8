import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const lessonsManagementApi = createApi({
    reducerPath: "lessonsManagementApi",
    baseQuery,
    tagTypes: ["Lessons"],
    endpoints: (builder) => ({
        getAllLessonsManagement: builder.query({
            query: ({
                page = 1,
                limit = 10,
                search = "",
                course_id = null,
            }) => {
                const queryParams = new URLSearchParams({
                    page,
                    limit,
                    ...(search && { search }),
                    ...(course_id && { course_id }),
                }).toString();
                return `/lessons?${queryParams}`;
            },
            providesTags: ["Lessons"],
        }),

        createLesson: builder.mutation({
            query: (formData) => ({
                url: "/lessons",
                method: "POST",
                body: formData,
                formData: true,
            }),
            invalidatesTags: ["Lessons"],
        }),

        updateLesson: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/lessons/${id}`,
                method: "PATCH",
                body: formData,
                formData: true,
            }),
            invalidatesTags: ["Lessons"],
        }),

        deleteLesson: builder.mutation({
            query: (id) => ({
                url: `/lessons/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Lessons"],
        }),

        updateLessonPosition: builder.mutation({
            query: ({ lessonId, position, trackId }) => ({
                url: `/lessons/${lessonId}/position`,
                method: "PATCH",
                body: {
                    position,
                    track_id: trackId,
                },
            }),
            invalidatesTags: ["Lessons"],
        }),
    }),
});

export const {
    useGetAllLessonsManagementQuery,
    useCreateLessonMutation,
    useUpdateLessonMutation,
    useDeleteLessonMutation,
    useUpdateLessonPositionMutation,
} = lessonsManagementApi;
