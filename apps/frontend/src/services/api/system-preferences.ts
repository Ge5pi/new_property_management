import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { parseURLParams } from 'utils/functions';

import { IFilterOptions, IIDName, IPaginationData } from 'interfaces/IGeneral';
import {
  ContactCategory,
  GeneralLabels,
  GeneralTags,
  IManagementFee,
  InventoryLocations,
  InventoryType,
  PropertyType,
} from 'interfaces/ISettings';

import { api } from './base';

export const systemPreferencesAPI = api.injectEndpoints({
  endpoints: build => ({
    // Property Type
    getPropertyTypes: build.query<IPaginationData<PropertyType>, IFilterOptions>({
      query: params => ({
        url: `/api/system-preferences/property-type/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'PropertyTypes' as const, id })),
              { type: 'PropertyTypes', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'PropertyTypes', id: 'PARTIAL-LIST' }],
    }),
    getPropertyTypeById: build.query<PropertyType, number>({
      query: id => ({
        url: `/api/system-preferences/property-type/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'PropertyTypes', id }],
    }),
    createPropertyType: build.mutation<PropertyType, IIDName>({
      query: data => ({
        url: `/api/system-preferences/property-type/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'PropertyTypes', id: 'PARTIAL-LIST' }],
    }),
    updatePropertyType: build.mutation<PropertyType, Partial<PropertyType>>({
      query: data => ({
        url: `/api/system-preferences/property-type/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'PropertyTypes', id },
        { type: 'PropertyTypes', id: 'PARTIAL-LIST' },
      ],
    }),
    deletePropertyType: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/system-preferences/property-type/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'PropertyTypes', id },
        { type: 'PropertyTypes', id: 'PARTIAL-LIST' },
      ],
    }),

    // Inventory Item Types
    getInventoryTypes: build.query<IPaginationData<InventoryType>, IFilterOptions>({
      query: params => ({
        url: `/api/system-preferences/inventory-item-type/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'InventoryTypes' as const, id })),
              { type: 'InventoryTypes', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'InventoryTypes', id: 'PARTIAL-LIST' }],
    }),
    getInventoryTypeById: build.query<InventoryType, number>({
      query: id => ({
        url: `/api/system-preferences/inventory-item-type/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'InventoryTypes', id }],
    }),
    createInventoryType: build.mutation<InventoryType, IIDName>({
      query: data => ({
        url: `/api/system-preferences/inventory-item-type/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'InventoryTypes', id: 'PARTIAL-LIST' }],
    }),
    updateInventoryType: build.mutation<InventoryType, Partial<InventoryType>>({
      query: data => ({
        url: `/api/system-preferences/inventory-item-type/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'InventoryTypes', id },
        { type: 'InventoryTypes', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteInventoryType: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/system-preferences/inventory-item-type/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'InventoryTypes', id },
        { type: 'InventoryTypes', id: 'PARTIAL-LIST' },
      ],
    }),

    // Contact Categories
    getContactCategories: build.query<IPaginationData<InventoryType>, IFilterOptions>({
      query: params => ({
        url: `/api/system-preferences/contact-category/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'ContactCategories' as const, id })),
              { type: 'ContactCategories', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'ContactCategories', id: 'PARTIAL-LIST' }],
    }),
    getContactCategoryById: build.query<ContactCategory, number>({
      query: id => ({
        url: `/api/system-preferences/contact-category/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'ContactCategories', id }],
    }),
    createContactCategory: build.mutation<ContactCategory, IIDName>({
      query: data => ({
        url: `/api/system-preferences/contact-category/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'ContactCategories', id: 'PARTIAL-LIST' }],
    }),
    updateContactCategory: build.mutation<ContactCategory, Partial<ContactCategory>>({
      query: data => ({
        url: `/api/system-preferences/contact-category/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'ContactCategories', id },
        { type: 'ContactCategories', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteContactCategory: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/system-preferences/contact-category/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'ContactCategories', id },
        { type: 'ContactCategories', id: 'PARTIAL-LIST' },
      ],
    }),

    // General Tags Types
    getGeneralTags: build.query<IPaginationData<GeneralTags>, IFilterOptions>({
      query: params => ({
        url: `/api/system-preferences/tag/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'GeneralTags' as const, id })),
              { type: 'GeneralTags', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'GeneralTags', id: 'PARTIAL-LIST' }],
    }),
    getGeneralTagById: build.query<GeneralTags, number>({
      query: id => ({
        url: `/api/system-preferences/tag/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'GeneralTags', id }],
    }),
    createGeneralTag: build.mutation<GeneralTags, IIDName>({
      query: data => ({
        url: `/api/system-preferences/tag/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'GeneralTags', id: 'PARTIAL-LIST' }],
    }),
    updateGeneralTag: build.mutation<GeneralTags, Partial<GeneralTags>>({
      query: data => ({
        url: `/api/system-preferences/tag/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'GeneralTags', id },
        { type: 'GeneralTags', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteGeneralTag: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/system-preferences/tag/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'GeneralTags', id },
        { type: 'GeneralTags', id: 'PARTIAL-LIST' },
      ],
    }),
    getListOfGeneralTags: build.query<GeneralTags[], number[]>({
      async queryFn(ids, _queryApi, _extraOptions, fetchWithBQ) {
        // get a random user
        const promises = ids.map(id =>
          fetchWithBQ({
            url: `/api/system-preferences/tag/${id}/`,
            method: 'get',
          })
        );

        let error: FetchBaseQueryError | null = null;
        let data: GeneralTags[] | null = null;
        try {
          data = await Promise.all(promises).then(res => {
            return res.map(item => {
              if (item.error) {
                if ((item.error as FetchBaseQueryError).status !== 404) {
                  throw item.error;
                }
              }
              return item.data as GeneralTags;
            });
          });
        } catch (err) {
          error = err as FetchBaseQueryError;
        }

        return data ? { data } : { error };
      },
      providesTags: (response, error, ids) =>
        response
          ? response.map(({ id }) => ({ type: 'GeneralTags' as const, id }))
          : ids.map(id => ({ type: 'GeneralTags' as const, id })),
    }),

    // General Labels Types
    getGeneralLabels: build.query<IPaginationData<GeneralLabels>, IFilterOptions>({
      query: params => ({
        url: `/api/system-preferences/label/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'GeneralLabels' as const, id })),
              { type: 'GeneralLabels', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'GeneralLabels', id: 'PARTIAL-LIST' }],
    }),
    getGeneralLabelById: build.query<GeneralLabels, number>({
      query: id => ({
        url: `/api/system-preferences/label/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'GeneralLabels', id }],
    }),
    createGeneralLabel: build.mutation<GeneralLabels, IIDName>({
      query: data => ({
        url: `/api/system-preferences/label/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'GeneralLabels', id: 'PARTIAL-LIST' }],
    }),
    updateGeneralLabel: build.mutation<GeneralLabels, Partial<GeneralLabels>>({
      query: data => ({
        url: `/api/system-preferences/label/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'GeneralLabels', id },
        { type: 'GeneralLabels', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteGeneralLabel: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/system-preferences/label/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'GeneralLabels', id },
        { type: 'GeneralLabels', id: 'PARTIAL-LIST' },
      ],
    }),

    // Inventory Item Locations
    getInventoryLocations: build.query<IPaginationData<InventoryLocations>, IFilterOptions>({
      query: params => ({
        url: `/api/system-preferences/inventory-location/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'InventoryLocations' as const, id })),
              { type: 'InventoryLocations', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'InventoryLocations', id: 'PARTIAL-LIST' }],
    }),
    getInventoryLocationById: build.query<InventoryLocations, number>({
      query: id => ({
        url: `/api/system-preferences/inventory-location/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'InventoryLocations', id }],
    }),
    createInventoryLocation: build.mutation<InventoryLocations, IIDName>({
      query: data => ({
        url: `/api/system-preferences/inventory-location/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'InventoryLocations', id: 'PARTIAL-LIST' }],
    }),
    updateInventoryLocation: build.mutation<InventoryLocations, Partial<InventoryLocations>>({
      query: data => ({
        url: `/api/system-preferences/inventory-location/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'InventoryLocations', id },
        { type: 'InventoryLocations', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteInventoryLocation: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/system-preferences/inventory-location/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'InventoryLocations', id },
        { type: 'InventoryLocations', id: 'PARTIAL-LIST' },
      ],
    }),

    // Management Fee
    getManagementFees: build.query<IPaginationData<IManagementFee>, IFilterOptions>({
      query: params => ({
        url: `/api/system-preferences/management-fee/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<IManagementFee>) => {
        response.results = response.results.map(result => ({
          ...result,
          prev_fee: result.previous_fee
            ? `${result.previous_fee_type === 'FLAT_FEE' ? '$' : ''}${result.previous_fee}${
                result.previous_fee_type === 'BY_PERCENTAGE' ? '%' : ''
              }`
            : '-',
          updated_fee: result.fee
            ? `${result.fee_type === 'FLAT_FEE' ? '$' : ''}${result.fee}${
                result.fee_type === 'BY_PERCENTAGE' ? '%' : ''
              }`
            : '-',
        }));
        return response;
      },
      transformErrorResponse: baseQueryReturnValue => {
        return baseQueryReturnValue;
      },
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'ManagementFee' as const, id })),
              { type: 'ManagementFee', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'ManagementFee', id: 'PARTIAL-LIST' }],
    }),
    getLatestManagementFees: build.query<IPaginationData<IManagementFee>, void>({
      query: () => ({
        url: `/api/system-preferences/management-fee/?page=1&size=2&ordering=-created_at`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<IManagementFee>) => {
        response.results = response.results.map(result => ({
          ...result,
          prev_fee: result.fee ? (result.fee_type === 'FLAT_FEE' ? result.fee : undefined) : undefined,
          prev_percentage: result.fee ? (result.fee_type === 'BY_PERCENTAGE' ? result.fee : undefined) : undefined,
        }));
        return response;
      },
      transformErrorResponse: baseQueryReturnValue => {
        return baseQueryReturnValue;
      },
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'ManagementFee' as const, id })),
              { type: 'ManagementFee', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'ManagementFee', id: 'PARTIAL-LIST' }],
    }),
    getManagementFeeById: build.query<IManagementFee, number>({
      query: id => ({
        url: `/api/system-preferences/management-fee/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'ManagementFee', id }],
    }),
    createManagementFee: build.mutation<IManagementFee, IManagementFee>({
      query: data => ({
        url: `/api/system-preferences/management-fee/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'ManagementFee', id: 'PARTIAL-LIST' }],
    }),
    updateManagementFee: build.mutation<IManagementFee, Partial<IManagementFee>>({
      query: data => ({
        url: `/api/system-preferences/management-fee/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'ManagementFee', id },
        { type: 'ManagementFee', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteManagementFee: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/system-preferences/management-fee/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'ManagementFee', id },
        { type: 'ManagementFee', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetPropertyTypesQuery,
  useGetPropertyTypeByIdQuery,
  useUpdatePropertyTypeMutation,
  useCreatePropertyTypeMutation,
  useDeletePropertyTypeMutation,

  useGetInventoryTypesQuery,
  useGetInventoryTypeByIdQuery,
  useUpdateInventoryTypeMutation,
  useCreateInventoryTypeMutation,
  useDeleteInventoryTypeMutation,

  useGetContactCategoriesQuery,
  useGetContactCategoryByIdQuery,
  useUpdateContactCategoryMutation,
  useCreateContactCategoryMutation,
  useDeleteContactCategoryMutation,

  useGetGeneralTagsQuery,
  useGetGeneralTagByIdQuery,
  useUpdateGeneralTagMutation,
  useCreateGeneralTagMutation,
  useDeleteGeneralTagMutation,
  useGetListOfGeneralTagsQuery,

  useGetGeneralLabelsQuery,
  useGetGeneralLabelByIdQuery,
  useUpdateGeneralLabelMutation,
  useCreateGeneralLabelMutation,
  useDeleteGeneralLabelMutation,

  useGetInventoryLocationsQuery,
  useGetInventoryLocationByIdQuery,
  useUpdateInventoryLocationMutation,
  useCreateInventoryLocationMutation,
  useDeleteInventoryLocationMutation,

  useGetManagementFeesQuery,
  useGetLatestManagementFeesQuery,
  useGetManagementFeeByIdQuery,
  useUpdateManagementFeeMutation,
  useCreateManagementFeeMutation,
  useDeleteManagementFeeMutation,
} = systemPreferencesAPI;
