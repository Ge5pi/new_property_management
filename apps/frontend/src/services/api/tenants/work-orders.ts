import { parseURLParams } from 'utils/functions';

import { IPaginationData } from 'interfaces/IGeneral';
import { IWorkOrderFilters, IWorkOrdersAPI } from 'interfaces/IWorkOrders';

import { api } from '../base';

const workOrderAPIs = api.injectEndpoints({
  endpoints: build => ({
    getTenantWorkOrders: build.query<IPaginationData<IWorkOrdersAPI>, IWorkOrderFilters>({
      query: params => ({
        url: `/api/tenant/work-orders/?${parseURLParams(params)}`,
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
              ...response.results.map(({ id }) => ({ type: 'TenantWorkOrders' as const, id })),
              { type: 'TenantWorkOrders', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'TenantWorkOrders', id: 'PARTIAL-LIST' }],
    }),
    getTenantWorkOrdersById: build.query<IWorkOrdersAPI, number | string>({
      query: id => ({
        url: `/api/tenant/work-orders/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'TenantWorkOrders', id }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTenantWorkOrdersByIdQuery, useGetTenantWorkOrdersQuery } = workOrderAPIs;
