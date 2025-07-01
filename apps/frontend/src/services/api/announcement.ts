import { parseURLParams } from 'utils/functions';

import { IAnnouncementAPI, IAnnouncementAttachments, ISingleAnnouncement } from 'interfaces/ICommunication';
import { IFilterOptions, IPaginationData } from 'interfaces/IGeneral';
import { IUnitsAPI } from 'interfaces/IUnits';

import { api } from './base';

const announcementsAPI = api.injectEndpoints({
  endpoints: build => ({
    getAnnouncements: build.query<IPaginationData<ISingleAnnouncement>, IFilterOptions>({
      query: params => ({
        url: `/api/communication/announcement/?${parseURLParams(params)}`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'Announcements' as const, id })),
              { type: 'Announcements', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Announcements', id: 'PARTIAL-LIST' }],
    }),
    getAnnouncementById: build.query<ISingleAnnouncement, number>({
      query: id => ({
        url: `/api/communication/announcement/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'Announcements', id }],
    }),
    getUnitsForSelectedPropertyAnnouncement: build.query<IUnitsAPI[], { announcement_id: number; property_id: number }>(
      {
        query: data => ({
          url: `/api/communication/announcement/${data.announcement_id}/${data.property_id}/`,
          method: 'get',
        }),
        providesTags: results =>
          results
            ? [
                ...results.map(({ id }) => ({ type: 'AnnouncementUnits' as const, id })),
                { type: 'AnnouncementUnits', id: 'PARTIAL-LIST' },
              ]
            : [{ type: 'AnnouncementUnits', id: 'PARTIAL-LIST' }],
      }
    ),
    createAnnouncement: build.mutation<IAnnouncementAPI, IAnnouncementAPI>({
      query: data => ({
        url: `/api/communication/announcement/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'Announcements', id: 'PARTIAL-LIST' }],
    }),
    updateAnnouncement: build.mutation<IAnnouncementAPI, Partial<IAnnouncementAPI>>({
      query: data => ({
        url: `/api/communication/announcement/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Announcements', id },
        { type: 'Announcements', id: 'PARTIAL-LIST' },
      ],
    }),
    deleteAnnouncement: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/communication/announcement/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Announcements', id },
        { type: 'Announcements', id: 'PARTIAL-LIST' },
      ],
    }),
    getAnnouncementAttachments: build.query<IAnnouncementAttachments[], number>({
      query: announcement_id => ({
        url: `/api/communication/announcement/${announcement_id}/attachments/`,
        method: 'get',
      }),
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'AnnouncementsAttachments' as const, id })),
              { type: 'AnnouncementsAttachments', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'AnnouncementsAttachments', id: 'PARTIAL-LIST' }],
    }),
    createAnnouncementAttachments: build.mutation<IAnnouncementAttachments, IAnnouncementAttachments>({
      query: data => {
        return {
          url: `/api/communication/announcement-attachments/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'AnnouncementsAttachments', id: 'PARTIAL-LIST' }],
    }),
    deleteAnnouncementAttachments: build.mutation<void, IAnnouncementAttachments>({
      query: data => {
        return {
          url: `/api/communication/announcement-attachments/${data.id}/`,
          method: 'delete',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'AnnouncementsAttachments', id },
        { type: 'AnnouncementsAttachments', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAnnouncementsQuery,
  useGetAnnouncementByIdQuery,
  useGetUnitsForSelectedPropertyAnnouncementQuery,
  useUpdateAnnouncementMutation,
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useCreateAnnouncementAttachmentsMutation,
  useDeleteAnnouncementAttachmentsMutation,
  useGetAnnouncementAttachmentsQuery,
} = announcementsAPI;
