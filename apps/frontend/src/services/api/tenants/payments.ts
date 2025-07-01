import { parseURLParams } from 'utils/functions';

import { ChargeStatus, ITenantPayments } from 'interfaces/IAccounting';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from '../base';

interface PaymentsFilterValues extends IFilterOptions {
  payment_date__lte?: string;
  payment_date__gte?: string;
  invoice__status?: ChargeStatus | '';
  invoice?: string;
}

const tenantPaymentsAPIs = api.injectEndpoints({
  endpoints: build => ({
    getTenantPayments: build.query<IPaginationData<ITenantPayments>, PaymentsFilterValues>({
      query: params => ({
        url: `/api/tenant/payments/?${parseURLParams(params)}`,
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
              ...response.results.map(({ id }) => ({ type: 'TenantPayments' as const, id })),
              { type: 'TenantPayments', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'TenantPayments', id: 'PARTIAL-LIST' }],
    }),
    getTenantPaymentsById: build.query<ITenantPayments, number>({
      query: id => ({
        url: `/api/tenant/payments/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'TenantPayments', id }],
    }),
    createTenantPayments: build.mutation<ITenantPayments, ITenantPayments>({
      query: data => ({
        url: `/api/tenant/payments/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [
        { type: 'TenantPayments', id: 'PARTIAL-LIST' },
        { type: 'TenantInvoice', id: 'PARTIAL-LIST' },
      ],
    }),
    updateTenantPayments: build.mutation<ITenantPayments, Partial<ITenantPayments>>({
      query: data => ({
        url: `/api/tenant/payments/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id, invoice }) => [
        { type: 'TenantPayments', id },
        { type: 'TenantPayments', id: 'PARTIAL-LIST' },

        { type: 'TenantInvoice', id: Number(invoice) },
        { type: 'TenantInvoice', id: 'PARTIAL-LIST' },
      ],
    }),
    createTenantPaymentsIntent: build.mutation<{ client_secret: string }, number>({
      query: invoice_id => ({
        url: `/api/tenant/payment-intents-for-invoice/`,
        method: 'post',
        data: { invoice: invoice_id },
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetTenantPaymentsByIdQuery,
  useGetTenantPaymentsQuery,

  useCreateTenantPaymentsMutation,
  useUpdateTenantPaymentsMutation,

  useCreateTenantPaymentsIntentMutation,
} = tenantPaymentsAPIs;
