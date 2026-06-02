import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const examsManagementApi = createApi({
    reducerPath: "examsManagementApi",
    baseQuery,
    tagTypes: ["AdminExams", "AdminSubmissions", "AdminSubmissionDetail"],
    endpoints: (builder) => ({
        getExamByCourse: builder.query({
            query: (courseId) => `/exams/course/${courseId}`,
            providesTags: ["AdminExams"],
        }),
        upsertExam: builder.mutation({
            query: (body) => ({
                url: "/exams/upsert",
                method: "POST",
                body,
            }),
            invalidatesTags: ["AdminExams"],
        }),
        saveQuestions: builder.mutation({
            query: ({ examId, questions }) => ({
                url: `/exams/${examId}/questions`,
                method: "POST",
                body: { questions },
            }),
            invalidatesTags: ["AdminExams"],
        }),
        aiGenerateQuestions: builder.mutation({
            query: (body) => ({
                url: "/exams/ai-generate",
                method: "POST",
                body,
            }),
        }),
        getSubmissions: builder.query({
            query: ({ examId, page = 1, limit = 10, status }) => {
                let url = `/exams/${examId}/submissions?page=${page}&limit=${limit}`;
                if (status) url += `&status=${status}`;
                return url;
            },
            providesTags: ["AdminSubmissions"],
        }),
        getSubmissionDetail: builder.query({
            query: (submissionId) => `/exams/submissions/${submissionId}`,
            providesTags: ["AdminSubmissionDetail"],
        }),
        gradeEssaySubmission: builder.mutation({
            query: ({ submissionId, grades }) => ({
                url: `/exams/submissions/${submissionId}/grade`,
                method: "POST",
                body: { grades },
            }),
            invalidatesTags: ["AdminSubmissions", "AdminSubmissionDetail"],
        }),
    }),
});

export const {
    useGetExamByCourseQuery,
    useUpsertExamMutation,
    useSaveQuestionsMutation,
    useAiGenerateQuestionsMutation,
    useGetSubmissionsQuery,
    useGetSubmissionDetailQuery,
    useGradeEssaySubmissionMutation,
} = examsManagementApi;
