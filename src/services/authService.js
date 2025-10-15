import httpRequest from "@/utils/httpRequest";

export const getCurrentUser = async () => {
    const res = await httpRequest.get("/auth/me");
    return res;
};

export const logoutUser = async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    const token = localStorage.getItem("token");

    const res = await httpRequest.post("/auth/logout", {
        refresh_token,
        token,
    });
    return res;
};

export const getProfile = async (username) => {
    const res = await httpRequest.get(`/auth/${username}`);
    return res;
};

export const followUser = async (username) => {
    // API endpoint: POST /auth/:username/follow
    const res = await httpRequest.post(`/auth/${username}/follow`);
    return res;
};

export const unfollowUser = async (username) => {
    // API endpoint: DELETE /auth/:username/follow
    const res = await httpRequest.del(`/auth/${username}/follow`);
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

    return res.data?.exists;
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

export const forgotPassword = async (token, password) => {
    const res = await httpRequest.post(`/auth/forgot-password?token=${token}`, {
        password,
    });
    return res;
};

export const verifyEmail = async (token) => {
    const res = await httpRequest.post(`/auth/verify-email?token=${token}`);
    return res;
};

export const resendEmail = async (email, job) => {
    const res = await httpRequest.post(`/auth/resend-email`, { email, job });
    return res;
};

export const loginWithAuth0 = async (user) => {
    const res = await httpRequest.post("/auth/protected", user);
    return res;
};

export default {
    getCurrentUser,
    logoutUser,
    getProfile,
    updateCurrentUser,
    updateUserImg,
    checkEmail,
    checkPhone,
    checkUserName,
    register,
    login,
    verifyEmail,
    resendEmail,
    forgotPassword,
    loginWithAuth0,
    followUser,
    unfollowUser,
};
