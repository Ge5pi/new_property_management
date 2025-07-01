import { parseURLParams } from 'utils/functions';

import { IEmailSingleTemplate, IEmailTemplateAPI } from 'interfaces/ICommunication';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from './base';

const emailTemplatesAPI = api.injectEndpoints({
  endpoints: build => ({
    getEmailTemplates: build.query<IPaginationData<IEmailSingleTemplate>, IFilterOptions>({
      query: params => ({
        url: `/api/communication/email-template/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'EmailTemplates' as const, id })),
              { type: 'EmailTemplates', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'EmailTemplates', id: 'PARTIAL-LIST' }],
    }),
    getEmailTemplateById: build.query<IEmailSingleTemplate, number>({
      query: id => ({
        url: `/api/communication/email-template/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'EmailTemplates', id }],
    }),
    createEmailTemplate: build.mutation<IEmailSingleTemplate, IEmailTemplateAPI>({
      query: data => ({
        url: `/api/communication/email-template/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'EmailTemplates', id: 'PARTIAL-LIST' }],
    }),
    updateEmailTemplate: build.mutation<IEmailSingleTemplate, Partial<IEmailTemplateAPI>>({
      query: data => ({
        url: `/api/communication/email-template/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'EmailTemplates', id },
        { type: 'EmailTemplates', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteEmailTemplate: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/communication/email-template/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'EmailTemplates', id },
        { type: 'EmailTemplates', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetEmailTemplatesQuery,
  useGetEmailTemplateByIdQuery,
  useUpdateEmailTemplateMutation,
  useCreateEmailTemplateMutation,
  useDeleteEmailTemplateMutation,
} = emailTemplatesAPI;
