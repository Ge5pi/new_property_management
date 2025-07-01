import { parseURLParams } from 'utils/functions';

import { IEmailSignature } from 'interfaces/ICommunication';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from './base';

const emailSignatureAPI = api.injectEndpoints({
  endpoints: build => ({
    getEmailSignatures: build.query<IPaginationData<IEmailSignature>, IFilterOptions>({
      query: params => ({
        url: `/api/communication/email-signature/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'EmailSignatures' as const, id })),
              { type: 'EmailSignatures', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'EmailSignatures', id: 'PARTIAL-LIST' }],
    }),
    getMyEmailSignaturesList: build.query<IEmailSignature[], void>({
      query: () => ({
        url: `/api/communication/my-email-signature/`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'EmailSignatures' as const, id })),
              { type: 'EmailSignatures', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'EmailSignatures', id: 'PARTIAL-LIST' }],
    }),
    getEmailSignatureById: build.query<IEmailSignature, number>({
      query: id => ({
        url: `/api/communication/email-signature/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'EmailSignatures', id }],
    }),
    createEmailSignature: build.mutation<IEmailSignature, IEmailSignature>({
      query: data => ({
        url: `/api/communication/email-signature/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'EmailSignatures', id: 'PARTIAL-LIST' }],
    }),
    updateEmailSignature: build.mutation<IEmailSignature, Partial<IEmailSignature>>({
      query: data => ({
        url: `/api/communication/email-signature/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'EmailSignatures', id },
        { type: 'EmailSignatures', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteEmailSignature: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/communication/email-signature/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'EmailSignatures', id },
        { type: 'EmailSignatures', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetEmailSignaturesQuery,
  useGetMyEmailSignaturesListQuery,

  useGetEmailSignatureByIdQuery,
  useUpdateEmailSignatureMutation,
  useCreateEmailSignatureMutation,
  useDeleteEmailSignatureMutation,
} = emailSignatureAPI;
