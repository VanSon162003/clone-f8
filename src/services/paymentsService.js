import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const paymentsService = createApi({
    reducerPath: "paymentsApi",
    baseQuery,
    endpoints: (builder) => ({
        createPaymentSession: builder.mutation({
            query: (courseId) => ({
                url: `payments/${courseId}`,
                method: "POST",
            }),
        }),
        verifyPayment: builder.mutation({
            query: (sessionId) => ({
                url: `payments/verify/${sessionId}`,
                method: "POST",
            }),
        }),
    }),
});

export const { useCreatePaymentSessionMutation, useVerifyPaymentMutation } =
    paymentsService;
