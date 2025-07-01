import { parseURLParams } from 'utils/functions';

import { ChargeStatus, ITenantPaymentAttachments, ITenantPayments } from 'interfaces/IAccounting';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from './base';

interface PaymentsFilterValues extends IFilterOptions {
  payment_date__lte?: string;
  payment_date__gte?: string;
  invoice__status?: ChargeStatus | '';
  invoice?: string;
}

const PaymentsAPIs = api.injectEndpoints({
  endpoints: build => ({
    getPayments: build.query<IPaginationData<ITenantPayments>, PaymentsFilterValues>({
      query: params => ({
        url: `/api/accounting/payment/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<ITenantPayments>) => {
        response.results = response.results.map(result => ({
          ...result,
          status_with_obj: {
            displayValue: result.get_status_display,
            status: result.status,
            className: {
              UNPAID: 'text-warning',
              NOT_VERIFIED: 'text-info',
              VERIFIED: 'text-success',
              REJECTED: 'text-danger',
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
              ...response.results.map(({ id }) => ({ type: 'Payments' as const, id })),
              { type: 'Payments', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Payments', id: 'PARTIAL-LIST' }],
    }),
    getPaymentsById: build.query<ITenantPayments, number>({
      query: id => ({
        url: `/api/accounting/payment/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'Payments', id }],
    }),
    createPayments: build.mutation<ITenantPayments, ITenantPayments>({
      query: data => ({
        url: `/api/accounting/payment/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [
        { type: 'Payments', id: 'PARTIAL-LIST' },
        { type: 'Invoices', id: 'PARTIAL-LIST' },
      ],
    }),
    updatePayments: build.mutation<ITenantPayments, Partial<ITenantPayments>>({
      query: data => ({
        url: `/api/accounting/payment/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id, invoice }) => [
        { type: 'Payments', id },
        { type: 'Payments', id: 'PARTIAL-LIST' },

        { type: 'Invoices', id: Number(invoice) },
        { type: 'Invoices', id: 'PARTIAL-LIST' },
      ],
    }),

    getPaymentsAttachments: build.query<ITenantPaymentAttachments[], number>({
      query: payment => ({
        url: `/api/accounting/payment-attachment/?payment=${payment}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'PaymentsAttachments' as const, id })),
              { type: 'PaymentsAttachments', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'PaymentsAttachments', id: 'PARTIAL-LIST' }],
    }),
    createPaymentsAttachments: build.mutation<ITenantPaymentAttachments, ITenantPaymentAttachments>({
      query: data => {
        return {
          url: `/api/accounting/payment-attachment/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'PaymentsAttachments', id: 'PARTIAL-LIST' }],
    }),
    deletePaymentsAttachments: build.mutation<void, ITenantPaymentAttachments>({
      query: data => {
        return {
          url: `/api/accounting/payment-attachment/${data.id}/`,
          method: 'delete',
          data,
        };
      },
      invalidatesTags: () => [{ type: 'PaymentsAttachments', id: 'PARTIAL-LIST' }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetPaymentsQuery,
  useGetPaymentsByIdQuery,

  useCreatePaymentsMutation,
  useUpdatePaymentsMutation,

  useCreatePaymentsAttachmentsMutation,
  useDeletePaymentsAttachmentsMutation,
  useGetPaymentsAttachmentsQuery,
} = PaymentsAPIs;
