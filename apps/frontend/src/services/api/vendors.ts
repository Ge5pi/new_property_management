import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { parseURLParams } from 'utils/functions';

import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';
import { ISinglePeopleVendor, IVendorAttachments, VendorAddressType } from 'interfaces/IPeoples';

import { api } from './base';

const vendorAPIs = api.injectEndpoints({
  endpoints: build => ({
    getVendors: build.query<IPaginationData<ISinglePeopleVendor>, IFilterOptions>({
      query: params => ({
        url: `/api/people/vendor/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'Vendors' as const, id })),
              { type: 'Vendors', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Vendors', id: 'PARTIAL-LIST' }],
      transformResponse: (response: IPaginationData<ISinglePeopleVendor>) => {
        response.results = response.results.map(result => ({
          ...result,
          vendor: `${result.first_name} ${result.last_name}`,
          phone_number: result.personal_contact_numbers?.length ? result.personal_contact_numbers[0] : '-',
          email: result.personal_emails?.length ? result.personal_emails[0] : '-',
          v_type: result.vendor_type_name,
        }));
        return response;
      },
      transformErrorResponse: baseQueryReturnValue => {
        return baseQueryReturnValue;
      },
    }),
    getVendorsById: build.query<ISinglePeopleVendor, number>({
      query: id => ({
        url: `/api/people/vendor/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'Vendors', id }],
    }),
    getListOfVendors: build.query<ISinglePeopleVendor[], number[]>({
      async queryFn(ids, _queryApi, _extraOptions, fetchWithBQ) {
        // get a random user
        const promises = ids.map(id =>
          fetchWithBQ({
            url: `/api/people/vendor/${id}/`,
            method: 'get',
          })
        );

        let error: FetchBaseQueryError | null = null;
        let data: ISinglePeopleVendor[] | null = null;
        try {
          data = await Promise.all(promises).then(res => {
            return res.map(item => {
              if (item.error) {
                if ((item.error as FetchBaseQueryError).status !== 404) {
                  throw item.error;
                }
              }
              return item.data as ISinglePeopleVendor;
            });
          });
        } catch (err) {
          error = err as FetchBaseQueryError;
        }

        return data ? { data } : { error };
      },
      providesTags: (response, error, ids) =>
        response
          ? response.map(({ id }) => ({ type: 'Vendors' as const, id }))
          : ids.map(id => ({ type: 'Vendors' as const, id })),
    }),
    createVendors: build.mutation<ISinglePeopleVendor, ISinglePeopleVendor>({
      query: data => ({
        url: `/api/people/vendor/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'DashboardStatistics' }, { type: 'Vendors', id: 'PARTIAL-LIST' }],
    }),
    updateVendors: build.mutation<ISinglePeopleVendor, Partial<ISinglePeopleVendor>>({
      query: data => ({
        url: `/api/people/vendor/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Vendors', id },
        { type: 'DashboardStatistics' },
        { type: 'Vendors', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteVendor: build.mutation<number | string, string | number>({
      query: id => {
        return {
          url: `/api/people/vendor/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Vendors', id },
        { type: 'Vendors', id: 'PARTIAL-LIST' },
      ],
    }),
    getVendorAttachments: build.query<Array<IVendorAttachments>, string | number>({
      query: id => {
        return {
          url: `/api/people/vendor/${id}/attachments/`,
          method: 'GET',
        };
      },
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'VendorsAttachments' as const, id })),
              { type: 'VendorsAttachments', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'VendorsAttachments', id: 'PARTIAL-LIST' }],
    }),
    createVendorAttachments: build.mutation<Partial<IVendorAttachments>, Partial<IVendorAttachments>>({
      query: data => {
        return {
          url: `/api/people/vendor/${data.vendor}/attachments/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'VendorsAttachments', id: 'PARTIAL-LIST' }],
    }),
    deleteVendorAttachments: build.mutation<number | string, { id: number | string; vendor: string | number }>({
      query: data => {
        return {
          url: `/api/people/vendor/${data.vendor}/attachments/${data.id}/`,
          method: 'delete',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'VendorsAttachments', id },
        { type: 'VendorsAttachments', id: 'PARTIAL-LIST' },
      ],
    }),
    getVendorAddresses: build.query<Array<VendorAddressType>, string | number>({
      query: id => {
        return {
          url: `/api/people/${id}/vendor-address/`,
          method: 'GET',
        };
      },
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'VendorsAddress' as const, id })),
              { type: 'VendorsAddress', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'VendorsAddress', id: 'PARTIAL-LIST' }],
    }),
    createVendorAddresses: build.mutation<Partial<VendorAddressType>, Partial<VendorAddressType>>({
      query: data => {
        return {
          url: `/api/people/vendor-address/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'VendorsAddress', id: 'PARTIAL-LIST' }],
    }),
    updateVendorsAddress: build.mutation<Partial<VendorAddressType>, Partial<VendorAddressType>>({
      query: data => ({
        url: `/api/people/vendor-address/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'VendorsAddress', id },
        { type: 'VendorsAddress', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteVendorAddress: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/people/vendor-address/${id}/`,
          method: 'delete',
          id,
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'VendorsAddress', id },
        { type: 'VendorsAddress', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetVendorsQuery,
  useGetVendorsByIdQuery,
  useGetListOfVendorsQuery,
  useUpdateVendorsMutation,
  useCreateVendorsMutation,
  useDeleteVendorMutation,
  useCreateVendorAttachmentsMutation,
  useDeleteVendorAttachmentsMutation,
  useGetVendorAttachmentsQuery,
  useDeleteVendorAddressMutation,
  useCreateVendorAddressesMutation,
  useGetVendorAddressesQuery,
  useUpdateVendorsAddressMutation,
} = vendorAPIs;
