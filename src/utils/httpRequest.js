import axios from "axios";

const httpRequest = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

const send = async (method, url, data, config) => {
    try {
        const res = await httpRequest.request({
            method,
            url,
            data,
            config,
        });

        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const get = async (url, config) => {
    return send("get", url, null, config);
};
export const post = async (url, data, config) => {
    return send("post", url, data, config);
};

export const put = async (url, data, config) => {
    return send("get", url, data, config);
};

export const patch = async (url, data, config) => {
    return send("get", url, data, config);
};
export const del = async (url, config) => {
    return send("delete", url, null, config);
};

export const setToken = (token) => {
    localStorage.setItem("token", token);
    httpRequest.defaults.headers["Authorization"] = `Bearer ${token}`;
};

export default { get, post, put, patch, del, setToken };
