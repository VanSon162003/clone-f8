import httpRequest from "@/utils/httpRequest";

export const logoutUser = async () => {
    const res = await httpRequest.post("/auth/logout");
    return res;
};

export default {
    logoutUser,
};
