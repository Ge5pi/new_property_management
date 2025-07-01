import { parseURLParams } from 'utils/functions';

import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';
import { IVendorType } from 'interfaces/IPeoples';

import { api } from './base';

const vendorTypeAPIs = api.injectEndpoints({
  endpoints: build => ({
    getVendorTypes: build.query<IPaginationData<IVendorType>, IFilterOptions>({
      query: params => ({
        url: `/api/people/vendor-type/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'VendorTypes' as const, id })),
              { type: 'VendorTypes', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'VendorTypes', id: 'PARTIAL-LIST' }],
    }),
    getVendorTypesById: build.query<IVendorType, number>({
      query: id => ({
        url: `/api/people/vendor-type/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'VendorTypes', id }],
    }),
    createVendorTypes: build.mutation<IVendorType, IVendorType>({
      query: data => ({
        url: `/api/people/vendor-type/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'VendorTypes', id: 'PARTIAL-LIST' }],
    }),
    updateVendorTypes: build.mutation<IVendorType, Partial<IVendorType>>({
      query: data => ({
        url: `/api/people/vendor-type/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'VendorTypes', id },
        { type: 'VendorTypes', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteVendorType: build.mutation<number | string, string | number>({
      query: id => {
        return {
          url: `/api/people/vendor-type/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'VendorTypes', id },
        { type: 'VendorTypes', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetVendorTypesQuery,
  useGetVendorTypesByIdQuery,
  useUpdateVendorTypesMutation,
  useCreateVendorTypesMutation,
  useDeleteVendorTypeMutation,
} = vendorTypeAPIs;
