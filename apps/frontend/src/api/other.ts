import { privateAxios } from 'config/axios.config';

export const getUnitDetails = async (id: number) => {
  return await privateAxios.get(`/api/property/units/${id}/`);
};
