// apps/frontend/src/config/axios.config.ts

import axios, { InternalAxiosRequestConfig } from 'axios';
import { BACKEND_BASE_URL } from './constants';

// Создаем единый экземпляр axios для всех авторизованных запросов
export const privateAxios = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Перехватчик запросов, который добавляет токен
privateAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('ppm-session');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Создаем отдельный экземпляр для публичных запросов (например, для самого логина)
export const publicAxios = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});