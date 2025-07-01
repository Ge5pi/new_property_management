import { parseURLParams } from 'utils/functions';

import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';
import { IInventoryAPI, ISingleInventory } from 'interfaces/IInventory';

import { api } from './base';

declare type InventoryFilters = IFilterOptions & {
  item_type?: string;
  location?: string;
  vendor?: string;
};

const inventoryAPI = api.injectEndpoints({
  endpoints: build => ({
    getInventory: build.query<IPaginationData<ISingleInventory>, InventoryFilters>({
      query: params => ({
        url: `/api/maintenance/inventory/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'Inventory' as const, id })),
              { type: 'Inventory', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Inventory', id: 'PARTIAL-LIST' }],
    }),
    getInventoryById: build.query<ISingleInventory, number>({
      query: id => ({
        url: `/api/maintenance/inventory/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'Inventory', id }],
    }),
    createInventory: build.mutation<ISingleInventory, IInventoryAPI>({
      query: data => ({
        url: `/api/maintenance/inventory/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'Inventory', id: 'PARTIAL-LIST' }],
    }),
    createBulkInventory: build.mutation<ISingleInventory[], IInventoryAPI[]>({
      query: data => ({
        url: `/api/maintenance/inventory/bulk-create/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'Inventory', id: 'PARTIAL-LIST' }],
    }),
    updateInventory: build.mutation<ISingleInventory, Partial<IInventoryAPI>>({
      query: data => ({
        url: `/api/maintenance/inventory/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Inventory', id },
        { type: 'Inventory', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteInventory: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/maintenance/inventory/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Inventory', id },
        { type: 'Inventory', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetInventoryQuery,
  useGetInventoryByIdQuery,
  useUpdateInventoryMutation,
  useCreateInventoryMutation,
  useDeleteInventoryMutation,
  useCreateBulkInventoryMutation,
} = inventoryAPI;
