import {
  IRentalAdditionalIncome,
  IRentalAttachments,
  IRentalDependents,
  IRentalEmergencyContact,
  IRentalFinancialInformation,
  IRentalPets,
  IRentalResidentialHistory,
  ISingleRentalForm,
} from 'interfaces/IApplications';

import { api } from './base';

const rentalApplicationsAPI = api.injectEndpoints({
  endpoints: build => ({
    getRentalApplicationsById: build.query<ISingleRentalForm, number>({
      query: id => ({
        url: `/api/lease/rental-application/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'RentalApplications', id }],
    }),
    createRentalApplications: build.mutation<ISingleRentalForm, ISingleRentalForm>({
      query: data => ({
        url: `/api/lease/rental-application/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'RentalApplications', id: 'PARTIAL-LIST' }, { type: 'DashboardGeneralStatistics' }],
    }),
    updateRentalApplications: build.mutation<ISingleRentalForm, Partial<ISingleRentalForm>>({
      query: data => ({
        url: `/api/lease/rental-application/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RentalApplications', id },
        { type: 'DashboardGeneralStatistics' },
        { type: 'RentalApplications', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteRentalApplication: build.mutation<number | string, string | number>({
      query: id => {
        return {
          url: `/api/lease/rental-application/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'RentalApplications', id },
        { type: 'RentalApplications', id: 'PARTIAL-LIST' },
      ],
    }),
    getRentalApplicationAttachments: build.query<Array<IRentalAttachments>, string | number>({
      query: id => {
        return {
          url: `/api/lease/rental-application-attachment/?rental_application=${id}`,
          method: 'GET',
        };
      },
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'RentalApplicationAttachments' as const, id })),
              { type: 'RentalApplicationAttachments', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'RentalApplicationAttachments', id: 'PARTIAL-LIST' }],
    }),
    createRentalApplicationAttachments: build.mutation<Partial<IRentalAttachments>, Partial<IRentalAttachments>>({
      query: data => {
        return {
          url: `/api/lease/rental-application-attachment/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'RentalApplicationAttachments', id: 'PARTIAL-LIST' }],
    }),
    deleteRentalApplicationAttachments: build.mutation<
      number | string,
      { id: number | string; rental_application: string | number }
    >({
      query: data => {
        return {
          url: `/api/lease/rental-application-attachment/${data.id}/`,
          method: 'delete',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'RentalApplicationAttachments', id },
        { type: 'RentalApplicationAttachments', id: 'PARTIAL-LIST' },
      ],
    }),

    getRentalHistory: build.query<Array<IRentalResidentialHistory>, string | number>({
      query: id => {
        return {
          url: `/api/lease/rental-application-resident-history/?rental_application=${id}`,
          method: 'GET',
        };
      },
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'RentalHistory' as const, id })),
              { type: 'RentalHistory', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'RentalHistory', id: 'PARTIAL-LIST' }],
    }),
    createRentalHistory: build.mutation<Partial<IRentalResidentialHistory>, Partial<IRentalResidentialHistory>>({
      query: data => {
        return {
          url: `/api/lease/rental-application-resident-history/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'RentalHistory', id: 'PARTIAL-LIST' }],
    }),
    updateRentalHistory: build.mutation<Partial<IRentalResidentialHistory>, Partial<IRentalResidentialHistory>>({
      query: data => {
        return {
          url: `/api/lease/rental-application-resident-history/${data.id}/`,
          method: 'PATCH',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'RentalHistory', id },
        { type: 'RentalHistory', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteRentalHistory: build.mutation<number | string, { id: number | string; rental_application: string | number }>({
      query: data => {
        return {
          url: `/api/lease/rental-application-resident-history/${data.id}/`,
          method: 'delete',
          data,
        };
      },
    }),

    getFinancialInformation: build.query<Array<IRentalFinancialInformation>, string | number>({
      query: id => {
        return {
          url: `/api/lease/rental-application-financial-information/?rental_application=${id}`,
          method: 'GET',
        };
      },
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'RentalFinancial' as const, id })),
              { type: 'RentalFinancial', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'RentalFinancial', id: 'PARTIAL-LIST' }],
    }),
    createFinancialInformation: build.mutation<
      Partial<IRentalFinancialInformation>,
      Partial<IRentalFinancialInformation>
    >({
      query: data => {
        return {
          url: `/api/lease/rental-application-financial-information/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'RentalFinancial', id: 'PARTIAL-LIST' }],
    }),
    updateFinancialInformation: build.mutation<
      Partial<IRentalFinancialInformation>,
      Partial<IRentalFinancialInformation>
    >({
      query: data => {
        return {
          url: `/api/lease/rental-application-financial-information/${data.id}/`,
          method: 'PATCH',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'RentalFinancial', id },
        { type: 'RentalFinancial', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteFinancialInformation: build.mutation<
      number | string,
      { id: number | string; rental_application: string | number }
    >({
      query: data => {
        return {
          url: `/api/lease/rental-application-financial-information/${data.id}/`,
          method: 'delete',
          data,
        };
      },
    }),

    getAdditionalIncome: build.query<Array<IRentalAdditionalIncome>, string | number>({
      query: id => {
        return {
          url: `/api/lease/rental-application-additional-income/?rental_application=${id}`,
          method: 'GET',
        };
      },
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'RentalAdditionalIncome' as const, id })),
              { type: 'RentalAdditionalIncome', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'RentalAdditionalIncome', id: 'PARTIAL-LIST' }],
    }),
    createAdditionalIncome: build.mutation<Partial<IRentalAdditionalIncome>, Partial<IRentalAdditionalIncome>>({
      query: data => {
        return {
          url: `/api/lease/rental-application-additional-income/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'RentalAdditionalIncome', id: 'PARTIAL-LIST' }],
    }),
    updateAdditionalIncome: build.mutation<Partial<IRentalAdditionalIncome>, Partial<IRentalAdditionalIncome>>({
      query: data => {
        return {
          url: `/api/lease/rental-application-additional-income/${data.id}/`,
          method: 'PATCH',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'RentalAdditionalIncome', id },
        { type: 'RentalAdditionalIncome', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteAdditionalIncome: build.mutation<
      number | string,
      { id: number | string; rental_application: string | number }
    >({
      query: data => {
        return {
          url: `/api/lease/rental-application-additional-income/${data.id}/`,
          method: 'delete',
          data,
        };
      },
    }),

    getDependent: build.query<Array<IRentalDependents>, string | number>({
      query: id => {
        return {
          url: `/api/lease/rental-application-dependent/?rental_application=${id}`,
          method: 'GET',
        };
      },
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'RentalDependents' as const, id })),
              { type: 'RentalDependents', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'RentalDependents', id: 'PARTIAL-LIST' }],
    }),
    createDependent: build.mutation<Partial<IRentalDependents>, Partial<IRentalDependents>>({
      query: data => {
        return {
          url: `/api/lease/rental-application-dependent/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'RentalDependents', id: 'PARTIAL-LIST' }],
    }),
    updateDependent: build.mutation<Partial<IRentalDependents>, Partial<IRentalDependents>>({
      query: data => {
        return {
          url: `/api/lease/rental-application-dependent/${data.id}/`,
          method: 'PATCH',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'RentalDependents', id },
        { type: 'RentalDependents', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteDependent: build.mutation<number | string, { id: number | string; rental_application: string | number }>({
      query: data => {
        return {
          url: `/api/lease/rental-application-dependent/${data.id}/`,
          method: 'delete',
          data,
        };
      },
    }),

    getPet: build.query<Array<IRentalPets>, string | number>({
      query: id => {
        return {
          url: `/api/lease/rental-application-pet/?rental_application=${id}`,
          method: 'GET',
        };
      },
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'RentalDependentsPets' as const, id })),
              { type: 'RentalDependentsPets', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'RentalDependentsPets', id: 'PARTIAL-LIST' }],
    }),
    createPet: build.mutation<Partial<IRentalPets>, Partial<IRentalPets>>({
      query: data => {
        return {
          url: `/api/lease/rental-application-pet/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'RentalDependentsPets', id: 'PARTIAL-LIST' }],
    }),
    updatePet: build.mutation<Partial<IRentalPets>, Partial<IRentalPets>>({
      query: data => {
        return {
          url: `/api/lease/rental-application-pet/${data.id}/`,
          method: 'PATCH',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'RentalDependentsPets', id },
        { type: 'RentalDependentsPets', id: 'PARTIAL-LIST' },
      ],
    }),
    deletePet: build.mutation<number | string, { id: number | string; rental_application: string | number }>({
      query: data => {
        return {
          url: `/api/lease/rental-application-pet/${data.id}/`,
          method: 'delete',
          data,
        };
      },
    }),

    getEmergencyContact: build.query<Array<IRentalEmergencyContact>, string | number>({
      query: id => {
        return {
          url: `/api/lease/rental-application-emergency-contact/?rental_application=${id}`,
          method: 'GET',
        };
      },
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'RentalEmergencyContact' as const, id })),
              { type: 'RentalEmergencyContact', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'RentalEmergencyContact', id: 'PARTIAL-LIST' }],
    }),
    createEmergencyContact: build.mutation<Partial<IRentalEmergencyContact>, Partial<IRentalEmergencyContact>>({
      query: data => {
        return {
          url: `/api/lease/rental-application-emergency-contact/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'RentalEmergencyContact', id: 'PARTIAL-LIST' }],
    }),
    updateEmergencyContact: build.mutation<Partial<IRentalEmergencyContact>, Partial<IRentalEmergencyContact>>({
      query: data => {
        return {
          url: `/api/lease/rental-application-emergency-contact/${data.id}/`,
          method: 'PATCH',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'RentalEmergencyContact', id },
        { type: 'RentalEmergencyContact', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteEmergencyContact: build.mutation<
      number | string,
      { id: number | string; rental_application: string | number }
    >({
      query: data => {
        return {
          url: `/api/lease/rental-application-emergency-contact/${data.id}/`,
          method: 'delete',
          data,
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetRentalApplicationsByIdQuery,
  useUpdateRentalApplicationsMutation,
  useCreateRentalApplicationsMutation,
  useDeleteRentalApplicationMutation,
  useCreateRentalApplicationAttachmentsMutation,
  useDeleteRentalApplicationAttachmentsMutation,
  useGetRentalApplicationAttachmentsQuery,

  useCreateAdditionalIncomeMutation,
  useCreateDependentMutation,
  useCreateEmergencyContactMutation,
  useCreateFinancialInformationMutation,
  useCreatePetMutation,
  useCreateRentalHistoryMutation,

  useDeleteAdditionalIncomeMutation,
  useDeleteDependentMutation,
  useDeleteEmergencyContactMutation,
  useDeleteFinancialInformationMutation,
  useDeletePetMutation,
  useDeleteRentalHistoryMutation,

  useGetAdditionalIncomeQuery,
  useGetDependentQuery,
  useGetEmergencyContactQuery,
  useGetFinancialInformationQuery,
  useGetPetQuery,
  useGetRentalHistoryQuery,

  useUpdateAdditionalIncomeMutation,
  useUpdateDependentMutation,
  useUpdateEmergencyContactMutation,
  useUpdateFinancialInformationMutation,
  useUpdatePetMutation,
  useUpdateRentalHistoryMutation,
} = rentalApplicationsAPI;
