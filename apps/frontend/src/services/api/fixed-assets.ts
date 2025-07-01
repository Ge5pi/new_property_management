import { parseURLParams } from 'utils/functions';

import { FixedAssetStatus, IFixedAssets } from 'interfaces/IAssets';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from './base';

declare type FilterStatusType = FixedAssetStatus | '';
declare type FixedAssetsFilters = IFilterOptions & {
  unit?: string;
  unit__parent_property?: string;
  status?: FilterStatusType;
};

const fixedAssetsAPI = api.injectEndpoints({
  endpoints: build => ({
    getFixedAssets: build.query<IPaginationData<IFixedAssets>, FixedAssetsFilters>({
      query: params => ({
        url: `/api/maintenance/fixed-assets/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<IFixedAssets>) => {
        response.results = response.results.map(result => ({
          ...result,
          asset: {
            title: result.slug?.toUpperCase(),
            subtitle: result.inventory_name,
          },
          property_unit: {
            title: result.property_name,
            subtitle: result.unit_name,
          },
          status_with_obj: {
            displayValue: result.get_status_display,
            status: result.status,
            className: {
              in_storage: 'text-muted',
              installed: 'text-success',
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
              ...response.results.map(({ id }) => ({ type: 'FixedAssets' as const, id })),
              { type: 'FixedAssets', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'FixedAssets', id: 'PARTIAL-LIST' }],
    }),
    getFixedAssetsById: build.query<IFixedAssets, number>({
      query: id => ({
        url: `/api/maintenance/fixed-assets/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'FixedAssets', id }],
    }),
    createFixedAssets: build.mutation<IFixedAssets, IFixedAssets>({
      query: data => ({
        url: `/api/maintenance/fixed-assets/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'FixedAssets', id: 'PARTIAL-LIST' }],
    }),
    createBulkAssets: build.mutation<IFixedAssets[], IFixedAssets[]>({
      query: data => ({
        url: `/api/maintenance/fixed-assets/bulk-create/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'FixedAssets', id: 'PARTIAL-LIST' }],
    }),
    updateFixedAssets: build.mutation<IFixedAssets, Partial<IFixedAssets>>({
      query: data => ({
        url: `/api/maintenance/fixed-assets/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'FixedAssets', id },
        { type: 'FixedAssets', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteFixedAssets: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/maintenance/fixed-assets/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'FixedAssets', id },
        { type: 'FixedAssets', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetFixedAssetsQuery,
  useGetFixedAssetsByIdQuery,
  useUpdateFixedAssetsMutation,
  useCreateFixedAssetsMutation,
  useDeleteFixedAssetsMutation,
  useCreateBulkAssetsMutation,
} = fixedAssetsAPI;
