import { createApi } from "@reduxjs/toolkit/query/react";

import baseQuery from "./baseQuery";

const getNotesItems = (draft) => {
    if (Array.isArray(draft)) return draft;
    if (Array.isArray(draft?.data)) return draft.data;
    return [];
};

const getNotePayload = (response) => response?.data || response;

const noteMatchesQuery = (note, queryArg = {}) => {
    if (!note) return false;

    const courseId = queryArg?.courseId ? Number(queryArg.courseId) : null;
    const lessonId = queryArg?.lessonId ? Number(queryArg.lessonId) : null;
    const noteCourseId = note?.lesson?.track?.course?.id
        ? Number(note.lesson.track.course.id)
        : null;
    const noteLessonId = note?.lesson?.id
        ? Number(note.lesson.id)
        : Number(note.lesson_id);

    if (courseId && noteCourseId !== courseId) return false;
    if (lessonId && noteLessonId !== lessonId) return false;

    return true;
};

const forEachGetAllNotesCache = (state, callback) => {
    const queries = state?.[notesApi.reducerPath]?.queries || {};

    Object.values(queries).forEach((query) => {
        if (query?.endpointName !== "getAllNotes") return;
        callback(query.originalArgs);
    });
};

const upsertNoteInDraft = (draft, note, queryArg) => {
    if (!noteMatchesQuery(note, queryArg)) return;

    const items = getNotesItems(draft);
    const index = items.findIndex((item) => item.id === note.id);

    if (index >= 0) {
        items[index] = note;
    } else {
        items.unshift(note);
    }
};

const removeNoteFromDraft = (draft, noteId) => {
    const items = getNotesItems(draft);
    const index = items.findIndex((item) => item.id === noteId);

    if (index >= 0) {
        items.splice(index, 1);
    }
};

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
            async onQueryStarted(_, { dispatch, getState, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const createdNote = getNotePayload(data);

                    forEachGetAllNotesCache(getState(), (queryArg) => {
                        dispatch(
                            notesApi.util.updateQueryData(
                                "getAllNotes",
                                queryArg,
                                (draft) =>
                                    upsertNoteInDraft(
                                        draft,
                                        createdNote,
                                        queryArg
                                    )
                            )
                        );
                    });
                } catch {
                    // invalidatesTags below will handle failed optimistic paths.
                }
            },
            invalidatesTags: [{ type: "Notes", id: "LIST" }],
        }),

        updateNote: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/notes/${id}`,
                method: "PUT",
                body: patch,
            }),
            async onQueryStarted(_, { dispatch, getState, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const updatedNote = getNotePayload(data);

                    forEachGetAllNotesCache(getState(), (queryArg) => {
                        dispatch(
                            notesApi.util.updateQueryData(
                                "getAllNotes",
                                queryArg,
                                (draft) =>
                                    upsertNoteInDraft(
                                        draft,
                                        updatedNote,
                                        queryArg
                                    )
                            )
                        );
                    });
                } catch {
                    // invalidatesTags below will refetch after failed updates.
                }
            },
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
            async onQueryStarted({ id }, { dispatch, getState, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    forEachGetAllNotesCache(getState(), (queryArg) => {
                        dispatch(
                            notesApi.util.updateQueryData(
                                "getAllNotes",
                                queryArg,
                                (draft) => removeNoteFromDraft(draft, id)
                            )
                        );
                    });
                } catch {
                    // invalidatesTags below will refetch after failed deletes.
                }
            },
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
