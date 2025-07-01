import { privateAxios, publicAxios } from 'config/axios.config';

export const refreshToken = async () => {
  return await publicAxios.post('/api/token/refresh/', {
    refresh: localStorage.getItem('ppm-session-ref'),
  });
};

export const createToken = async (email: string, password: string) => {
  return await publicAxios.post('/api/token/', { email, password });
};

export const verifyToken = async (token: string) => {
  return await privateAxios.post('/api/token/verify/', { token });
};
