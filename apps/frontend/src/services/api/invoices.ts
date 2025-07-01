import { parseURLParams } from 'utils/functions';

import { IInvoicesAPI } from 'interfaces/IAccounting';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from './base';

interface InvoicesFilterValues extends IFilterOptions {
  unit?: string;
  arrear_of?: string;
  parent_property?: string;
  created_at?: string;
  due_date?: string;
}

const invoicesAPI = api.injectEndpoints({
  endpoints: build => ({
    getInvoices: build.query<IPaginationData<IInvoicesAPI>, InvoicesFilterValues>({
      query: params => ({
        url: `/api/accounting/invoice/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<IInvoicesAPI>) => {
        response.results = response.results.map(result => ({
          ...result,
          p_l_fee: result.is_late_fee_applicable
            ? result.status === 'NOT_VERIFIED' || result.status === 'VERIFIED'
              ? result.payed_late_fee
              : result.payable_late_fee
            : '-',
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
              ...response.results.map(({ id }) => ({ type: 'Invoices' as const, id })),
              { type: 'Invoices', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Invoices', id: 'PARTIAL-LIST' }],
    }),
    getListOfInvoices: build.query<Array<IInvoicesAPI>, InvoicesFilterValues>({
      query: params => ({
        url: `/api/accounting/invoice/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: Array<IInvoicesAPI>) => {
        response = response.map(result => ({
          ...result,
          p_l_fee: result.is_late_fee_applicable
            ? result.status === 'NOT_VERIFIED' || result.status === 'VERIFIED'
              ? result.payed_late_fee
              : result.payable_late_fee
            : '-',
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
          ? [...response.map(({ id }) => ({ type: 'Invoices' as const, id })), { type: 'Invoices', id: 'PARTIAL-LIST' }]
          : [{ type: 'Invoices', id: 'PARTIAL-LIST' }],
    }),
    getInvoiceById: build.query<IInvoicesAPI, number>({
      query: id => ({
        url: `/api/accounting/invoice/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'Invoices', id }],
    }),
    updateInvoiceStatus: build.mutation<IInvoicesAPI, Partial<IInvoicesAPI>>({
      query: data => ({
        url: `/api/accounting/invoice/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id, payment }) => [
        { type: 'Payments', id: payment },
        { type: 'Payments', id: 'PARTIAL-LIST' },

        { type: 'Invoices', id },
        { type: 'Invoices', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useGetListOfInvoicesQuery,
  useUpdateInvoiceStatusMutation,
} = invoicesAPI;
