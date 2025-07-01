import { parseURLParams } from 'utils/functions';

import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';
import { IParentProperty } from 'interfaces/IProperties';
import { IListUnitTypes, IPhotoUnitTypeID, ISingleUnitType, IUnitTypeAPI } from 'interfaces/IUnits';

import { api } from './base';

declare type UnitTypesListType = IFilterOptions & IParentProperty;

const unitTypesApi = api.injectEndpoints({
  endpoints: build => ({
    getUnitTypes: build.query<IPaginationData<IListUnitTypes>, UnitTypesListType>({
      query: ({ ...params }) => ({
        url: `/api/property/unit-types/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'UnitTypes' as const, id })),
              { type: 'UnitTypes', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'UnitTypes', id: 'PARTIAL-LIST' }],
    }),

    getUnitTypeById: build.query<ISingleUnitType, string | number>({
      query: id => ({
        url: `/api/property/unit-types/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'UnitTypes', id }],
    }),

    createUnitType: build.mutation<ISingleUnitType, IUnitTypeAPI>({
      query: data => ({
        url: `/api/property/unit-types/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'UnitTypes', id: 'PARTIAL-LIST' }],
    }),

    updateUnitType: build.mutation<ISingleUnitType, Partial<IUnitTypeAPI>>({
      query: data => ({
        url: `/api/property/unit-types/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'UnitTypes', id },
        { type: 'UnitTypes', id: 'PARTIAL-LIST' },
      ],
    }),

    updateUnitTypesInformation: build.mutation<ISingleUnitType, Partial<ISingleUnitType>>({
      query: data => {
        return {
          url: `/api/property/unit-types/${data.id}/`,
          method: 'PATCH',
          data,
        };
      },
      invalidatesTags: (result, error, { id, unit_id }) =>
        unit_id
          ? [
              { type: 'UnitTypes', id },
              { type: 'Units', id: unit_id },
              { type: 'UnitTypes', id: 'PARTIAL-LIST' },
            ]
          : [
              { type: 'UnitTypes', id },
              { type: 'UnitTypes', id: 'PARTIAL-LIST' },
            ],
    }),

    getUnitTypePhotos: build.query<Array<IPhotoUnitTypeID>, string | number>({
      query: id => {
        return {
          url: `/api/property/unit-type-photos/?unit_type=${id}`,
          method: 'GET',
        };
      },
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'UnitTypePhotos' as const, id })),
              { type: 'UnitTypePhotos', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'UnitTypePhotos', id: 'PARTIAL-LIST' }],
    }),

    deleteUnitTypePhoto: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/property/unit-type-photos/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'UnitTypePhotos', id },
        { type: 'UnitTypePhotos', id: 'PARTIAL-LIST' },
      ],
    }),

    addUnitTypePhoto: build.mutation<IPhotoUnitTypeID, IPhotoUnitTypeID>({
      query: data => {
        return {
          url: `/api/property/unit-type-photos/`,
          method: 'post',
          data,
        };
      },
      invalidatesTags: (result, error, { unit_type }) => [
        { type: 'UnitTypes', id: unit_type },
        { type: 'UnitTypePhotos', id: 'PARTIAL-LIST' },
      ],
    }),

    updateUnitTypePhoto: build.mutation<IPhotoUnitTypeID, Partial<IPhotoUnitTypeID>>({
      query: data => ({
        url: `/api/property/unit-type-photos/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'UnitTypePhotos', id },
        { type: 'UnitTypePhotos', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetUnitTypesQuery,
  useCreateUnitTypeMutation,
  useUpdateUnitTypeMutation,
  useGetUnitTypeByIdQuery,
  useUpdateUnitTypesInformationMutation,

  useDeleteUnitTypePhotoMutation,
  useAddUnitTypePhotoMutation,
  useGetUnitTypePhotosQuery,
} = unitTypesApi;
