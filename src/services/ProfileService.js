import { createApi } from "@reduxjs/toolkit/query/react";

import baseQuery from "./baseQuery";

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery,
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: (username) => `/users/${username}`,
        }),
        // checkEmail: builder.query({
        //     query: (email) => ({
        //         url: "/auth/check-email",
        //         params: {
        //             email,
        //         },
        //     }),
        // }),

        // checkPhone: builder.query({
        //     query: (phone) => ({
        //         url: "/auth/check-phone",
        //         params: {
        //             phone,
        //         },
        //     }),
        // }),

        // checkUserName: builder.query({
        //     query: (username) => ({
        //         url: "/auth/check-username",
        //         params: {
        //             username,
        //         },
        //     }),
        // }),

        // build.mutation
        updateCurrentUser: builder.mutation({
            query: (data) => ({
                url: `/users/me`,
                method: "PUT",
                body: data,
            }),
        }),
    }),
});

export const {
    useGetProfileQuery,
    // useCheckEmailQuery,
    // useCheckPhoneQuery,
    // useCheckUserNameQuery,
    useUpdateCurrentUserMutation,
} = profileApi;
