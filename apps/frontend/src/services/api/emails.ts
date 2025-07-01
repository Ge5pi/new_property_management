import { parseURLParams } from 'utils/functions';

import { IEmailTemplateAPI, IEmails } from 'interfaces/ICommunication';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from './base';

interface IEmailFilterValues extends IFilterOptions {
  vendors?: number | string;
}

const emailsAPI = api.injectEndpoints({
  endpoints: build => ({
    getEmail: build.query<IPaginationData<IEmails>, IEmailFilterValues>({
      query: params => ({
        url: `/api/communication/email/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<IEmails>) => {
        response.results = response.results.map(result => ({
          ...result,
          from: result.created_by
            ? result.created_by.first_name && result.created_by.last_name
              ? `${result.created_by.first_name} ${result.created_by.last_name}`
              : result.created_by.username
            : '-',
        }));
        return response;
      },
      transformErrorResponse: baseQueryReturnValue => {
        return baseQueryReturnValue;
      },
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'Emails' as const, id })),
              { type: 'Emails', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Emails', id: 'PARTIAL-LIST' }],
    }),
    getEmailById: build.query<IEmails, number>({
      query: id => ({
        url: `/api/communication/email/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'Emails', id }],
    }),
    createEmail: build.mutation<IEmails, IEmails>({
      query: data => ({
        url: `/api/communication/email/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'Emails', id: 'PARTIAL-LIST' }],
    }),
    updateEmail: build.mutation<IEmails, Partial<IEmailTemplateAPI>>({
      query: data => ({
        url: `/api/communication/email/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Emails', id },
        { type: 'Emails', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteEmail: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/communication/email/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Emails', id },
        { type: 'Emails', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetEmailQuery,
  useGetEmailByIdQuery,
  useUpdateEmailMutation,
  useCreateEmailMutation,
  useDeleteEmailMutation,
} = emailsAPI;
