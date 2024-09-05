import axios from "axios";
const baseURL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Accept': 'application/json',
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["postinojwt"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export const api = {
  get(url, params = {}) {
    return axiosInstance.get(url, { params })
      .then(response => response)
      .catch(handleError);
  },
  post(url, data, config = {}) {
    return axiosInstance.post(url, data, config)
      .then(response => response)
      .catch(handleError);
  },
  put(url, data, config = {}) {
    return axiosInstance.put(url, data, config)
      .then(response => response)
      .catch(handleError);
  },
  delete(url, config = {}) {
    return axiosInstance.delete(url, config)
      .then(response => response)
      .catch(handleError);
  },
  uploadFile(url, data, config = {}) {
    return axiosInstance.post(url, data, {
      ...config,
      onUploadProgress: config.onUploadProgress,
    })
    .then(response => response)
    .catch(handleError);
  },
};

function handleError(error) {
  console.error('API Error:', error);
  if (error.response && error.response) {
    return Promise.reject(error.response);
  }
  return Promise.reject(error.message || 'An unknown error occurred');
}
