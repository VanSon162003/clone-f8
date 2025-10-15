import axios from "axios";

// Fallback base URL when VITE_BASE_URL is not defined (local dev)
const rawBase = import.meta.env.VITE_BASE_URL || "http://localhost:3001/api/v1";
const DEFAULT_BASE = rawBase.replace(/\/+$/, ""); // remove trailing slash

const httpRequest = axios.create({
    baseURL: DEFAULT_BASE,
    // headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    // },
});

let isRefreshing = false;
let tokenListeners = [];

httpRequest.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
});

httpRequest.interceptors.response.use(
    (response) => response,
    async (error) => {
        const refreshToken = localStorage.getItem("refresh_token");
        const shouldRenewToken = error.response?.status === 401 && refreshToken;

        if (shouldRenewToken) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const refreshUrl = `${DEFAULT_BASE}/auth/refresh-token`;
                    const res = await axios.post(refreshUrl, {
                        refresh_token: refreshToken,
                    });

                    const data = res.data.data;

                    localStorage.setItem("token", data.access_token);
                    localStorage.setItem("refresh_token", data.refresh_token);

                    tokenListeners.forEach((listener) => listener());
                    tokenListeners = [];

                    isRefreshing = false;

                    return httpRequest(error.config);
                } catch (error) {
                    console.log(error);

                    isRefreshing = false;
                    tokenListeners = [];

                    localStorage.removeItem("token");
                    localStorage.removeItem("refresh_token");
                }
            } else {
                return new Promise((resolve) => {
                    tokenListeners.push(() => {
                        resolve(httpRequest(error.config));
                    });
                });
            }
        }

        return Promise.reject(error);
    }
);

const send = async (method, url, data, config) => {
    try {
        const isPutOrPatch = ["put", "patch"].includes(method.toLowerCase());
        const effectiveMethod = isPutOrPatch ? "post" : method;
        const effectivePath = isPutOrPatch
            ? `${url}${url.includes("?") ? "&" : "?"}_method=${method}`
            : url;

        const res = await httpRequest.request({
            method: effectiveMethod,
            url: effectivePath,
            data,
            ...config,
        });

        return res.data;
    } catch (error) {
        throw error?.response?.data?.message || "An error occurred";
    }
};
export const get = async (url, config) => {
    return send("get", url, null, config);
};
export const post = async (url, data, config) => {
    return send("post", url, data, config);
};

export const put = async (url, data, config) => {
    return send("put", url, data, config);
};

export const patch = async (url, data, config) => {
    return send("patch", url, data, config);
};
export const del = async (url, config) => {
    return send("delete", url, null, config);
};

// export const setToken = (token) => {
//     localStorage.setItem("token", token);
//     httpRequest.defaults.headers["Authorization"] = `Bearer ${token}`;
// };

export default { get, post, put, patch, del };
