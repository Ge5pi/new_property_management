import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { parseURLParams } from 'utils/functions';

import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';
import { ISingleTenant, ITenantAPI, ITenantAttachments, ITenantUpcomingActivities } from 'interfaces/ITenant';

import { api } from './base';

interface TenantsFilterValues extends IFilterOptions {
  unit_id?: string;
  property_id?: string;
  status?: 'Current' | 'Past' | '';
}

const tenantsAPI = api.injectEndpoints({
  endpoints: build => ({
    getTenants: build.query<IPaginationData<ITenantAPI>, TenantsFilterValues>({
      query: params => ({
        url: `/api/people/tenants/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<ITenantAPI>) => {
        response.results = response.results.map(result => ({
          ...result,
          full_name: `${result.first_name} ${result.last_name}`,
          property: result.property_name,
          unit: result.unit_name,
          status_with_obj: {
            displayValue: result.status,
            status: result.status?.toLowerCase(),
            className: {
              past: 'text-muted',
              current: 'text-success',
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
              ...response.results.map(({ id }) => ({ type: 'Tenants' as const, id })),
              { type: 'Tenants', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Tenants', id: 'PARTIAL-LIST' }],
    }),
    getTenantById: build.query<ISingleTenant, number>({
      query: id => ({
        url: `/api/people/tenants/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [
        { type: 'Tenants', id },
        { type: 'TenantsAttachments', id: 'PARTIAL-LIST' },
      ],
    }),
    getListOfTenants: build.query<ISingleTenant[], number[]>({
      async queryFn(ids, _queryApi, _extraOptions, fetchWithBQ) {
        // get a random user
        const promises = ids.map(id =>
          fetchWithBQ({
            url: `/api/people/tenants/${id}/`,
            method: 'get',
          })
        );

        let error: FetchBaseQueryError | null = null;
        let data: ISingleTenant[] | null = null;
        try {
          data = await Promise.all(promises).then(res => {
            return res.map(item => {
              if (item.error) {
                if ((item.error as FetchBaseQueryError).status !== 404) {
                  throw item.error;
                }
              }
              return item.data as ISingleTenant;
            });
          });
        } catch (err) {
          error = err as FetchBaseQueryError;
        }

        return data ? { data } : { error };
      },
      providesTags: (response, error, ids) =>
        response
          ? response.map(({ id }) => ({ type: 'Tenants' as const, id }))
          : ids.map(id => ({ type: 'Tenants' as const, id })),
    }),
    createTenant: build.mutation<ITenantAPI, ITenantAPI>({
      query: data => ({
        url: `/api/people/tenants/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'Tenants', id: 'PARTIAL-LIST' }],
    }),
    updateTenant: build.mutation<ITenantAPI, Partial<ITenantAPI>>({
      query: data => ({
        url: `/api/people/tenants/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Tenants', id },
        { type: 'Tenants', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteTenant: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/people/tenants/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Tenants', id },
        { type: 'Tenants', id: 'PARTIAL-LIST' },
      ],
    }),
    getTenantAttachments: build.query<Array<ITenantAttachments>, string | number>({
      query: tenant_id => {
        return {
          url: `/api/people/tenants/${tenant_id}/attachments/`,
          method: 'GET',
        };
      },
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'TenantsAttachments' as const, id })),
              { type: 'TenantsAttachments', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'TenantsAttachments', id: 'PARTIAL-LIST' }],
    }),
    createTenantAttachments: build.mutation<Partial<ITenantAttachments>, Partial<ITenantAttachments>>({
      query: data => {
        return {
          url: `/api/people/tenants/${data.tenant}/attachments/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'TenantsAttachments', id: 'PARTIAL-LIST' }],
    }),
    deleteTenantAttachments: build.mutation<number | string, { id: number | string; tenant: string | number }>({
      query: data => {
        return {
          url: `/api/people/tenants/${data.tenant}/attachments/${data.id}/`,
          method: 'delete',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'TenantsAttachments', id },
        { type: 'TenantsAttachments', id: 'PARTIAL-LIST' },
      ],
    }),

    // Upcoming Activities

    getTenantUpcomingActivities: build.query<Array<ITenantUpcomingActivities>, string | number>({
      query: tenant_id => ({
        url: `/api/people/tenants-upcoming-activity/?tenant=${tenant_id}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'TenantUpcomingActivity' as const, id })),
              { type: 'TenantUpcomingActivity', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'TenantUpcomingActivity', id: 'PARTIAL-LIST' }],
    }),
    getTenantUpcomingActivityById: build.query<
      ITenantUpcomingActivities,
      { id: string | number; tenant: string | number }
    >({
      query: data => ({
        url: `/api/people/tenants-upcoming-activity/${data.id}/`,
        method: 'get',
      }),
      providesTags: (result, error, { id }) => [{ type: 'TenantUpcomingActivity', id }],
    }),
    createTenantUpcomingActivity: build.mutation<ITenantUpcomingActivities, ITenantUpcomingActivities>({
      query: data => ({
        url: `/api/people/tenants-upcoming-activity/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [
        { type: 'Calendar', id: 'PARTIAL-LIST' },
        { type: 'TenantUpcomingActivity', id: 'PARTIAL-LIST' },
        { type: 'DashboardUpcomingActivity', id: 'PARTIAL-LIST' },
      ],
    }),
    updateTenantUpcomingActivity: build.mutation<ITenantUpcomingActivities, Partial<ITenantUpcomingActivities>>({
      query: data => ({
        url: `/api/people/tenants-upcoming-activity/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'TenantUpcomingActivity', id },
        { type: 'Calendar', id: 'PARTIAL-LIST' },
        { type: 'TenantUpcomingActivity', id: 'PARTIAL-LIST' },
        { type: 'DashboardUpcomingActivity', id },
        { type: 'DashboardUpcomingActivity', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetTenantsQuery,
  useGetTenantByIdQuery,
  useUpdateTenantMutation,
  useCreateTenantMutation,
  useDeleteTenantMutation,
  useGetListOfTenantsQuery,

  useGetTenantAttachmentsQuery,
  useCreateTenantAttachmentsMutation,
  useDeleteTenantAttachmentsMutation,

  useCreateTenantUpcomingActivityMutation,
  useGetTenantUpcomingActivitiesQuery,
  useGetTenantUpcomingActivityByIdQuery,
  useUpdateTenantUpcomingActivityMutation,
} = tenantsAPI;
