import { createApi } from "@reduxjs/toolkit/query/react";

import baseQuery from "./baseQuery";

export const notesApi = createApi({
    reducerPath: "notesApi",
    baseQuery,
    tagTypes: ["Notes"],
    endpoints: (builder) => ({
        getAllNotes: builder.query({
            query: ({ courseId, lessonId, limit = 50, offset = 0 } = {}) => {
                const q = [];
                if (courseId) q.push(`courseId=${courseId}`);
                if (lessonId) q.push(`lessonId=${lessonId}`);
                q.push(`limit=${limit}`, `offset=${offset}`);
                const qs = q.length ? `?${q.join("&")}` : "";
                return `/notes${qs}`;
            },
            providesTags: (result) => {
                // `result` can be an array or a paginated object (e.g. { data: [...] }).
                const items = Array.isArray(result)
                    ? result
                    : result?.data || [];
                if (!items || items.length === 0)
                    return [{ type: "Notes", id: "LIST" }];
                return [
                    ...items.map((r) => ({ type: "Notes", id: r.id })),
                    { type: "Notes", id: "LIST" },
                ];
            },
        }),

        createNote: builder.mutation({
            query: (data) => ({
                url: `/notes`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Notes", id: "LIST" }],
        }),

        updateNote: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/notes/${id}`,
                method: "PUT",
                body: patch,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Notes", id: arg.id },
                { type: "Notes", id: "LIST" },
            ],
        }),

        deleteNote: builder.mutation({
            query: ({ id }) => ({
                url: `/notes/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Notes", id: arg.id },
                { type: "Notes", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetAllNotesQuery,
    useCreateNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation,
} = notesApi;
