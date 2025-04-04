import httpRequest from "@/utils/httpRequest";

export const getCurrentUser = async () => {
    const res = await httpRequest.get("/auth/me");
    return res;
};

export const updateCurrentUser = async (id, data) => {
    const res = await httpRequest.put(`/users/${id}`, data);
    return res;
};

export const updateUserImg = async (data) => {
    const res = await httpRequest.put(`/users/me`, data);
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

export const checkPhone = async (phone) => {
    const res = await httpRequest.get("/auth/check-phone", {
        params: {
            phone,
        },
    });

    return res.exists;
};

export const checkUserName = async (username) => {
    const res = await httpRequest.get("/auth/check-username", {
        params: {
            username,
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
    updateCurrentUser,
    updateUserImg,
    checkEmail,
    checkPhone,
    checkUserName,
    register,
    login,
};
