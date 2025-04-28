import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (header) => {
        header.set("Authorization", `Bearer ${localStorage.token}`);
        return header;
    },
});

export default baseQuery;
