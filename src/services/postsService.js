import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const postsApi = createApi({
    reducerPath: "postsApi",
    baseQuery,
    tagTypes: ["Post"],
    endpoints: (builder) => ({
        // Get all posts with pagination and filters
        getAllPosts: builder.query({
            query: ({
                page = 1,
                limit = 10,
                status = "published",
                search = "",
            } = {}) => {
                const params = new URLSearchParams();
                if (page) params.append("page", page);
                if (limit) params.append("limit", limit);
                if (status) params.append("status", status);
                if (search) params.append("search", search);

                return `/posts?${params.toString()}`;
            },
            providesTags: ["Post"],
        }),

        getPostsMe: builder.query({
            query: ({ page = 1, limit = 10 } = {}) => {
                const params = new URLSearchParams();
                if (page) params.append("page", page);
                if (limit) params.append("limit", limit);

                return `/posts/me?${params.toString()}`;
            },
        }),

        // Get popular posts (for home page)
        getPopularPosts: builder.query({
            query: ({ limit = 8 } = {}) => {
                const params = new URLSearchParams();
                params.append("page", 1);
                params.append("limit", limit);
                params.append("status", "published");

                return `/posts/popular?${params.toString()}`;
            },
            providesTags: ["Post"],
        }),

        // Get post by ID
        getPostById: builder.query({
            query: (id) => `/posts/${id}`,
            providesTags: (result, error, id) => [{ type: "Post", id }],
        }),

        // Get post by slug
        getPostBySlug: builder.query({
            query: (slug) => `/posts/slug/${slug}`,
            providesTags: (result, error, slug) => [{ type: "Post", slug }],
        }),

        // Get posts by tag
        getPostsByTag: builder.query({
            query: ({ tagName, page = 1, limit = 10 } = {}) => {
                const params = new URLSearchParams();
                if (page) params.append("page", page);
                if (limit) params.append("limit", limit);

                return `/posts/tag/${tagName}?${params.toString()}`;
            },
            providesTags: ["Post"],
        }),

        // Create post
        createPost: builder.mutation({
            query: (postData) => {
                // Nếu có file, gửi bằng FormData
                if (postData instanceof FormData) {
                    return {
                        url: "/posts",
                        method: "POST",
                        body: postData,
                        formData: true,
                    };
                }
                return {
                    url: "/posts",
                    method: "POST",
                    body: postData,
                };
            },
            invalidatesTags: ["Post"],
        }),

        // Update post
        updatePost: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/posts/${id}`,
                method: "PUT",
                body: formData,
                formData: true,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
        }),

        // Delete post
        deletePost: builder.mutation({
            query: (id) => ({
                url: `/posts/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Post", id }],
        }),
    }),
});

export const {
    useGetAllPostsQuery,
    useGetPostsMeQuery,
    useGetPopularPostsQuery,
    useGetPostByIdQuery,
    useGetPostBySlugQuery,
    useGetPostsByTagQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
} = postsApi;
