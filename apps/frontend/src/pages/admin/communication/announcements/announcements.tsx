import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row as ReactTableRow } from 'react-table';

import { useDeleteAnnouncementMutation, useGetAnnouncementsQuery } from 'services/api/announcement';
import useResponse from 'services/api/hooks/useResponse';

import { Confirmation, PleaseWait } from 'components/alerts';
import { ItemDate } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';
import MoreOptions from 'components/table/more-options';

import { SwalExtended } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { IAnnouncementAPI } from 'interfaces/ICommunication';

const Announcements = () => {
  const columns = [
    {
      Header: 'Announcement Title',
      accessor: 'title',
      minWidth: 200,
    },
    {
      Header: 'Date',
      accessor: 'display_date',
      Cell: ItemDate,
    },
    {
      Header: 'Expiry',
      accessor: 'expiry_date',
      Cell: ItemDate,
    },
    {
      Header: () => <div className="text-center">Action</div>,
      accessor: 'actions',
      Cell: AnnouncementActions,
      disableSortBy: true,
      sticky: 'right',
      minWidth: 0,
    },
  ];

  const { redirect } = useRedirect();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const pageNumber = searchParams.get('page');
    searchParams.set('page', pageNumber ?? '1');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return (
    <TableWithPagination
      clickable
      columns={columns}
      useData={useGetAnnouncementsQuery}
      pageHeader={'Announcements'}
      newRecordButtonText="Create Announcement"
      newRecordButtonPermission={PERMISSIONS.COMMUNICATION}
      handleCreateNewRecord={() => redirect(`create`)}
      onRowClick={row => {
        if (row.original) {
          if ('id' in row.original) {
            const announcement_id = row.original['id'];
            redirect(`details/${announcement_id}`);
          }
        }
      }}
    />
  );
};

const AnnouncementActions = ({ row }: { row: ReactTableRow }) => {
  const { redirect } = useRedirect();
  const [
    deleteAnnouncementsByID,
    { isSuccess: isDeleteAnnouncementsSuccess, isError: isDeleteAnnouncementsError, error: deleteAnnouncementsError },
  ] = useDeleteAnnouncementMutation();

  useResponse({
    isSuccess: isDeleteAnnouncementsSuccess,
    successTitle: 'You have deleted an announcement',
    isError: isDeleteAnnouncementsError,
    error: deleteAnnouncementsError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      type: 'danger',
      description: 'Are you sure you want to delete this record?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deleteAnnouncementsByID(id).finally(() => {
          SwalExtended.close();
          setDisabled(false);
        });
      }
    });
  };

  return (
    <MoreOptions
      className="text-center"
      actions={[
        {
          disabled,
          text: 'Edit',
          permission: PERMISSIONS.COMMUNICATION,
          onClick: () => {
            const row1 = row.original as IAnnouncementAPI;
            if (row1.id) {
              redirect(`modify/${row1.id}`);
            }
          },
        },
        {
          disabled,
          text: 'Delete',
          permission: PERMISSIONS.COMMUNICATION,
          onClick: () => {
            const row1 = row.original as IAnnouncementAPI;
            if (row1.id) {
              deleteRecord(row1.id);
            }
          },
        },
      ]}
    />
  );
};

export default Announcements;
