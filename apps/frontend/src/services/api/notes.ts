import { parseURLParams } from 'utils/functions';

import { INoteAPI, INoteAttachments, ISingleNote } from 'interfaces/ICommunication';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';

import { api } from './base';

const notesAPI = api.injectEndpoints({
  endpoints: build => ({
    getNotes: build.query<IPaginationData<ISingleNote>, IFilterOptions>({
      query: params => ({
        url: `/api/communication/note/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<ISingleNote>) => {
        response.results = response.results.map(result => ({
          ...result,
          property: {
            title: result.associated_property_name ?? '-',
            subtitle: result.associated_property_type_name ?? '-',
          },
          created: {
            name: result.created_by_full_name ?? '-',
            updated_at: result.created_at ?? '-',
          },
          modified: {
            name: result.modified_by_full_name ?? '-',
            updated_at: result.updated_at ?? '-',
          },
          tags_list: result.tag_names?.join(',') ?? '-',
        }));
        return response;
      },
      transformErrorResponse: baseQueryReturnValue => {
        return baseQueryReturnValue;
      },
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'Notes' as const, id })),
              { type: 'Notes', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Notes', id: 'PARTIAL-LIST' }],
    }),
    getNoteById: build.query<ISingleNote, number>({
      query: id => ({
        url: `/api/communication/note/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) =>
        result && result.attachments
          ? [
              ...result.attachments.map(({ id: attachment }) => ({
                type: 'NotesAttachments' as const,
                id: attachment,
              })),
              { type: 'NotesAttachments', id: 'PARTIAL-LIST' },
              { type: 'Notes', id },
            ]
          : [
              { type: 'Notes', id },
              { type: 'NotesAttachments', id: 'PARTIAL-LIST' },
            ],
    }),
    createNote: build.mutation<INoteAPI, INoteAPI>({
      query: data => ({
        url: `/api/communication/note/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'Notes', id: 'PARTIAL-LIST' }],
    }),
    updateNote: build.mutation<INoteAPI, Partial<INoteAPI>>({
      query: data => ({
        url: `/api/communication/note/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Notes', id },
        { type: 'Notes', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteNote: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/communication/note/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Notes', id },
        { type: 'Notes', id: 'PARTIAL-LIST' },
      ],
    }),
    getNoteAttachments: build.query<INoteAttachments[], number>({
      query: note_id => ({
        url: `/api/communication/note/${note_id}/attachments/`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'NotesAttachments' as const, id })),
              { type: 'NotesAttachments', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'NotesAttachments', id: 'PARTIAL-LIST' }],
    }),
    createNoteAttachments: build.mutation<INoteAttachments, INoteAttachments>({
      query: data => {
        return {
          url: `/api/communication/note-attachments/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'NotesAttachments', id: 'PARTIAL-LIST' }],
    }),
    deleteNoteAttachments: build.mutation<void, INoteAttachments>({
      query: data => {
        return {
          url: `/api/communication/note-attachments/${data.id}/`,
          method: 'delete',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'NotesAttachments', id },
        { type: 'NotesAttachments', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetNotesQuery,
  useGetNoteByIdQuery,
  useUpdateNoteMutation,
  useCreateNoteMutation,
  useDeleteNoteMutation,

  useCreateNoteAttachmentsMutation,
  useDeleteNoteAttachmentsMutation,
  useGetNoteAttachmentsQuery,
} = notesAPI;
