import { parseURLParams } from 'utils/functions';

import { IBankAccountAttachments, IBankAccounts } from 'interfaces/IAccounting';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from './base';

const bankAccountAPIs = api.injectEndpoints({
  endpoints: build => ({
    getBankAccounts: build.query<IPaginationData<IBankAccounts>, IFilterOptions>({
      query: params => ({
        url: `/api/accounting/account/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'BankAccounts' as const, id })),
              { type: 'BankAccounts', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'BankAccounts', id: 'PARTIAL-LIST' }],
    }),
    getBankAccountById: build.query<IBankAccounts, number>({
      query: id => ({
        url: `/api/accounting/account/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [
        { type: 'BankAccounts', id },
        { type: 'BankAccountsAttachments', id: 'PARTIAL-LIST' },
      ],
    }),
    createBankAccount: build.mutation<IBankAccounts, IBankAccounts>({
      query: data => ({
        url: `/api/accounting/account/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'BankAccounts', id: 'PARTIAL-LIST' }],
    }),
    updateBankAccount: build.mutation<IBankAccounts, Partial<IBankAccounts>>({
      query: data => ({
        url: `/api/accounting/account/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'BankAccounts', id },
        { type: 'BankAccounts', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteBankAccount: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/accounting/account/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'BankAccounts', id },
        { type: 'BankAccounts', id: 'PARTIAL-LIST' },
      ],
    }),
    getBankAccountAttachments: build.query<Array<IBankAccountAttachments>, string | number>({
      query: account_id => {
        return {
          url: `/api/accounting/account-attachment/?account=${account_id}`,
          method: 'GET',
        };
      },
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'BankAccountsAttachments' as const, id })),
              { type: 'BankAccountsAttachments', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'BankAccountsAttachments', id: 'PARTIAL-LIST' }],
    }),
    createBankAccountAttachments: build.mutation<IBankAccountAttachments, IBankAccountAttachments>({
      query: data => {
        return {
          url: `/api/accounting/account-attachment/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'BankAccountsAttachments', id: 'PARTIAL-LIST' }],
    }),
    deleteBankAccountAttachments: build.mutation<void, IBankAccountAttachments>({
      query: data => {
        return {
          url: `/api/accounting/account-attachment/${data.id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: () => [{ type: 'BankAccountsAttachments', id: 'PARTIAL-LIST' }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetBankAccountsQuery,

  useGetBankAccountByIdQuery,
  useUpdateBankAccountMutation,
  useCreateBankAccountMutation,
  useDeleteBankAccountMutation,

  useGetBankAccountAttachmentsQuery,
  useCreateBankAccountAttachmentsMutation,
  useDeleteBankAccountAttachmentsMutation,
} = bankAccountAPIs;
