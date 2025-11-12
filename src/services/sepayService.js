import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

/**
 * Sepay Payment RTK Query Service
 * Xử lý tất cả API calls liên quan đến thanh toán Sepay
 */
export const sepayService = createApi({
    reducerPath: "sepayApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        /**
         * Tạo QR code thanh toán
         * POST /sepay/create
         * Body: { courseId }
         * Returns: { qrCode, referenceCode, amount, expiresAt, status }
         */
        createSepayPayment: builder.mutation({
            query: (courseId) => ({
                url: "sepay/create",
                method: "POST",
                body: { courseId },
            }),
        }),

        /**
         * Kiểm tra trạng thái thanh toán từ Sepay
         * GET /sepay/status/:referenceCode
         * Params: referenceCode
         * Returns: { status, amount, transactionDate }
         */
        checkPaymentStatus: builder.query({
            query: (referenceCode) => ({
                url: `sepay/status/${referenceCode}`,
                method: "GET",
            }),
            // Poll every 5 seconds
            pollingInterval: 5000,
        }),

        /**
         * Lấy chi tiết thanh toán từ database
         * GET /sepay/payment/:paymentId
         * Params: paymentId
         * Returns: { id, courseId, amount, status, qrCode, referenceCode, expiresAt }
         */
        getPaymentDetail: builder.query({
            query: (paymentId) => ({
                url: `sepay/payment/${paymentId}`,
                method: "GET",
            }),
        }),

        /**
         * Kiểm tra thủ công trạng thái thanh toán từ Sepay
         * POST /sepay/manual-check/:paymentId
         * Sử dụng khi webhook không gọi hoặc user muốn kiểm tra lại
         */
        manualCheckPayment: builder.mutation({
            query: (paymentId) => ({
                url: `sepay/manual-check/${paymentId}`,
                method: "POST",
            }),
        }),

        /**
         * Huỷ bỏ thanh toán đang pending
         * POST /sepay/cancel/:paymentId
         * Returns: { success, message }
         */
        cancelPayment: builder.mutation({
            query: (paymentId) => ({
                url: `sepay/cancel/${paymentId}`,
                method: "POST",
            }),
        }),
    }),
});

export const {
    useCreateSepayPaymentMutation,
    useCheckPaymentStatusQuery,
    useLazyCheckPaymentStatusQuery,
    useGetPaymentDetailQuery,
    useLazyGetPaymentDetailQuery,
    useManualCheckPaymentMutation,
    useCancelPaymentMutation,
} = sepayService;
