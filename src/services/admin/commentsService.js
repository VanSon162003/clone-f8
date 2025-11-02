import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const commentsManagementApi = createApi({
    reducerPath: "commentsManagementApi",
    baseQuery,
    tagTypes: ["Comments"],
    endpoints: (builder) => ({
        getAllCommentsManagement: builder.query({
            query: ({ page = 1, limit = 10, search = "" }) => ({
                url: `/comments?page=${page}&limit=${limit}&search=${search}`,
                method: "GET",
            }),
            providesTags: ["Comments"],
        }),
        updateCommentVisibility: builder.mutation({
            query: ({ id, visible }) => ({
                url: `/comments/${id}/visibility`,
                method: "PATCH",
                body: { visible },
            }),
            invalidatesTags: ["Comments"],
        }),
    }),
});

export const {
    useGetAllCommentsManagementQuery,
    useUpdateCommentVisibilityMutation,
} = commentsManagementApi;
