import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const postsManagementApi = createApi({
    reducerPath: "postsManagementApi",
    baseQuery,
    tagTypes: ["Posts"],
    endpoints: (builder) => ({
        getAllPostsManagement: builder.query({
            query: ({ page = 1, limit = 10, search = "" }) => ({
                url: `/posts?page=${page}&limit=${limit}&search=${search}`,
                method: "GET",
            }),
            providesTags: ["Posts"],
        }),
        approveAllPosts: builder.mutation({
            query: () => ({
                url: `/posts/approve-all`,
                method: "POST",
            }),
            invalidatesTags: ["Posts"],
        }),
        approvePost: builder.mutation({
            query: ({ id, is_approved }) => ({
                url: `/posts/${id}/approve`,
                method: "PATCH",
                body: { is_approved },
            }),
            invalidatesTags: ["Posts"],
        }),
        deletePost: builder.mutation({
            query: (id) => ({
                url: `/posts/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Posts"],
        }),
    }),
});

export const {
    useGetAllPostsManagementQuery,
    useApprovePostMutation,
    useDeletePostMutation,
    useApproveAllPostsMutation,
} = postsManagementApi;
