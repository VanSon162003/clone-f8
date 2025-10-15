import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const likesApi = createApi({
    reducerPath: "likesApi",
    baseQuery,
    tagTypes: ["Like"],
    endpoints: (builder) => ({
        // Toggle like for a post
        toggleLike: builder.mutation({
            query: (likeData) => ({
                url: "/likes/toggle",
                method: "POST",
                body: likeData,
            }),
            invalidatesTags: (result, error, { likeableType, likeableId }) => [
                { type: "Like", id: `${likeableType}-${likeableId}` }
            ],
        }),

        // Check if user liked a post
        checkUserLike: builder.query({
            query: ({ likeableType, likeableId }) => 
                `/likes/check?likeableType=${likeableType}&likeableId=${likeableId}`,
            providesTags: (result, error, { likeableType, likeableId }) => [
                { type: "Like", id: `${likeableType}-${likeableId}` }
            ],
        }),

        // Get like count for a post
        getLikeCount: builder.query({
            query: ({ likeableType, likeableId }) => 
                `/likes/count?likeableType=${likeableType}&likeableId=${likeableId}`,
            providesTags: (result, error, { likeableType, likeableId }) => [
                { type: "Like", id: `${likeableType}-${likeableId}` }
            ],
        }),
    }),
});

export const {
    useToggleLikeMutation,
    useCheckUserLikeQuery,
    useGetLikeCountQuery,
} = likesApi;
