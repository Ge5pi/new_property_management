import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { parseURLParams } from 'utils/functions';

import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';
import { IOwnerUpcomingActivities, ISinglePeopleOwner } from 'interfaces/IPeoples';
import { IListProperties } from 'interfaces/IProperties';

import { api } from './base';

const ownerAPIs = api.injectEndpoints({
  endpoints: build => ({
    getOwners: build.query<IPaginationData<ISinglePeopleOwner>, IFilterOptions>({
      query: params => ({
        url: `/api/people/owner-people/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<ISinglePeopleOwner>) => {
        response.results = response.results.map(result => ({
          ...result,
          owner: `${result.first_name} ${result.last_name}`,
          phone_number: result.personal_contact_numbers?.length ? result.personal_contact_numbers[0] : '-',
          email: result.personal_emails?.length ? result.personal_emails[0] : '-',
        }));
        return response;
      },
      transformErrorResponse: baseQueryReturnValue => {
        return baseQueryReturnValue;
      },
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'Owners' as const, id })),
              { type: 'Owners', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Owners', id: 'PARTIAL-LIST' }],
    }),
    getOwnersById: build.query<ISinglePeopleOwner, number>({
      query: id => ({
        url: `/api/people/owner-people/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'Owners', id }],
    }),
    getListOfOwners: build.query<ISinglePeopleOwner[], number[]>({
      async queryFn(ids, _queryApi, _extraOptions, fetchWithBQ) {
        // get a random user
        const promises = ids.map(id =>
          fetchWithBQ({
            url: `/api/people/owner-people/${id}/`,
            method: 'get',
          })
        );

        let error: FetchBaseQueryError | null = null;
        let data: ISinglePeopleOwner[] | null = null;
        try {
          data = await Promise.all(promises).then(res => {
            return res.map(item => {
              if (item.error) {
                if ((item.error as FetchBaseQueryError).status !== 404) {
                  throw item.error;
                }
              }
              return item.data as ISinglePeopleOwner;
            });
          });
        } catch (err) {
          error = err as FetchBaseQueryError;
        }

        return data ? { data } : { error };
      },
      providesTags: (response, error, ids) =>
        response
          ? response.map(({ id }) => ({ type: 'Owners' as const, id }))
          : ids.map(id => ({ type: 'Owners' as const, id })),
    }),
    createOwners: build.mutation<ISinglePeopleOwner, ISinglePeopleOwner>({
      query: data => ({
        url: `/api/people/owner-people/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'Owners', id: 'PARTIAL-LIST' }],
    }),
    updateOwners: build.mutation<ISinglePeopleOwner, Partial<ISinglePeopleOwner>>({
      query: data => ({
        url: `/api/people/owner-people/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Owners', id },
        { type: 'Owners', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteOwner: build.mutation<number | string, string | number>({
      query: id => {
        return {
          url: `/api/people/owner-people/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Owners', id },
        { type: 'Owners', id: 'PARTIAL-LIST' },
      ],
    }),
    getOwnedProperties: build.query<IListProperties[], number>({
      query: id => ({
        url: `/api/people/${id}/owner-owned-properties/`,
        method: 'get',
      }),

      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'PropertiesOwned' as const, id })),
              { type: 'PropertiesOwned', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'PropertiesOwned', id: 'PARTIAL-LIST' }],
    }),

    // Upcoming Activities

    getOwnerUpcomingActivities: build.query<Array<IOwnerUpcomingActivities>, string | number>({
      query: owner_id => ({
        url: `/api/people/owner-upcoming-activity/?owner=${owner_id}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'OwnerUpcomingActivity' as const, id })),
              { type: 'OwnerUpcomingActivity', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'OwnerUpcomingActivity', id: 'PARTIAL-LIST' }],
    }),
    getOwnerUpcomingActivityById: build.query<
      IOwnerUpcomingActivities,
      { id: string | number; owner: string | number }
    >({
      query: data => ({
        url: `/api/people/owner-upcoming-activity/${data.id}/`,
        method: 'get',
      }),
      providesTags: (result, error, { id }) => [{ type: 'OwnerUpcomingActivity', id }],
    }),
    createOwnerUpcomingActivity: build.mutation<IOwnerUpcomingActivities, IOwnerUpcomingActivities>({
      query: data => ({
        url: `/api/people/owner-upcoming-activity/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [
        { type: 'Calendar', id: 'PARTIAL-LIST' },
        { type: 'OwnerUpcomingActivity', id: 'PARTIAL-LIST' },
        { type: 'DashboardUpcomingActivity', id: 'PARTIAL-LIST' },
      ],
    }),
    updateOwnerUpcomingActivity: build.mutation<IOwnerUpcomingActivities, Partial<IOwnerUpcomingActivities>>({
      query: data => ({
        url: `/api/people/owner-upcoming-activity/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'OwnerUpcomingActivity', id },
        { type: 'OwnerUpcomingActivity', id: 'PARTIAL-LIST' },
        { type: 'DashboardUpcomingActivity', id },
        { type: 'Calendar', id: 'PARTIAL-LIST' },
        { type: 'DashboardUpcomingActivity', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetOwnersQuery,
  useGetOwnersByIdQuery,
  useGetListOfOwnersQuery,
  useUpdateOwnersMutation,
  useCreateOwnersMutation,
  useDeleteOwnerMutation,
  useGetOwnedPropertiesQuery,

  useCreateOwnerUpcomingActivityMutation,
  useGetOwnerUpcomingActivitiesQuery,
  useGetOwnerUpcomingActivityByIdQuery,
  useUpdateOwnerUpcomingActivityMutation,
} = ownerAPIs;
