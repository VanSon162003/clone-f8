import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const bookmarksApi = createApi({
    reducerPath: "bookmarksApi",
    baseQuery,
    tagTypes: ["Bookmark"],
    endpoints: (builder) => ({
        // Toggle bookmark for a post
        toggleBookmark: builder.mutation({
            query: (bookmarkData) => ({
                url: "/bookmarks/toggle",
                method: "POST",
                body: bookmarkData,
            }),
            invalidatesTags: (result, error, { postId }) => [
                { type: "Bookmark", id: `post-${postId}` }
            ],
        }),

        // Check if user bookmarked a post
        checkUserBookmark: builder.query({
            query: ({ postId }) => `/bookmarks/check?postId=${postId}`,
            providesTags: (result, error, { postId }) => [
                { type: "Bookmark", id: `post-${postId}` }
            ],
        }),

        // Get user's bookmarked posts
        getUserBookmarks: builder.query({
            query: ({ page = 1, limit = 10 } = {}) => {
                const params = new URLSearchParams();
                if (page) params.append("page", page);
                if (limit) params.append("limit", limit);
                
                return `/bookmarks/user?${params.toString()}`;
            },
            providesTags: ["Bookmark"],
        }),
    }),
});

export const {
    useToggleBookmarkMutation,
    useCheckUserBookmarkQuery,
    useGetUserBookmarksQuery,
} = bookmarksApi;
