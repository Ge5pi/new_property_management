import { parseURLParams } from 'utils/functions';

import { IPaginationData } from 'interfaces/IGeneral';
import { IRequestAttachments } from 'interfaces/IMaintenance';
import {
  IListServiceRequest,
  IServiceRequestAPI,
  IServiceRequestFilter,
  ISingleServiceRequest,
} from 'interfaces/IServiceRequests';

import { api } from './base';

const serviceRequestAPIs = api.injectEndpoints({
  endpoints: build => ({
    getServiceRequests: build.query<IPaginationData<IListServiceRequest>, IServiceRequestFilter>({
      query: params => ({
        url: `/api/maintenance/service-requests/?${parseURLParams(params)}`,
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
              ...response.results.map(({ id }) => ({ type: 'ServiceRequests' as const, id })),
              { type: 'ServiceRequests', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'ServiceRequests', id: 'PARTIAL-LIST' }],
    }),
    getServiceRequestsById: build.query<ISingleServiceRequest, number>({
      query: id => ({
        url: `/api/maintenance/service-requests/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'ServiceRequests', id }],
    }),
    createServiceRequest: build.mutation<IServiceRequestAPI, IServiceRequestAPI>({
      query: data => ({
        url: `/api/maintenance/service-requests/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'DashboardGeneralStatistics' }, { type: 'ServiceRequests', id: 'PARTIAL-LIST' }],
    }),
    updateServiceRequest: build.mutation<IServiceRequestAPI, Partial<IServiceRequestAPI>>({
      query: data => ({
        url: `/api/maintenance/service-requests/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'ServiceRequests', id },
        { type: 'DashboardGeneralStatistics' },
        { type: 'ServiceRequests', id: 'PARTIAL-LIST' },
      ],
    }),

    getServiceRequestAttachments: build.query<IRequestAttachments[], number>({
      query: service_request => ({
        url: `/api/maintenance/service-request-attachments/?service_request=${service_request}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'ServiceRequestsAttachments' as const, id })),
              { type: 'ServiceRequestsAttachments', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'ServiceRequestsAttachments', id: 'PARTIAL-LIST' }],
    }),
    createServiceRequestAttachments: build.mutation<IRequestAttachments, IRequestAttachments>({
      query: data => {
        return {
          url: `/api/maintenance/service-request-attachments/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'ServiceRequestsAttachments', id: 'PARTIAL-LIST' }],
    }),
    deleteServiceRequestAttachments: build.mutation<void, IRequestAttachments>({
      query: data => {
        return {
          url: `/api/maintenance/service-request-attachments/${data.id}/`,
          method: 'delete',
          data,
        };
      },
      invalidatesTags: () => [{ type: 'ServiceRequestsAttachments', id: 'PARTIAL-LIST' }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetServiceRequestsQuery,
  useGetServiceRequestsByIdQuery,
  useUpdateServiceRequestMutation,
  useCreateServiceRequestMutation,

  useGetServiceRequestAttachmentsQuery,
  useCreateServiceRequestAttachmentsMutation,
  useDeleteServiceRequestAttachmentsMutation,
} = serviceRequestAPIs;
