import { parseURLParams } from 'utils/functions';

import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';
import { IInspectionArea, IInspectionAreaItem, IInspectionsAPI } from 'interfaces/IInspections';

import { api } from './base';

declare interface IInspectionID {
  inspection_id: string | number;
}

declare interface IInspectionAreaID {
  area_id: string | number;
}

declare type IAItem = {
  item: string | number;
} & IInspectionAreaID;

declare type IA = IInspectionID & IInspectionAreaID;
interface InspectionFilter extends IFilterOptions {
  unit?: string | '';
  date__gte?: string | '';
  date__lte?: string | '';
}

const inspectionAPIs = api.injectEndpoints({
  endpoints: build => ({
    getInspections: build.query<IPaginationData<IInspectionsAPI>, InspectionFilter>({
      query: params => ({
        url: `/api/maintenance/inspections/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<IInspectionsAPI>) => {
        response.results = response.results.map(result => ({
          ...result,
          item: {
            title: result.unit_name,
            image: result.unit_cover_picture?.image,
            subtitle: result.property_name,
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
              ...response.results.map(({ id }) => ({ type: 'Inspections' as const, id })),
              { type: 'Inspections', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Inspections', id: 'PARTIAL-LIST' }],
    }),
    getInspectionsById: build.query<IInspectionsAPI, number>({
      query: id => ({
        url: `/api/maintenance/inspections/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'Inspections', id }],
    }),
    createInspections: build.mutation<IInspectionsAPI, IInspectionsAPI>({
      query: data => ({
        url: `/api/maintenance/inspections/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'Inspections', id: 'PARTIAL-LIST' }],
    }),
    updateInspections: build.mutation<IInspectionsAPI, Partial<IInspectionsAPI>>({
      query: data => ({
        url: `/api/maintenance/inspections/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Inspections', id },
        { type: 'Inspections', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteInspection: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/maintenance/inspections/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Inspections', id },
        { type: 'Inspections', id: 'PARTIAL-LIST' },
      ],
    }),
    getInspectionArea: build.query<IInspectionArea[], string | number>({
      query: inspection_id => ({
        url: `/api/maintenance/area/?inspection=${inspection_id}`,
        method: 'get',
      }),
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'InspectionAreas' as const, id })),
              { type: 'InspectionAreas', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'InspectionAreas', id: 'PARTIAL-LIST' }],
    }),
    getInspectionAreaById: build.query<IInspectionAreaItem, IA>({
      query: ({ area_id }) => ({
        url: `/api/maintenance/area/${area_id}/`,
        method: 'get',
      }),
      providesTags: (result, error, { area_id }) => [{ type: 'InspectionAreas', area_id }],
    }),
    createInspectionArea: build.mutation<IInspectionArea, IInspectionArea>({
      query: data => ({
        url: `/api/maintenance/area/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'InspectionAreas', id: 'PARTIAL-LIST' }],
    }),
    updateInspectionArea: build.mutation<IInspectionArea, Partial<IInspectionArea>>({
      query: data => ({
        url: `/api/maintenance/area/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'InspectionAreas', id },
        { type: 'InspectionAreas', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteInspectionArea: build.mutation<number | string, { id: number | string; inspection_id: string | number }>({
      query: data => {
        return {
          url: `/api/maintenance/area/${data.id}/`,
          method: 'delete',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'InspectionAreas', id },
        { type: 'InspectionAreas', id: 'PARTIAL-LIST' },
      ],
    }),
    getInspectionAreaItems: build.query<IInspectionAreaItem[], string | number>({
      query: area_id => ({
        url: `/api/maintenance/area-items/?area=${area_id}`,
        method: 'get',
      }),
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'InspectionAreaItems' as const, id })),
              { type: 'InspectionAreaItems', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'InspectionAreaItems', id: 'PARTIAL-LIST' }],
    }),
    getInspectionAreaItemsById: build.query<IInspectionAreaItem, IAItem>({
      query: ({ item }) => ({
        url: `/api/maintenance/area-items/${item}/`,
        method: 'get',
      }),
      providesTags: (result, error, { item }) => [{ type: 'InspectionAreaItems', item }],
    }),
    createInspectionAreaItems: build.mutation<IInspectionAreaItem, IInspectionAreaItem>({
      query: data => ({
        url: `/api/maintenance/area-items/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'InspectionAreaItems', id: 'PARTIAL-LIST' }],
    }),
    updateInspectionAreaItems: build.mutation<IInspectionAreaItem, Partial<IInspectionAreaItem>>({
      query: data => ({
        url: `/api/maintenance/area-items/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'InspectionAreaItems', id },
        { type: 'InspectionAreaItems', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteInspectionAreaItem: build.mutation<number | string, { id: number | string; area_id: string | number }>({
      query: data => {
        return {
          url: `/api/maintenance/area-items/${data.id}/`,
          method: 'delete',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'InspectionAreaItems', id },
        { type: 'InspectionAreaItems', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetInspectionsQuery,
  useGetInspectionsByIdQuery,
  useUpdateInspectionsMutation,
  useCreateInspectionsMutation,
  useGetInspectionAreaItemsQuery,
  useGetInspectionAreaItemsByIdQuery,
  useUpdateInspectionAreaItemsMutation,
  useCreateInspectionAreaItemsMutation,
  useGetInspectionAreaQuery,
  useGetInspectionAreaByIdQuery,
  useUpdateInspectionAreaMutation,
  useCreateInspectionAreaMutation,
  useDeleteInspectionAreaItemMutation,
  useDeleteInspectionAreaMutation,
  useDeleteInspectionMutation,
} = inspectionAPIs;
