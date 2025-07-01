import { IBusinessInformation } from 'interfaces/ISettings';

import { api } from './base';

const systemPreferencesAPI = api.injectEndpoints({
  endpoints: build => ({
    getBusinessInformation: build.query<IBusinessInformation[], void>({
      query: () => ({
        url: `/api/system-preferences/business-information/`,
        method: 'GET',
      }),
      providesTags: [{ type: 'BusinessInformation', id: 'PARTIAL-LIST' }],
    }),
    createBusinessInformation: build.mutation<IBusinessInformation, IBusinessInformation>({
      query: data => ({
        url: `/api/system-preferences/business-information/`,
        method: 'POST',
        data,
      }),
      invalidatesTags: [{ type: 'RentalApplicants', id: 'PARTIAL-LIST' }],
    }),
    updateBusinessInformation: build.mutation<IBusinessInformation, Partial<IBusinessInformation>>({
      query: data => ({
        url: `/api/system-preferences/business-information/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'BusinessInformation', id },
        { type: 'BusinessInformation', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

export const {
  useGetBusinessInformationQuery,
  useCreateBusinessInformationMutation,
  useUpdateBusinessInformationMutation,
} = systemPreferencesAPI;
