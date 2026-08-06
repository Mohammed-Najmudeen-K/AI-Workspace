import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8014",
});

api.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        config.headers = config.headers ?? {};
        delete config.headers["Content-Type"];
    } else {
        config.headers = {
            ...(config.headers ?? {}),
            "Content-Type": "application/json",
        } as typeof config.headers;
    }

    return config;
});

export default api;