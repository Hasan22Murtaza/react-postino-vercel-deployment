import axios from 'axios';

export const sendGetRequest = (url, params = {}, headers = {}) => {
  return axios.get(url, { headers, params });
};

export const sendPostRequest = (url, data, headers = {}) => {
  return axios.post(url, data, { headers });
};

export const sendUpdateRequest = (url, data, headers = {}) => {
  return axios.put(url, data, { headers });
};

export const sendDeleteRequest = (url, headers = {}) => {
  return axios.delete(url, { headers });
};
