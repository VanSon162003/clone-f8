import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";
export const slideshowApi = createApi({
    reducerPath: "slideshowApi",
    baseQuery,
    tagTypes: ["Slides"],
    endpoints: (builder) => ({
        getSlides: builder.query({
            query: () => ({
                url: "/slides",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Slides"],
        }),

        createSlide: builder.mutation({
            query: (formData) => ({
                url: "/slides",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Slides"],
        }),

        updateSlide: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/slides/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ["Slides"],
        }),

        deleteSlide: builder.mutation({
            query: (id) => ({
                url: `/slides/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Slides"],
        }),

        updateSlideOrder: builder.mutation({
            query: (slides) => ({
                url: "/slides/order",
                method: "PATCH",
                body: { slides },
            }),
            invalidatesTags: ["Slides"],
        }),
    }),
});

export const {
    useGetSlidesQuery,
    useCreateSlideMutation,
    useUpdateSlideMutation,
    useDeleteSlideMutation,
    useUpdateSlideOrderMutation,
} = slideshowApi;
