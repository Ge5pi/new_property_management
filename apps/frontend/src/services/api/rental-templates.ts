import { parseURLParams } from 'utils/functions';

import { IRentalTemplate } from 'interfaces/IApplications';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from './base';

const rentalTemplatesAPI = api.injectEndpoints({
  endpoints: build => ({
    getRentalTemplates: build.query<IPaginationData<IRentalTemplate>, IFilterOptions>({
      query: params => ({
        url: `/api/lease/rental-application-template/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'RentalTemplates' as const, id })),
              { type: 'RentalTemplates', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'RentalTemplates', id: 'PARTIAL-LIST' }],
    }),
    getRentalTemplateById: build.query<IRentalTemplate, number>({
      query: id => ({
        url: `/api/lease/rental-application-template/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'RentalTemplates', id }],
    }),
    createRentalTemplate: build.mutation<IRentalTemplate, IRentalTemplate>({
      query: data => ({
        url: `/api/lease/rental-application-template/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'RentalTemplates', id: 'PARTIAL-LIST' }],
    }),
    updateRentalTemplate: build.mutation<IRentalTemplate, Partial<IRentalTemplate>>({
      query: data => ({
        url: `/api/lease/rental-application-template/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RentalTemplates', id },
        { type: 'RentalTemplates', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteRentalTemplate: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/lease/rental-application-template/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'RentalTemplates', id },
        { type: 'RentalTemplates', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetRentalTemplatesQuery,
  useGetRentalTemplateByIdQuery,
  useUpdateRentalTemplateMutation,
  useCreateRentalTemplateMutation,
  useDeleteRentalTemplateMutation,
} = rentalTemplatesAPI;
