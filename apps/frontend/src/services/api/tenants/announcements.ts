import { parseURLParams } from 'utils/functions';

import { ISingleAnnouncement } from 'interfaces/ICommunication';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from '../base';

const announcementsAPI = api.injectEndpoints({
  endpoints: build => ({
    getTenantsAnnouncements: build.query<IPaginationData<ISingleAnnouncement>, IFilterOptions>({
      query: params => ({
        url: `/api/tenant/announcements/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'TenantAnnouncements' as const, id })),
              { type: 'TenantAnnouncements', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'TenantAnnouncements', id: 'PARTIAL-LIST' }],
    }),
    getTenantsAnnouncementById: build.query<ISingleAnnouncement, number>({
      query: id => ({
        url: `/api/tenant/announcements/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'TenantAnnouncements', id }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTenantsAnnouncementsQuery, useGetTenantsAnnouncementByIdQuery } = announcementsAPI;
