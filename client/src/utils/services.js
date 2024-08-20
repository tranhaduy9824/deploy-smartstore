import axios from 'axios';

export const postRequest = async (url, body, token = null, formData = false) => {
    const config = {
        headers: {
            'Content-Type': formData ? 'multipart/form-data' : 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
        },
    };

    const response = await axios.post(url, formData ? body : JSON.stringify(body), config);

    const data = await response.data;

    return data;
};

export const getRequest = async (url, query = {}, token = null) => {
    const config = {
        headers: {},
        params: query,
    };

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get(url, config);

    const data = await response.data;

    return data;
};

export const deleteRequest = async (url, body, token = null) => {
    const config = {
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
        },
        data: body,
    };

    const response = await axios.delete(url, config);

    const data = await response.data;

    return data;
};

export const patchRequest = async (url, body, token = null, formData = false) => {
    const config = {
        headers: {
            'Content-Type': formData ? 'multipart/form-data' : 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
        },
    };

    const response = await axios.patch(url, formData ? body : JSON.stringify(body), config);

    const data = await response.data;

    return data;
};
