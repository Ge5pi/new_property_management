import { parseURLParams } from 'utils/functions';

import { ISingleContact } from 'interfaces/ICommunication';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from '../base';

const contactsAPI = api.injectEndpoints({
  endpoints: build => ({
    getTenantContacts: build.query<IPaginationData<ISingleContact>, IFilterOptions>({
      query: params => ({
        url: `/api/communication/contact/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'TenantContacts' as const, id })),
              { type: 'TenantContacts', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'TenantContacts', id: 'PARTIAL-LIST' }],
    }),
    getTenantContactById: build.query<ISingleContact, number>({
      query: id => ({
        url: `/api/communication/contact/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'TenantContacts', id }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTenantContactsQuery, useGetTenantContactByIdQuery } = contactsAPI;
