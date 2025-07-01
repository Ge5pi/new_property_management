import { parseURLParams } from 'utils/functions';

import { IPaginationData } from 'interfaces/IGeneral';
import {
  IListServiceRequest,
  IServiceRequestAPI,
  IServiceRequestFilter,
  ISingleServiceRequest,
} from 'interfaces/IServiceRequests';

import { api } from '../base';

const serviceRequestAPIs = api.injectEndpoints({
  endpoints: build => ({
    getTenantServiceRequests: build.query<IPaginationData<IListServiceRequest>, IServiceRequestFilter>({
      query: params => ({
        url: `/api/tenant/service-requests/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<IListServiceRequest>) => {
        response.results = response.results.map(result => ({
          ...result,
          property_and_unit: {
            title: result.property_name,
            image: result.unit_cover_picture ? result.unit_cover_picture.image : null,
            subtitle: result.unit_name,
          },
          status_with_obj: {
            displayValue: result.status?.toLowerCase().replaceAll('_', ' '),
            status: result.status,
            className: {
              PENDING: 'text-muted',
              COMPLETED: 'text-success',
            },
          },
        }));
        return response;
      },
      transformErrorResponse: baseQueryReturnValue => {
        return baseQueryReturnValue;
      },
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'TenantServiceRequests' as const, id })),
              { type: 'TenantServiceRequests', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'TenantServiceRequests', id: 'PARTIAL-LIST' }],
    }),
    getTenantServiceRequestsById: build.query<ISingleServiceRequest, number>({
      query: id => ({
        url: `/api/tenant/service-requests/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'TenantServiceRequests', id }],
    }),
    createTenantServiceRequests: build.mutation<IServiceRequestAPI, IServiceRequestAPI>({
      query: data => ({
        url: `/api/tenant/service-requests/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'TenantServiceRequests', id: 'PARTIAL-LIST' }],
    }),
    updateTenantServiceRequests: build.mutation<IServiceRequestAPI, Partial<IServiceRequestAPI>>({
      query: data => ({
        url: `/api/tenant/service-requests/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'TenantServiceRequests', id },
        { type: 'TenantServiceRequests', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetTenantServiceRequestsByIdQuery,
  useGetTenantServiceRequestsQuery,

  useCreateTenantServiceRequestsMutation,
  useUpdateTenantServiceRequestsMutation,
} = serviceRequestAPIs;
