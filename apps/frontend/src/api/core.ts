import { Option } from 'react-bootstrap-typeahead/types/types';

import { AxiosResponse } from 'axios';

import { privateAxios, publicAxios } from 'config/axios.config';
import { signedAPIs } from 'services/api/files';
import { store } from 'store/redux';

import { getReadableError } from 'utils/functions';

import { IPaginationData, ModelName } from 'interfaces/IGeneral';

declare type onEventType = (ev: ProgressEvent<EventTarget> | AxiosResponse) => void;
declare type onProgressType = (progress: string | number) => void;

export const getUploadSignedURL = async (file_name = '') => {
  return await store.dispatch(signedAPIs.endpoints.getUploadSignedURL.initiate({ file_name }));
};

export const getSignedURL = async (file_name = '') => {
  return await store.dispatch(signedAPIs.endpoints.getSignedURL.initiate({ file_name }));
};

export const uploadFile = async (
  file: File,
  url: string,
  onProgress: onProgressType,
  onSuccess: onEventType,
  onError?: onEventType
) => {
  await publicAxios
    .put(url, file, {
      headers: {
        'Content-Type': 'binary/octet-stream',
      },
      onUploadProgress: progressEvent => {
        const progress = Math.round((progressEvent.loaded / (progressEvent.total ?? 1)) * 100);
        onProgress(progress);
      },
    })
    .then(res => {
      if (res.status >= 200 && res.status <= 299) {
        onSuccess(res);
      } else {
        throw new Error(`Upload failed with status code: ${res.status}`);
      }
    })
    .catch(err => {
      if (onError) onError(err);
      else throw new Error(getReadableError(err, true));
    });
};

export const searchAPI = async (
  model_label: ModelName,
  query: string,
  page = 1,
  size = 10,
  filter?: { key: string; id: number | string }
): Promise<AxiosResponse<IPaginationData<Option>, unknown>> => {
  let path = `/api/core/model-choices/${model_label}/?search=${query}&page=${page}&size=${size}`;
  if (filter) {
    path += `&${filter.key}=${filter.id}`;
  }
  return await privateAxios.get(path);
};

export const searchWithoutPagination = async (
  model_label: ModelName,
  query: string,
  filter?: { key: string; id: number | string }
) => {
  let path = `/api/core/model-choices/${model_label}/?search=${query}`;
  if (filter) {
    path += `&${filter.key}=${filter.id}`;
  }
  return await privateAxios.get(path);
};
