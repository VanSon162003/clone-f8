import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const systemSettingsApi = createApi({
    reducerPath: "systemSettingsApi",
    baseQuery,
    tagTypes: ["Settings"],
    endpoints: (builder) => ({
        getSettings: builder.query({
            query: () => ({
                url: "/settings",
                method: "GET",
            }),
            providesTags: ["Settings"],
        }),
        updateSettings: builder.mutation({
            query: (formData) => ({
                url: "/settings",
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["Settings"],
        }),
    }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } =
    systemSettingsApi;
