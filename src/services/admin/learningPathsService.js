import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const learningPathsManagementApi = createApi({
    reducerPath: "learningPathsManagementApi",
    baseQuery,
    tagTypes: ["LearningPaths"],
    endpoints: (builder) => ({
        getAllLearningPathsManagement: builder.query({
            query: ({ page = 1, limit = 10, search = "" }) => ({
                url: "/learning-paths",
                method: "GET",
                params: { page, limit, search },
            }),
            providesTags: ["LearningPaths"],
        }),
        createLearningPath: builder.mutation({
            query: (formData) => ({
                url: "/learning-paths",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["LearningPaths"],
        }),
        updateLearningPath: builder.mutation({
            query: ({ id, data }) => ({
                url: `/learning-paths/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["LearningPaths"],
        }),
        deleteLearningPath: builder.mutation({
            query: (id) => ({
                url: `/learning-paths/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["LearningPaths"],
        }),
        addCourseToPath: builder.mutation({
            query: ({ pathId, courseId, position }) => ({
                url: `/learning-paths/${pathId}/courses`,
                method: "POST",
                body: { course_id: courseId, position },
            }),
            invalidatesTags: ["LearningPaths"],
        }),
        removeCourseFromPath: builder.mutation({
            query: ({ pathId, courseId }) => ({
                url: `/learning-paths/${pathId}/courses/${courseId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["LearningPaths"],
        }),
        updateCoursePosition: builder.mutation({
            query: ({ pathId, courseId, position }) => ({
                url: `/learning-paths/${pathId}/courses/${courseId}/position`,
                method: "PUT",
                body: { position },
            }),
            invalidatesTags: ["LearningPaths"],
        }),
    }),
});

export const {
    useGetAllLearningPathsManagementQuery,
    useCreateLearningPathMutation,
    useUpdateLearningPathMutation,
    useDeleteLearningPathMutation,
    useAddCourseToPathMutation,
    useRemoveCourseFromPathMutation,
    useUpdateCoursePositionMutation,
} = learningPathsManagementApi;
