import { privateAxios } from 'config/axios.config';

export const exportInventory = async () => {
  return await privateAxios.get(`/api/maintenance/inventory/`);
};

export const exportFixedAssets = async () => {
  return await privateAxios.get(`/api/maintenance/fixed-assets/`);
};

export const downloadTemplateFile = async (fileName: string) => {
  return (await fetch(`/template/${fileName}`)).blob();
};
