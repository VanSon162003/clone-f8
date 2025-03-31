import httpRequest from "@/utils/httpRequest";

export const getCurrentUser = async () => {
    const res = await httpRequest.get("/auth/me");
    return res;
};

export const checkEmail = async (email) => {
    const res = await httpRequest.get("/auth/check-email", {
        params: {
            email,
        },
    });

    return res.exists;
};

export const register = async (data) => {
    const res = await httpRequest.post("/auth/register", data);

    return res;
};

export const login = async (data) => {
    const res = await httpRequest.post("/auth/login", data);

    return res;
};

export default {
    getCurrentUser,
    checkEmail,
    register,
    login,
};
