import { parseURLParams } from 'utils/functions';

import { ILeaseAPI, ILeaseForm, LeaseStatusType } from 'interfaces/IApplications';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from '../base';

interface LeaseFilter extends IFilterOptions {
  unit?: string;
  unit__parent_property?: string;
  status?: LeaseStatusType | '';
  remaining_days_less_than?: number | string;
}

const leaseAPI = api.injectEndpoints({
  endpoints: build => ({
    getTenantLeases: build.query<IPaginationData<ILeaseAPI>, LeaseFilter>({
      query: params => ({
        url: `/api/tenant/leases/?${parseURLParams(params)}`,
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
        }));
        return response;
      },
      transformErrorResponse: baseQueryReturnValue => {
        return baseQueryReturnValue;
      },
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'TenantLeases' as const, id })),
              { type: 'TenantLeases', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'TenantLeases', id: 'PARTIAL-LIST' }],
    }),
    getTenantLeasesById: build.query<ILeaseForm, number>({
      query: id => ({
        url: `/api/tenant/leases/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'TenantLeases', id }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTenantLeasesByIdQuery, useGetTenantLeasesQuery } = leaseAPI;
