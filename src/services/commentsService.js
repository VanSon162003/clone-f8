import { createApi } from "@reduxjs/toolkit/query/react";

import baseQuery from "./baseQuery";

export const commentsApi = createApi({
    reducerPath: "commentsApi",
    baseQuery,
    endpoints: (builder) => ({
        getAllByType: builder.query({
            query: ({ type, id, limit = 10, offset = 0 }) => {
                return `/comments/${type}/${id}?limit=${limit}&offset=${offset}`;
            },
        }),

        createComment: builder.mutation({
            query: (data) => ({
                url: `/comments`,
                method: "POST",
                body: data,
            }),
        }),

        editComment: builder.mutation({
            query: ({ id, content }) => ({
                url: `/comments/${id}`,
                method: "PUT",
                body: { content },
            }),
        }),

        deleteComment: builder.mutation({
            query: ({ id }) => ({
                url: `/comments/${id}`,
                method: "DELETE",
            }),
        }),

        handleReactionComment: builder.mutation({
            query: ({ commentId, reaction }) => {
                console.log(reaction);
                return {
                    url: `/comments/${commentId}/reaction`,
                    method: "POST",
                    body: { reaction },
                };
            },
        }),
    }),
});

export const {
    useGetAllByTypeQuery,
    useCreateCommentMutation,
    useEditCommentMutation,
    useDeleteCommentMutation,
    useHandleReactionCommentMutation,
} = commentsApi;
