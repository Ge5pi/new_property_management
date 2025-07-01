import { parseURLParams } from 'utils/functions';

import { ChargeStatus, IChargesAPI, IInvoicesAPI } from 'interfaces/IAccounting';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from '../base';

interface ChargesFilterValues extends IFilterOptions {
  created_at__lte?: string;
  created_at__gte?: string;
  status?: ChargeStatus | '';
  parent_property?: string;
  unit?: string;
  invoice?: string;
}

interface InvoicesFilterValues extends IFilterOptions {
  unit?: string;
  arrear_of?: string;
  parent_property?: string;
  created_at?: string;
  due_date?: string;
}

const accountsAPI = api.injectEndpoints({
  endpoints: build => ({
    getTenantCharges: build.query<IPaginationData<IChargesAPI>, ChargesFilterValues>({
      query: params => ({
        url: `/api/tenant/charges/?${parseURLParams(params)}`,
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
              ...response.results.map(({ id }) => ({ type: 'TenantCharges' as const, id })),
              { type: 'TenantCharges', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'TenantCharges', id: 'PARTIAL-LIST' }],
    }),

    getListOfTenantCharges: build.query<Array<IChargesAPI>, ChargesFilterValues>({
      query: params => ({
        url: `/api/tenant/charges/?${parseURLParams(params)}`,
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
          ? [
              ...response.map(({ id }) => ({ type: 'TenantCharges' as const, id })),
              { type: 'TenantCharges', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'TenantCharges', id: 'PARTIAL-LIST' }],
    }),
    getTenantChargesById: build.query<IChargesAPI, number>({
      query: id => ({
        url: `/api/tenant/charges/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'TenantCharges', id }],
    }),
    getTenantInvoices: build.query<IPaginationData<IInvoicesAPI>, InvoicesFilterValues>({
      query: params => ({
        url: `/api/tenant/invoices/?${parseURLParams(params)}`,
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
              ...response.results.map(({ id }) => ({ type: 'TenantInvoice' as const, id })),
              { type: 'TenantInvoice', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'TenantInvoice', id: 'PARTIAL-LIST' }],
    }),
    getListOfTenantInvoices: build.query<Array<IInvoicesAPI>, InvoicesFilterValues>({
      query: params => ({
        url: `/api/tenant/invoices/?${parseURLParams(params)}`,
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
          ? [
              ...response.map(({ id }) => ({ type: 'TenantInvoice' as const, id })),
              { type: 'TenantInvoice', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'TenantInvoice', id: 'PARTIAL-LIST' }],
    }),
    getTenantInvoiceById: build.query<IInvoicesAPI, number>({
      query: id => ({
        url: `/api/tenant/invoices/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'TenantInvoice', id }],
    }),
    markTenantInvoiceAsPaid: build.mutation<IInvoicesAPI, { invoice: number; payment: number }>({
      query: ({ invoice }) => ({
        url: `/api/tenant/invoices/${invoice}/mark-as-paid/`,
        method: 'get',
      }),
      invalidatesTags: (result, error, { invoice, payment: id }) => [
        { type: 'TenantPayments', id },
        { type: 'TenantPayments', id: 'PARTIAL-LIST' },

        { type: 'TenantInvoice', id: Number(invoice) },
        { type: 'TenantInvoice', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetTenantChargesByIdQuery,
  useGetTenantChargesQuery,

  useGetTenantInvoiceByIdQuery,
  useGetTenantInvoicesQuery,

  useGetListOfTenantChargesQuery,
  useGetListOfTenantInvoicesQuery,

  useMarkTenantInvoiceAsPaidMutation,
} = accountsAPI;
