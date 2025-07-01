import { parseURLParams } from 'utils/functions';

import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';
import { IParentProperty } from 'interfaces/IProperties';
import { IRentableItems } from 'interfaces/IRentableItems';

import { api } from './base';

declare type RentableItemsListType = IFilterOptions & IParentProperty;

const rentableItemsAPI = api.injectEndpoints({
  endpoints: build => ({
    getRentableItems: build.query<IPaginationData<IRentableItems>, RentableItemsListType>({
      query: params => ({
        url: `/api/property/rentable-items/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'RentableItems' as const, id })),
              { type: 'RentableItems', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'RentableItems', id: 'PARTIAL-LIST' }],
    }),
    getRentableItemById: build.query<IRentableItems, string | number>({
      query: id => ({
        url: `/api/property/rentable-items/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'RentableItems', id }],
    }),
    createRentableItem: build.mutation<IRentableItems, IRentableItems>({
      query: data => ({
        url: `/api/property/rentable-items/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'RentableItems', id: 'PARTIAL-LIST' }],
    }),
    updateRentableItem: build.mutation<IRentableItems, Partial<IRentableItems>>({
      query: data => ({
        url: `/api/property/rentable-items/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RentableItems', id },
        { type: 'RentableItems', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetRentableItemsQuery,
  useCreateRentableItemMutation,
  useUpdateRentableItemMutation,
  useGetRentableItemByIdQuery,
} = rentableItemsAPI;
