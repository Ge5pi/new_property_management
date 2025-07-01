import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { parseURLParams } from 'utils/functions';

import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';
import { IParentProperty } from 'interfaces/IProperties';
import { IListUnits, IPhotoUnitID, ISingleUnit, IUnitsAPI, IUnitsUpcomingActivities } from 'interfaces/IUnits';

import { api } from './base';

declare type UnitsListType = IFilterOptions & IParentProperty;

const unitsApi = api.injectEndpoints({
  endpoints: build => ({
    getUnits: build.query<IPaginationData<IListUnits>, UnitsListType>({
      query: params => ({
        url: `/api/property/units/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'Units' as const, id })),
              { type: 'Units', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Units', id: 'PARTIAL-LIST' }],
    }),
    getUnitById: build.query<ISingleUnit, string | number>({
      query: id => ({
        url: `/api/property/units/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'Units', id }],
    }),
    getListOfUnits: build.query<ISingleUnit[], number[]>({
      async queryFn(ids, _queryApi, _extraOptions, fetchWithBQ) {
        // get a random user
        const promises = ids.map(id =>
          fetchWithBQ({
            url: `/api/property/units/${id}/`,
            method: 'get',
          })
        );

        let error: FetchBaseQueryError | null = null;
        let data: ISingleUnit[] | null = null;
        try {
          data = await Promise.all(promises).then(res => {
            return res.map(item => {
              if (item.error) {
                if ((item.error as FetchBaseQueryError).status !== 404) {
                  throw item.error;
                }
              }
              return item.data as ISingleUnit;
            });
          });
        } catch (err) {
          error = err as FetchBaseQueryError;
        }

        return data ? { data } : { error };
      },
      providesTags: (response, error, ids) =>
        response
          ? response.map(({ id }) => ({ type: 'Units' as const, id }))
          : ids.map(id => ({ type: 'Units' as const, id })),
    }),
    createUnit: build.mutation<ISingleUnit, IUnitsAPI>({
      query: data => ({
        url: `/api/property/units/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'DashboardStatistics' }, { type: 'Units', id: 'PARTIAL-LIST' }],
    }),
    updateUnit: build.mutation<ISingleUnit, Partial<IUnitsAPI>>({
      query: data => ({
        url: `/api/property/units/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Units', id },
        { type: 'DashboardStatistics' },
        { type: 'Units', id: 'PARTIAL-LIST' },
      ],
    }),
    updateUnitsInformation: build.mutation<ISingleUnit, Partial<ISingleUnit>>({
      query: data => {
        return {
          url: `/api/property/units/${data.id}/`,
          method: 'PATCH',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Units', id },
        { type: 'Units', id: 'PARTIAL-LIST' },
      ],
    }),

    getUnitPhotos: build.query<Array<IPhotoUnitID>, string | number>({
      query: id => {
        return {
          url: `/api/property/unit-photos/?unit=${id}`,
          method: 'GET',
        };
      },
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'UnitPhotos' as const, id })),
              { type: 'UnitPhotos', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'UnitPhotos', id: 'PARTIAL-LIST' }],
    }),

    deleteUnitPhoto: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/property/unit-photos/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'UnitPhotos', id },
        { type: 'UnitPhotos', id: 'PARTIAL-LIST' },
      ],
    }),

    addUnitPhoto: build.mutation<IPhotoUnitID, IPhotoUnitID>({
      query: data => {
        return {
          url: `/api/property/unit-photos/`,
          method: 'post',
          data,
        };
      },
      invalidatesTags: (result, error, { unit }) => [
        { type: 'Units', id: unit },
        { type: 'UnitPhotos', id: 'PARTIAL-LIST' },
      ],
    }),

    updateUnitPhoto: build.mutation<IPhotoUnitID, Partial<IPhotoUnitID>>({
      query: data => ({
        url: `/api/property/unit-photos/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'UnitPhotos', id },
        { type: 'UnitPhotos', id: 'PARTIAL-LIST' },
      ],
    }),

    // Upcoming Activities

    getUnitUpcomingActivities: build.query<Array<IUnitsUpcomingActivities>, string | number>({
      query: unit_id => ({
        url: `/api/property/unit-upcoming-activities/?unit=${unit_id}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'UnitUpcomingActivity' as const, id })),
              { type: 'UnitUpcomingActivity', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'UnitUpcomingActivity', id: 'PARTIAL-LIST' }],
    }),
    getUnitUpcomingActivityById: build.query<IUnitsUpcomingActivities, { id: string | number; unit: string | number }>({
      query: data => ({
        url: `/api/property/unit-upcoming-activities/${data.id}/`,
        method: 'get',
      }),
      providesTags: (result, error, { id }) => [{ type: 'UnitUpcomingActivity', id }],
    }),
    createUnitUpcomingActivity: build.mutation<IUnitsUpcomingActivities, IUnitsUpcomingActivities>({
      query: data => ({
        url: `/api/property/unit-upcoming-activities/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [
        { type: 'Calendar', id: 'PARTIAL-LIST' },
        { type: 'UnitUpcomingActivity', id: 'PARTIAL-LIST' },
        { type: 'DashboardUpcomingActivity', id: 'PARTIAL-LIST' },
      ],
    }),
    updateUnitUpcomingActivity: build.mutation<IUnitsUpcomingActivities, Partial<IUnitsUpcomingActivities>>({
      query: data => ({
        url: `/api/property/unit-upcoming-activities/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'UnitUpcomingActivity', id },
        { type: 'UnitUpcomingActivity', id: 'PARTIAL-LIST' },
        { type: 'DashboardUpcomingActivity', id },
        { type: 'DashboardUpcomingActivity', id: 'PARTIAL-LIST' },
        { type: 'Calendar', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetUnitsQuery,
  useGetUnitByIdQuery,

  useGetListOfUnitsQuery,

  useCreateUnitMutation,
  useUpdateUnitMutation,

  useUpdateUnitsInformationMutation,
  useDeleteUnitPhotoMutation,
  useAddUnitPhotoMutation,
  useGetUnitPhotosQuery,

  useCreateUnitUpcomingActivityMutation,
  useGetUnitUpcomingActivitiesQuery,
  useGetUnitUpcomingActivityByIdQuery,
  useUpdateUnitUpcomingActivityMutation,
} = unitsApi;
