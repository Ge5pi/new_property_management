import { ISingleTenant } from 'interfaces/ITenant';

import { api } from '../base';

const tenantsAPI = api.injectEndpoints({
  endpoints: build => ({
    getTenantsUserInformation: build.query<ISingleTenant, void>({
      query: () => ({
        url: `/api/tenant/tenant/`,
        method: 'get',
      }),
      providesTags: result => [{ type: 'TenantUserInformation', id: result ? Number(result.id) : 'TENANT-DETAILS' }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTenantsUserInformationQuery } = tenantsAPI;
