import { parseURLParams } from 'utils/functions';

import { IContactAPI, ISingleContact } from 'interfaces/ICommunication';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from './base';

const contactsAPI = api.injectEndpoints({
  endpoints: build => ({
    getContacts: build.query<IPaginationData<ISingleContact>, IFilterOptions>({
      query: params => ({
        url: `/api/communication/contact/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'Contacts' as const, id })),
              { type: 'Contacts', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Contacts', id: 'PARTIAL-LIST' }],
    }),
    getContactById: build.query<ISingleContact, number>({
      query: id => ({
        url: `/api/communication/contact/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'Contacts', id }],
    }),
    createContact: build.mutation<IContactAPI, IContactAPI>({
      query: data => ({
        url: `/api/communication/contact/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'Contacts', id: 'PARTIAL-LIST' }],
    }),
    updateContact: build.mutation<IContactAPI, Partial<IContactAPI>>({
      query: data => ({
        url: `/api/communication/contact/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Contacts', id },
        { type: 'Contacts', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteContact: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/communication/contact/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Contacts', id },
        { type: 'Contacts', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetContactsQuery,
  useGetContactByIdQuery,
  useUpdateContactMutation,
  useCreateContactMutation,
  useDeleteContactMutation,
} = contactsAPI;
