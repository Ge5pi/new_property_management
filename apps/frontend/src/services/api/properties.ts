import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { parseURLParams } from 'utils/functions';

import { IPaginationData } from 'interfaces/IGeneral';
import {
  IIncreaseRentAPI,
  ILateFeePolicy,
  IListProperties,
  IPhotoPropertyID,
  IPropertyAPI,
  IPropertyAttachments,
  IPropertyFilter,
  IPropertyOwner,
  IPropertyUpcomingActivities,
  ISingleProperty,
  IUtilityBills,
} from 'interfaces/IProperties';

import { api } from './base';

export const propertiesApi = api.injectEndpoints({
  endpoints: build => ({
    getProperties: build.query<IPaginationData<IListProperties>, IPropertyFilter>({
      query: params => ({
        url: `/api/property/properties/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<IListProperties>) => {
        response.results = response.results.map(result => ({
          ...result,
          property: {
            id: result.id,
            image: result.cover_picture,
            title: result.name,
            subtitle: result.property_type,
          },
          total_units: result.number_of_units,
          owners: result.owner_peoples,
          status: result.is_occupied === false ? 'VACANT' : !result.is_occupied ? '' : 'OCCUPIED',
          manager: '-',
        }));
        return response;
      },
      transformErrorResponse: baseQueryReturnValue => {
        return baseQueryReturnValue;
      },
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'Properties' as const, id })),
              { type: 'Properties', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Properties', id: 'PARTIAL-LIST' }],
    }),
    getPropertyById: build.query<ISingleProperty, number>({
      query: id => ({
        url: `/api/property/properties/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'Properties', id }],
    }),
    getListOfProperties: build.query<ISingleProperty[], number[]>({
      async queryFn(ids, _queryApi, _extraOptions, fetchWithBQ) {
        // get a random user
        const promises = ids.map(id =>
          fetchWithBQ({
            url: `/api/property/properties/${id}/`,
            method: 'get',
          })
        );

        let error: FetchBaseQueryError | null = null;
        let data: ISingleProperty[] | null = null;
        try {
          data = await Promise.all(promises).then(res => {
            return res.map(item => {
              if (item.error) {
                if ((item.error as FetchBaseQueryError).status !== 404) {
                  throw item.error;
                }
              }
              return item.data as ISingleProperty;
            });
          });
        } catch (err) {
          error = err as FetchBaseQueryError;
        }

        return data ? { data } : { error };
      },
      providesTags: (response, error, ids) =>
        response
          ? response.map(({ id }) => ({ type: 'Properties' as const, id }))
          : ids.map(id => ({ type: 'Properties' as const, id })),
    }),

    createProperty: build.mutation<ISingleProperty, IPropertyAPI>({
      query: data => ({
        url: `/api/property/properties/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'DashboardStatistics' }, { type: 'Properties', id: 'PARTIAL-LIST' }],
    }),

    updateProperty: build.mutation<ISingleProperty, Partial<IPropertyAPI>>({
      query: data => ({
        url: `/api/property/properties/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Properties', id },
        { type: 'DashboardStatistics' },
        { type: 'Properties', id: 'PARTIAL-LIST' },
      ],
    }),

    updatePropertiesInformation: build.mutation<ISingleProperty, Partial<ISingleProperty>>({
      query: data => {
        return {
          url: `/api/property/properties/${data.id}/`,
          method: 'PATCH',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Properties', id },
        { type: 'Properties', id: 'PARTIAL-LIST' },
      ],
    }),

    getDefaultLeaseTemplateAttachmentsList: build.query<Array<IPropertyAttachments>, string | number>({
      query: property_id => ({
        url: `/api/property/lease-template-attachments/?parent_property=${property_id}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'PropertyLeaseAttachments' as const, id })),
              { type: 'PropertyLeaseAttachments', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'PropertyLeaseAttachments', id: 'PARTIAL-LIST' }],
    }),

    createDefaultLeaseTemplateAttachments: build.mutation<IPropertyAttachments, Partial<IPropertyAttachments>>({
      query: data => ({
        url: `/api/property/lease-template-attachments/`,
        method: 'post',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'PropertyLeaseAttachments', id },
        { type: 'PropertyLeaseAttachments', id: 'PARTIAL-LIST' },
      ],
    }),

    deleteDefaultLeaseTemplateAttachments: build.mutation<void, string | number>({
      query: id => ({
        url: `/api/property/lease-template-attachments/${id}/`,
        method: 'delete',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'PropertyLeaseAttachments', id },
        { type: 'PropertyLeaseAttachments', id: 'PARTIAL-LIST' },
      ],
    }),

    getDefaultRenewalTemplateAttachmentsList: build.query<Array<IPropertyAttachments>, string | number>({
      query: property_id => ({
        url: `/api/property/lease-renewal-attachments/?parent_property=${property_id}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'PropertyRenewalAttachments' as const, id })),
              { type: 'PropertyRenewalAttachments', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'PropertyRenewalAttachments', id: 'PARTIAL-LIST' }],
    }),

    createDefaultRenewalTemplateAttachments: build.mutation<IPropertyAttachments, Partial<IPropertyAttachments>>({
      query: data => ({
        url: `/api/property/lease-renewal-attachments/`,
        method: 'post',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'PropertyRenewalAttachments', id },
        { type: 'PropertyRenewalAttachments', id: 'PARTIAL-LIST' },
      ],
    }),

    deleteDefaultRenewalTemplateAttachments: build.mutation<void, string | number>({
      query: id => ({
        url: `/api/property/lease-renewal-attachments/${id}/`,
        method: 'delete',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'PropertyRenewalAttachments', id },
        { type: 'PropertyRenewalAttachments', id: 'PARTIAL-LIST' },
      ],
    }),

    getPropertyLateFeeInformation: build.query<ILateFeePolicy, number | string>({
      query: id => {
        return {
          url: `/api/property/late-fee-policies/${id}/`,
          method: 'GET',
        };
      },
      providesTags: (result, error, id) => [{ type: 'PropertyLateFeePolicy', id }],
    }),

    updatePropertyLateFeeInformation: build.mutation<ILateFeePolicy, Partial<ILateFeePolicy>>({
      query: data => {
        return {
          url: `/api/property/late-fee-policies/${data.id}/`,
          method: 'PATCH',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'PropertyLateFeePolicy', id },
        { type: 'PropertyLateFeePolicy', id: 'PARTIAL-LIST' },
      ],
    }),

    getPropertyAttachments: build.query<Array<IPropertyAttachments>, string | number>({
      query: id => {
        return {
          url: `/api/property/attachments/?parent_property=${id}`,
          method: 'GET',
        };
      },
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'PropertyAttachments' as const, id })),
              { type: 'PropertyAttachments', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'PropertyAttachments', id: 'PARTIAL-LIST' }],
    }),

    createPropertyAttachments: build.mutation<Partial<IPropertyAttachments>, Partial<IPropertyAttachments>>({
      query: data => {
        return {
          url: `/api/property/attachments/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'PropertyAttachments', id: 'PARTIAL-LIST' }],
    }),

    deletePropertyAttachments: build.mutation<void, number | string>({
      query: id => {
        return {
          url: `/api/property/attachments/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'PropertyAttachments', id },
        { type: 'PropertyAttachments', id: 'PARTIAL-LIST' },
      ],
    }),

    getPropertyPhotos: build.query<Array<IPhotoPropertyID>, string | number>({
      query: id => {
        return {
          url: `/api/property/photos/?parent_property=${id}`,
          method: 'GET',
        };
      },
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'PropertyPhotos' as const, id })),
              { type: 'PropertyPhotos', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'PropertyPhotos', id: 'PARTIAL-LIST' }],
    }),

    deletePropertyPhoto: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/property/photos/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'PropertyPhotos', id },
        { type: 'PropertyPhotos', id: 'PARTIAL-LIST' },
      ],
    }),

    addPropertyPhoto: build.mutation<IPhotoPropertyID, IPhotoPropertyID>({
      query: data => {
        return {
          url: `/api/property/photos/`,
          method: 'post',
          data,
        };
      },
      invalidatesTags: (result, error, { parent_property }) => [
        { type: 'Properties', id: parent_property },
        { type: 'PropertyPhotos', id: 'PARTIAL-LIST' },
      ],
    }),

    updatePropertyPhoto: build.mutation<IPhotoPropertyID, Partial<IPhotoPropertyID>>({
      query: data => ({
        url: `/api/property/photos/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'PropertyPhotos', id },
        { type: 'PropertyPhotos', id: 'PARTIAL-LIST' },
      ],
    }),

    getOwnersForProperty: build.query<Array<IPropertyOwner>, string | number>({
      query: id => ({
        url: `/api/property/owners/?parent_property=${id}`,
        method: 'get',
      }),
      transformResponse: (response: Array<IPropertyOwner>) => {
        response = response.map(result => ({
          ...result,
          owner_info: `${result.first_name} ${result.last_name}`,
        }));
        return response;
      },
      transformErrorResponse: baseQueryReturnValue => {
        return baseQueryReturnValue;
      },
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'PropertyOwners' as const, id })),
              { type: 'PropertyOwners', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'PropertyOwners', id: 'PARTIAL-LIST' }],
    }),

    createOwnersForProperty: build.mutation<IPropertyOwner, IPropertyOwner>({
      query: data => ({
        url: `/api/property/owners/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'PropertyOwners', id: 'PARTIAL-LIST' }],
    }),

    updatePropertyOwner: build.mutation<IPropertyOwner, Partial<IPropertyOwner>>({
      query: data => ({
        url: `/api/property/owners/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'PropertyOwners', id },
        { type: 'PropertyOwners', id: 'PARTIAL-LIST' },
      ],
    }),

    increaseRent: build.mutation<IIncreaseRentAPI, IIncreaseRentAPI>({
      query: data => ({
        url: `/api/property/properties/${data.parent_property}/rent-increase/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'IncreaseRent', id: 'PARTIAL-LIST' }],
    }),

    // Upcoming Activities

    getPropertyUpcomingActivities: build.query<Array<IPropertyUpcomingActivities>, string | number>({
      query: property_id => ({
        url: `/api/property/upcoming-activities/?parent_property=${property_id}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'PropertyUpcomingActivity' as const, id })),
              { type: 'PropertyUpcomingActivity', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'PropertyUpcomingActivity', id: 'PARTIAL-LIST' }],
    }),

    createPropertyUpcomingActivity: build.mutation<IPropertyUpcomingActivities, IPropertyUpcomingActivities>({
      query: data => ({
        url: `/api/property/upcoming-activities/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [
        { type: 'Calendar', id: 'PARTIAL-LIST' },
        { type: 'PropertyUpcomingActivity', id: 'PARTIAL-LIST' },
        { type: 'DashboardUpcomingActivity', id: 'PARTIAL-LIST' },
      ],
    }),

    updatePropertyUpcomingActivity: build.mutation<IPropertyUpcomingActivities, Partial<IPropertyUpcomingActivities>>({
      query: data => ({
        url: `/api/property/upcoming-activities/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'PropertyUpcomingActivity', id },
        { type: 'DashboardUpcomingActivity', id },
        { type: 'Calendar', id: 'PARTIAL-LIST' },
        { type: 'PropertyUpcomingActivity', id: 'PARTIAL-LIST' },
        { type: 'DashboardUpcomingActivity', id: 'PARTIAL-LIST' },
      ],
    }),

    // Utility Billing

    getPropertyUtilityBilling: build.query<Array<IUtilityBills>, string | number>({
      query: property_id => ({
        url: `/api/property/utility-billings/?parent_property=${property_id}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'PropertyUtilityBilling' as const, id })),
              { type: 'PropertyUtilityBilling', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'PropertyUtilityBilling', id: 'PARTIAL-LIST' }],
    }),

    createPropertyUtilityBilling: build.mutation<IUtilityBills, IUtilityBills>({
      query: data => ({
        url: `/api/property/utility-billings/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'PropertyUtilityBilling', id: 'PARTIAL-LIST' }],
    }),

    updatePropertyUtilityBilling: build.mutation<IUtilityBills, Partial<IUtilityBills>>({
      query: data => ({
        url: `/api/property/utility-billings/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'PropertyUtilityBilling', id },
        { type: 'PropertyUtilityBilling', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetPropertiesQuery,
  useGetListOfPropertiesQuery,

  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useGetPropertyByIdQuery,

  useUpdatePropertiesInformationMutation,

  useUpdatePropertyLateFeeInformationMutation,
  useGetPropertyLateFeeInformationQuery,

  useGetPropertyAttachmentsQuery,
  useCreatePropertyAttachmentsMutation,
  useDeletePropertyAttachmentsMutation,

  useGetPropertyPhotosQuery,
  useDeletePropertyPhotoMutation,
  useUpdatePropertyPhotoMutation,
  useAddPropertyPhotoMutation,

  useCreateOwnersForPropertyMutation,
  useGetOwnersForPropertyQuery,
  useUpdatePropertyOwnerMutation,

  useCreateDefaultLeaseTemplateAttachmentsMutation,
  useDeleteDefaultLeaseTemplateAttachmentsMutation,
  useGetDefaultLeaseTemplateAttachmentsListQuery,

  useCreateDefaultRenewalTemplateAttachmentsMutation,
  useDeleteDefaultRenewalTemplateAttachmentsMutation,
  useGetDefaultRenewalTemplateAttachmentsListQuery,

  useIncreaseRentMutation,

  useCreatePropertyUpcomingActivityMutation,
  useGetPropertyUtilityBillingQuery,

  useUpdatePropertyUpcomingActivityMutation,

  useCreatePropertyUtilityBillingMutation,
  useGetPropertyUpcomingActivitiesQuery,
  useUpdatePropertyUtilityBillingMutation,
} = propertiesApi;
