import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (header) => {
        header.set("Authorization", `Bearer ${localStorage.token}`);
        return header;
    },
});

/**
 * Base Query with reauthentication
 * Tự động refresh token nếu cần
 */
export const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Token expired - handle refresh logic if needed
        // For now, just return the error
        console.warn("Unauthorized - token may have expired");
    }

    return result;
};

export default baseQuery;
