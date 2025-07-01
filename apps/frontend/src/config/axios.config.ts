import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { refreshToken } from 'api/auth';

import { BACKEND_BASE_URL } from './constants';

declare type CallbackType = (access_token: string | null) => void;

let isAlreadyFetchingAccessToken = false;
let subscribers: Array<CallbackType> = [];

export const publicAxios = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const privateAxios = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

privateAxios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error: AxiosError) {
    const access_token = localStorage.getItem('ppm-session');
    if (error?.response?.status === 401 && access_token) {
      return ResetTokenAndReattemptRequest(error);
    } else {
      return Promise.reject(error);
    }
  }
);

privateAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('ppm-session');
  if (token && config.headers) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  return config;
});

export async function ResetTokenAndReattemptRequest(error: AxiosError) {
  try {
    const { response } = error;
    const retryOriginalRequest = new Promise(resolve => {
      addSubscriber((access_token: string | null) => {
        if (response && response.config.headers) {
          response.config.headers.Authorization = 'Bearer ' + access_token;
          resolve(axios(response.config));
        }
      });
    });

    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true;

      try {
        const rs = await refreshToken();
        const { access, refresh } = rs.data;

        localStorage.setItem('ppm-session', access);
        if (refresh) localStorage.setItem('ppm-session-ref', refresh);

        isAlreadyFetchingAccessToken = false;
        onAccessTokenFetched(localStorage.getItem('ppm-session'));
      } catch (_error) {
        return Promise.reject(_error);
      }
    }

    return retryOriginalRequest;
  } catch (err) {
    return Promise.reject(err);
  }
}

function onAccessTokenFetched(access_token: string | null) {
  subscribers.forEach(callback => callback(access_token));
  subscribers = [];
}

function addSubscriber(callback: CallbackType) {
  subscribers.push(callback);
}
