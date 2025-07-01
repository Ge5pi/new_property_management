import { parseURLParams } from 'utils/functions';

import { ISingleLeaseTemplate } from 'interfaces/IApplications';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from './base';

const leaseTemplatesAPI = api.injectEndpoints({
  endpoints: build => ({
    getLeaseTemplates: build.query<IPaginationData<ISingleLeaseTemplate>, IFilterOptions>({
      query: params => ({
        url: `/api/lease/lease-template/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'LeaseTemplates' as const, id })),
              { type: 'LeaseTemplates', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'LeaseTemplates', id: 'PARTIAL-LIST' }],
    }),
    getLeaseTemplateById: build.query<ISingleLeaseTemplate, number>({
      query: id => ({
        url: `/api/lease/lease-template/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'LeaseTemplates', id }],
    }),
    createLeaseTemplate: build.mutation<ISingleLeaseTemplate, ISingleLeaseTemplate>({
      query: data => ({
        url: `/api/lease/lease-template/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'LeaseTemplates', id: 'PARTIAL-LIST' }],
    }),
    updateLeaseTemplate: build.mutation<ISingleLeaseTemplate, Partial<ISingleLeaseTemplate>>({
      query: data => ({
        url: `/api/lease/lease-template/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'LeaseTemplates', id },
        { type: 'LeaseTemplates', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteLeaseTemplate: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/lease/lease-template/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'LeaseTemplates', id },
        { type: 'LeaseTemplates', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetLeaseTemplatesQuery,
  useGetLeaseTemplateByIdQuery,
  useUpdateLeaseTemplateMutation,
  useCreateLeaseTemplateMutation,
  useDeleteLeaseTemplateMutation,
} = leaseTemplatesAPI;
