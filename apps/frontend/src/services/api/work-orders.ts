import { parseURLParams } from 'utils/functions';

import { IPaginationData } from 'interfaces/IGeneral';
import { ILabor, IWorkOrderFilters, IWorkOrderLabors, IWorkOrdersAPI } from 'interfaces/IWorkOrders';

import { api } from './base';

const workOrderAPIs = api.injectEndpoints({
  endpoints: build => ({
    getAllWorkOrders: build.query<IPaginationData<IWorkOrdersAPI>, IWorkOrderFilters>({
      query: params => ({
        url: `/api/maintenance/work-orders/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<IWorkOrdersAPI>) => {
        response.results = response.results.map(result => ({
          ...result,
          assigned_to:
            result.assign_to_first_name && result.assign_to_last_name
              ? `${result.assign_to_first_name} ${result.assign_to_last_name}`
              : result.assign_to_username,
          wo: {
            id: result.id,
            slug: result.slug,
            is_recurring: result.is_recurring,
          },
          status_with_obj: {
            displayValue: result.get_status_display,
            status: result.status,
            className: {
              OPEN: 'text-muted',
              ASSIGNED: 'text-info',
              UNASSIGNED: 'text-muted',
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
              ...response.results.map(({ id }) => ({ type: 'WorkOrders' as const, id })),
              { type: 'WorkOrders', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'WorkOrders', id: 'PARTIAL-LIST' }],
    }),
    getWorkOrdersById: build.query<IWorkOrdersAPI, number | string>({
      query: id => ({
        url: `/api/maintenance/work-orders/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'WorkOrders', id }],
    }),
    createWorkOrder: build.mutation<IWorkOrdersAPI, IWorkOrdersAPI>({
      query: data => ({
        url: `/api/maintenance/work-orders/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [
        { type: 'DashboardGeneralStatistics' },
        { type: 'WorkOrders', id: 'PARTIAL-LIST' },
        { type: 'WorkOrderForSR', id: 'PARTIAL-LIST' },
      ],
    }),
    updateWorkOrder: build.mutation<IWorkOrdersAPI, Partial<IWorkOrdersAPI>>({
      query: data => ({
        url: `/api/maintenance/work-orders/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WorkOrders', id },
        { type: 'DashboardGeneralStatistics' },
        { type: 'WorkOrders', id: 'PARTIAL-LIST' },
        { type: 'WorkOrderForSR', id },
        { type: 'WorkOrderForSR', id: 'PARTIAL-LIST' },
      ],
    }),
    getWorkOrderLabor: build.query<ILabor[], number | string>({
      query: id => ({
        url: `/api/maintenance/labors/?work_order=${id}`,
        method: 'get',
      }),
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'WorkOrderLabors' as const, id })),
              { type: 'WorkOrderLabors', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'WorkOrderLabors', id: 'PARTIAL-LIST' }],
    }),
    createWorkOrderLabor: build.mutation<ILabor, IWorkOrderLabors>({
      query: data => ({
        url: `/api/maintenance/labors/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'WorkOrderLabors', id: 'PARTIAL-LIST' }],
    }),
    updateWorkOrderLabor: build.mutation<ILabor, Partial<IWorkOrderLabors>>({
      query: data => ({
        url: `/api/maintenance/labors/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WorkOrderLabors', id },
        { type: 'WorkOrderLabors', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllWorkOrdersQuery,
  useGetWorkOrdersByIdQuery,

  useCreateWorkOrderMutation,
  useUpdateWorkOrderMutation,

  useGetWorkOrderLaborQuery,
  useCreateWorkOrderLaborMutation,
  useUpdateWorkOrderLaborMutation,
} = workOrderAPIs;
