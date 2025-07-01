import { parseURLParams } from 'utils/functions';

import { GeneralLedgerAccountType, IGeneralLedgerAccount, IGeneralLedgerTransaction } from 'interfaces/IAccounting';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from './base';

interface GLTransactionFilter extends IFilterOptions {
  gl_account__account_type?: GeneralLedgerAccountType;
}

const generalLedgerAPIs = api.injectEndpoints({
  endpoints: build => ({
    getGeneralLedgerAccounts: build.query<IPaginationData<IGeneralLedgerAccount>, IFilterOptions>({
      query: params => ({
        url: `/api/accounting/general-ledger-account/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'GeneralLedgerAccounts' as const, id })),
              { type: 'GeneralLedgerAccounts', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'GeneralLedgerAccounts', id: 'PARTIAL-LIST' }],
    }),
    getGeneralLedgerAccountById: build.query<IGeneralLedgerAccount, number>({
      query: id => ({
        url: `/api/accounting/general-ledger-account/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'GeneralLedgerAccounts', id }],
    }),
    getGeneralLedgerTransactions: build.query<IPaginationData<IGeneralLedgerTransaction>, GLTransactionFilter>({
      query: params => ({
        url: `/api/accounting/general-ledger-transaction/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'GeneralLedgerTransactions' as const, id })),
              { type: 'GeneralLedgerTransactions', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'GeneralLedgerTransactions', id: 'PARTIAL-LIST' }],
    }),
    getGeneralLedgerTransactionById: build.query<IGeneralLedgerTransaction, number>({
      query: id => ({
        url: `/api/accounting/general-ledger-transaction/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'GeneralLedgerTransactions', id }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetGeneralLedgerAccountsQuery,
  useGetGeneralLedgerAccountByIdQuery,

  useGetGeneralLedgerTransactionsQuery,
  useGetGeneralLedgerTransactionByIdQuery,
} = generalLedgerAPIs;
