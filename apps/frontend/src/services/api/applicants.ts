import { parseURLParams } from 'utils/functions';

import { IApplicantForm } from 'interfaces/IApplications';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from './base';

interface ApplicantFilterValues extends IFilterOptions {
  unit__parent_property?: string;
  unit?: string;
}

const rentalApplicantsAPI = api.injectEndpoints({
  endpoints: build => ({
    getRentalApplicants: build.query<IPaginationData<IApplicantForm>, ApplicantFilterValues>({
      query: params => ({
        url: `/api/lease/applicant/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<IApplicantForm>) => {
        response.results = response.results.map(result => ({
          ...result,
          property: {
            title: result.property_name,
            subtitle: result.unit_name,
          },
          full_name: `${result.first_name} ${result.last_name}`,
          status_with_obj: {
            valueType: 'progress',
            displayValue: Number(result.status_percentage),
            status: Number(result.status_percentage) <= 100 ? 'in complete' : 'completed',
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
              ...response.results.map(({ id }) => ({ type: 'RentalApplicants' as const, id })),
              { type: 'RentalApplicants', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'RentalApplicants', id: 'PARTIAL-LIST' }],
    }),
    getRentalApplicantById: build.query<IApplicantForm, number>({
      query: id => ({
        url: `/api/lease/applicant/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'RentalApplicants', id }],
    }),
    createRentalApplicant: build.mutation<IApplicantForm, IApplicantForm>({
      query: data => ({
        url: `/api/lease/applicant/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'RentalApplicants', id: 'PARTIAL-LIST' }],
    }),
    updateRentalApplicant: build.mutation<IApplicantForm, Partial<IApplicantForm>>({
      query: data => ({
        url: `/api/lease/applicant/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RentalApplicants', id },
        { type: 'RentalApplicants', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteRentalApplicant: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/lease/applicant/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'RentalApplicants', id },
        { type: 'RentalApplicants', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetRentalApplicantsQuery,
  useGetRentalApplicantByIdQuery,
  useUpdateRentalApplicantMutation,
  useCreateRentalApplicantMutation,
  useDeleteRentalApplicantMutation,
} = rentalApplicantsAPI;
