import { createApi } from "@reduxjs/toolkit/query/react";

import baseQuery from "./baseQuery";

export const usersManagementApi = createApi({
    reducerPath: "usersManagementApi",
    baseQuery,
    endpoints: (builder) => ({
        getAllUsersManagement: builder.query({
            query: ({ limit = 10, offset = 0, search = "" }) => {
                const queryParams = new URLSearchParams({
                    limit: limit.toString(),
                    offset: offset.toString(),
                    ...(search && { search }),
                }).toString();
                return `users?${queryParams}`;
            },
        }),
        updateUserRole: builder.mutation({
            query: ({ userId, role }) => ({
                url: `users/${userId}`,
                method: "PATCH",
                body: { role },
            }),
            invalidatesTags: ["Users"],
        }),
        updateUserStatus: builder.mutation({
            query: ({ userId, status }) => ({
                url: `users/${userId}`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Users"],
        }),
    }),
});

export const {
    useGetAllUsersManagementQuery,
    useUpdateUserRoleMutation,
    useUpdateUserStatusMutation,
} = usersManagementApi;
