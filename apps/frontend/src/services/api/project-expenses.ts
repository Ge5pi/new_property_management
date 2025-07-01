import { parseURLParams } from 'utils/functions';

import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';
import { IExpenseAttachments, IExpenses } from 'interfaces/IMaintenance';

import { api } from './base';

interface ExpensesFilterValues extends IFilterOptions {
  project: number;
}

const ProjectExpenses = api.injectEndpoints({
  endpoints: build => ({
    getExpenses: build.query<IPaginationData<IExpenses>, ExpensesFilterValues>({
      query: params => ({
        url: `/api/maintenance/project-expenses/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'Expenses' as const, id })),
              { type: 'Expenses', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Expenses', id: 'PARTIAL-LIST' }],
    }),
    getExpensesById: build.query<IExpenses, number>({
      query: id => ({
        url: `/api/maintenance/project-expenses/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'Expenses', id }],
    }),
    createExpenses: build.mutation<IExpenses, IExpenses>({
      query: data => ({
        url: `/api/maintenance/project-expenses/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'Expenses', id: 'PARTIAL-LIST' }],
    }),
    updateExpenses: build.mutation<IExpenses, Partial<IExpenses>>({
      query: data => ({
        url: `/api/maintenance/project-expenses/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Expenses', id },
        { type: 'Expenses', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteExpenses: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/maintenance/project-expenses/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Expenses', id },
        { type: 'Expenses', id: 'PARTIAL-LIST' },
      ],
    }),

    getExpensesAttachments: build.query<IExpenseAttachments[], number>({
      query: project_expense => ({
        url: `/api/maintenance/project-expense-attachments/?project_expense=${project_expense}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'ExpensesAttachments' as const, id })),
              { type: 'ExpensesAttachments', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'ExpensesAttachments', id: 'PARTIAL-LIST' }],
    }),
    createExpensesAttachments: build.mutation<IExpenseAttachments, IExpenseAttachments>({
      query: data => {
        return {
          url: `/api/maintenance/project-expense-attachments/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'ExpensesAttachments', id: 'PARTIAL-LIST' }],
    }),
    deleteExpensesAttachments: build.mutation<void, IExpenseAttachments>({
      query: data => {
        return {
          url: `/api/maintenance/project-expense-attachments/${data.id}/`,
          method: 'delete',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'ExpensesAttachments', id },
        { type: 'ExpensesAttachments', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetExpensesQuery,
  useGetExpensesByIdQuery,

  useCreateExpensesMutation,
  useUpdateExpensesMutation,
  useDeleteExpensesMutation,

  useCreateExpensesAttachmentsMutation,
  useDeleteExpensesAttachmentsMutation,
  useGetExpensesAttachmentsQuery,
} = ProjectExpenses;
