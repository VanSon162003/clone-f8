import { createApi } from "@reduxjs/toolkit/query/react";

import baseQuery from "./baseQuery";

export const coursesManagementApi = createApi({
    reducerPath: "coursesManagementApi",
    baseQuery,
    endpoints: (builder) => ({
        getAllCoursesManagement: builder.query({
            query: ({ page = 1, limit = 10, search = "" }) => {
                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    ...(search && { search }),
                }).toString();
                return `courses?${queryParams}`;
            },
        }),

        updateCourseStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `courses/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
        }),
        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `courses/${id}`,
                method: "DELETE",
            }),
        }),
        createCourse: builder.mutation({
            query: (formData) => ({
                url: "courses",
                method: "POST",
                body: formData,
                formData: true,
            }),
        }),
        updateCourse: builder.mutation({
            query: ({ id, formData }) => ({
                url: `courses/${id}`,
                method: "PATCH",
                body: formData,
                formData: true,
            }),
        }),
    }),
});

export const {
    useGetAllCoursesManagementQuery,
    useUpdateCourseStatusMutation,
    useDeleteCourseMutation,
    useCreateCourseMutation,
    useUpdateCourseMutation,
} = coursesManagementApi;
