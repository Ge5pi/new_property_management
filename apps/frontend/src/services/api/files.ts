import { api } from './base';

export const signedAPIs = api.injectEndpoints({
  endpoints: build => ({
    getSignedURL: build.query<{ url: string }, { file_name: string }>({
      query: data => ({
        url: `/api/core/get-signed-url/`,
        method: 'post',
        data,
      }),
      providesTags: (result, error, { file_name }) => [{ type: 'SignedURLs', file_name }],
      keepUnusedDataFor: 3600,
    }),
    getUploadSignedURL: build.mutation<{ url: string }, { file_name: string }>({
      query: data => ({
        url: `/api/core/upload-signed-url/`,
        method: 'post',
        data,
      }),
      invalidatesTags: (result, error, { file_name }) => [{ type: 'SignedURLs', file_name }],
    }),
  }),
});
