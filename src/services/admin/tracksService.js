import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const tracksManagementApi = createApi({
    reducerPath: "tracksManagementApi",
    baseQuery,
    tagTypes: ["Tracks"],
    endpoints: (builder) => ({
        getAllTracksManagement: builder.query({
            query: ({ page = 1, limit = 10, search = "" }) => {
                const queryParams = new URLSearchParams({
                    page,
                    limit,
                    ...(search && { search }),
                }).toString();
                return `/tracks?${queryParams}`;
            },
            providesTags: ["Tracks"],
        }),

        createTrack: builder.mutation({
            query: (formData) => ({
                url: "/tracks",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Tracks"],
        }),

        updateTrack: builder.mutation({
            query: (data) => ({
                url: `/tracks/${data.id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Tracks"],
        }),

        deleteTrack: builder.mutation({
            query: (id) => ({
                url: `/tracks/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Tracks"],
        }),

        updateTrackStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/tracks/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Tracks"],
        }),

        updateTrackPositions: builder.mutation({
            query: (data) => ({
                url: `/tracks/positions`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Tracks"],
        }),
    }),
});

export const {
    useGetAllTracksManagementQuery,
    useCreateTrackMutation,
    useUpdateTrackMutation,
    useDeleteTrackMutation,
    useUpdateTrackStatusMutation,
    useUpdateTrackPositionsMutation,
} = tracksManagementApi;
