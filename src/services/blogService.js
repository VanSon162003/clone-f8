import httpRequest from "@/utils/httpRequest";

export const getBlogs = async (page, perPage) => {
    const res = await httpRequest.get(
        `/products?page=${page}&per_page=${perPage}`
    );
    return res;
};

export default {
    getBlogs,
};
