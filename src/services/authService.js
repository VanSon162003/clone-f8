import httpRequest from "@/utils/httpRequest";

export const getCurrentUser = async () => {
    const res = await httpRequest.get("/auth/me");
    return res;
};

export default {
    getCurrentUser,
};
