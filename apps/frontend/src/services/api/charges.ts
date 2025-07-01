import { parseURLParams } from 'utils/functions';

import { ChargeStatus, IChargeAttachments, IChargesAPI } from 'interfaces/IAccounting';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from './base';

interface ChargesFilterValues extends IFilterOptions {
  created_at__lte?: string;
  created_at__gte?: string;
  status?: ChargeStatus | '';
  parent_property?: string;
  unit?: string;
  invoice?: string;
}

const chargesAPI = api.injectEndpoints({
  endpoints: build => ({
    getCharges: build.query<IPaginationData<IChargesAPI>, ChargesFilterValues>({
      query: params => ({
        url: `/api/accounting/charge/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<IChargesAPI>) => {
        response.results = response.results.map(result => ({
          ...result,
          tenant_name: `${result.tenant_first_name} ${result.tenant_last_name}`,
          charge_status: {
            displayValue: result.get_status_display ?? result.get_charge_type_display,
            status: result.status ?? result.charge_type,
            className: {
              UNPAID: 'text-warning',
              NOT_VERIFIED: 'text-info',
              VERIFIED: 'text-success',
              REJECTED: 'text-danger',
            },
          },
          unit_charge_detail: {
            amount: result.amount,
            title: result.title,
          },
          property: {
            title: result.property_name,
            subtitle: result.unit_name,
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
              ...response.results.map(({ id }) => ({ type: 'Charges' as const, id })),
              { type: 'Charges', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Charges', id: 'PARTIAL-LIST' }],
    }),
    getListOfCharges: build.query<Array<IChargesAPI>, ChargesFilterValues>({
      query: params => ({
        url: `/api/accounting/charge/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: Array<IChargesAPI>) => {
        response = response.map(result => ({
          ...result,
          tenant_name: `${result.tenant_first_name} ${result.tenant_last_name}`,
          charge_status: {
            displayValue: result.get_status_display ?? result.get_charge_type_display,
            status: result.status ?? result.charge_type,
            className: {
              UNPAID: 'text-warning',
              NOT_VERIFIED: 'text-info',
              VERIFIED: 'text-success',
              REJECTED: 'text-danger',
            },
          },
          unit_charge_detail: {
            amount: result.amount,
            title: result.title,
          },
          property: {
            title: result.property_name,
            subtitle: result.unit_name,
          },
        }));
        return response;
      },
      transformErrorResponse: baseQueryReturnValue => {
        return baseQueryReturnValue;
      },
      providesTags: response =>
        response
          ? [...response.map(({ id }) => ({ type: 'Charges' as const, id })), { type: 'Charges', id: 'PARTIAL-LIST' }]
          : [{ type: 'Charges', id: 'PARTIAL-LIST' }],
    }),
    getChargeById: build.query<IChargesAPI, number>({
      query: id => ({
        url: `/api/accounting/charge/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [
        { type: 'Charges', id },
        { type: 'ChargesAttachments', id: 'PARTIAL-LIST' },
      ],
    }),
    createCharge: build.mutation<IChargesAPI, IChargesAPI>({
      query: data => ({
        url: `/api/accounting/charge/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'Charges', id: 'PARTIAL-LIST' }],
    }),
    updateCharge: build.mutation<IChargesAPI, Partial<IChargesAPI>>({
      query: data => ({
        url: `/api/accounting/charge/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Charges', id },
        { type: 'Charges', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteCharge: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/accounting/charge/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Charges', id },
        { type: 'Charges', id: 'PARTIAL-LIST' },
      ],
    }),
    getChargeAttachments: build.query<Array<IChargeAttachments>, string | number>({
      query: charge_id => {
        return {
          url: `/api/accounting/charge/${charge_id}/attachments/`,
          method: 'GET',
        };
      },
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'ChargesAttachments' as const, id })),
              { type: 'ChargesAttachments', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'ChargesAttachments', id: 'PARTIAL-LIST' }],
    }),
    createChargeAttachments: build.mutation<Partial<IChargeAttachments>, Partial<IChargeAttachments>>({
      query: data => {
        return {
          url: `/api/accounting/charge-attachment/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'ChargesAttachments', id: 'PARTIAL-LIST' }],
    }),
    deleteChargeAttachments: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/accounting/charge-attachment/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'ChargesAttachments', id },
        { type: 'ChargesAttachments', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetChargesQuery,
  useGetListOfChargesQuery,

  useGetChargeByIdQuery,
  useUpdateChargeMutation,
  useCreateChargeMutation,
  useDeleteChargeMutation,

  useGetChargeAttachmentsQuery,
  useCreateChargeAttachmentsMutation,
  useDeleteChargeAttachmentsMutation,
} = chargesAPI;
