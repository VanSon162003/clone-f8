import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const examsApi = createApi({
    reducerPath: "examsApi",
    baseQuery,
    tagTypes: ["ExamDetails", "ExamSubmission"],
    endpoints: (builder) => ({
        getExamDetails: builder.query({
            query: ({ courseId }) => `/exams/course/${courseId}`,
            providesTags: ["ExamDetails"],
        }),
        startExam: builder.mutation({
            query: ({ examId }) => ({
                url: `/exams/${examId}/start`,
                method: "POST",
            }),
            invalidatesTags: ["ExamSubmission", "ExamDetails"],
        }),
        submitExam: builder.mutation({
            query: ({ submissionId, answers, tab_switch_count, cheat_logs, is_cheating }) => ({
                url: `/exams/submissions/${submissionId}/submit`,
                method: "POST",
                body: { answers, tab_switch_count, cheat_logs, is_cheating },
            }),
            invalidatesTags: ["ExamSubmission", "ExamDetails"],
        }),
        getExamResult: builder.query({
            query: ({ submissionId }) => `/exams/submissions/${submissionId}/result`,
            providesTags: ["ExamSubmission"],
        }),
    }),
});

export const {
    useGetExamDetailsQuery,
    useStartExamMutation,
    useSubmitExamMutation,
    useGetExamResultQuery,
} = examsApi;
