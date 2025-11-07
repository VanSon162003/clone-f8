import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery,
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => ({
                url: "/dashboard",
                method: "GET",
            }),
        }),
    }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
