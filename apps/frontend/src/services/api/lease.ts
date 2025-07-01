import { parseURLParams } from 'utils/functions';

import { ILeaseAPI, ILeaseForm, ISecondaryTenant, LeaseStatusType } from 'interfaces/IApplications';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from './base';

interface LeaseFilter extends IFilterOptions {
  unit?: string;
  unit__parent_property?: string;
  status?: LeaseStatusType | '';
  remaining_days_less_than?: number | string;
}

const leaseAPI = api.injectEndpoints({
  endpoints: build => ({
    getLeases: build.query<IPaginationData<ILeaseAPI>, LeaseFilter>({
      query: params => ({
        url: `/api/lease/lease/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<ILeaseAPI>) => {
        response.results = response.results.map(result => ({
          ...result,
          tenant_name: `${result.tenant_first_name} ${result.tenant_last_name}`,
          property: {
            title: `${result.property_name}`,
            subtitle: `${result.unit_name}`,
          },
          status_with_obj: {
            displayValue: result.get_status_display,
            status: result.status,
            className: {
              ACTIVE: 'text-success',
              CLOSED: 'text-warning',
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
              ...response.results.map(({ id }) => ({ type: 'Leases' as const, id })),
              { type: 'Leases', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Leases', id: 'PARTIAL-LIST' }],
    }),
    getLeaseById: build.query<ILeaseForm, number>({
      query: id => ({
        url: `/api/lease/lease/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'Leases', id }],
    }),
    createLease: build.mutation<ILeaseForm, ILeaseForm>({
      query: data => ({
        url: `/api/lease/lease/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'Leases', id: 'PARTIAL-LIST' }],
    }),
    updateLease: build.mutation<ILeaseForm, Partial<ILeaseForm>>({
      query: data => ({
        url: `/api/lease/lease/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Leases', id },
        { type: 'Leases', id: 'PARTIAL-LIST' },
      ],
    }),
    closeLease: build.mutation<number | string, number | string>({
      query: id => ({
        url: `/api/lease/lease/${id}/close/`,
        method: 'POST',
        id,
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Leases', id },
        { type: 'Leases', id: 'PARTIAL-LIST' },
      ],
    }),
    renewLease: build.mutation<ILeaseForm, ILeaseForm>({
      query: data => ({
        url: `/api/lease/lease/${data.id}/renewal/`,
        method: 'POST',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Leases', id },
        { type: 'Leases', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteLease: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/lease/lease/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Leases', id },
        { type: 'Leases', id: 'PARTIAL-LIST' },
      ],
    }),
    getLeasesTenants: build.query<ISecondaryTenant[], string | number>({
      query: lease => ({
        url: `/api/lease/secondary-tenant/?lease=${lease}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'LeaseTenant' as const, id })),
              { type: 'LeaseTenant', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'LeaseTenant', id: 'PARTIAL-LIST' }],
    }),
    createLeaseTenant: build.mutation<ISecondaryTenant, ISecondaryTenant>({
      query: data => ({
        url: `/api/lease/secondary-tenant/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'LeaseTenant', id: 'PARTIAL-LIST' }],
    }),
    updateLeaseTenant: build.mutation<ISecondaryTenant, Partial<ISecondaryTenant>>({
      query: data => ({
        url: `/api/lease/secondary-tenant/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'LeaseTenant', id },
        { type: 'LeaseTenant', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteLeaseTenant: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/lease/secondary-tenant/${id}/`,
          method: 'delete',
          id,
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetLeasesQuery,
  useGetLeaseByIdQuery,
  useUpdateLeaseMutation,
  useCreateLeaseMutation,
  useDeleteLeaseMutation,
  useCloseLeaseMutation,
  useRenewLeaseMutation,

  useGetLeasesTenantsQuery,
  useDeleteLeaseTenantMutation,
  useCreateLeaseTenantMutation,
  useUpdateLeaseTenantMutation,
} = leaseAPI;
