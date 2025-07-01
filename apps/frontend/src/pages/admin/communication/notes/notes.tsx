import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row as ReactTableRow } from 'react-table';

import useResponse from 'services/api/hooks/useResponse';
import { useDeleteNoteMutation, useGetNotesQuery } from 'services/api/notes';

import { Confirmation, PleaseWait } from 'components/alerts';
import { ItemName } from 'components/custom-cell';
import ItemUpdatedBy from 'components/custom-cell/item-updated-by';
import { TableWithPagination } from 'components/table';
import MoreOptions from 'components/table/more-options';

import { SwalExtended } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { INoteAPI } from 'interfaces/ICommunication';

const Notes = () => {
  // TODO : Update any to object shape type in column custom cell components.
  const columns = [
    {
      Header: 'Title',
      accessor: 'title',
      minWidth: 300,
    },
    {
      Header: 'Related to',
      accessor: 'property',
      Cell: ItemName,
      minWidth: 200,
    },
    {
      Header: 'Uploaded by',
      accessor: 'created',
      Cell: ItemUpdatedBy,
      minWidth: 200,
    },
    {
      Header: 'Modified by',
      accessor: 'modified',
      Cell: ItemUpdatedBy,
      minWidth: 200,
    },
    {
      Header: 'Tags',
      accessor: 'tags_list',
      minWidth: 200,
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: NotesActions,
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
      pageHeader={'Notes'}
      useData={useGetNotesQuery}
      newRecordButtonPermission={PERMISSIONS.COMMUNICATION}
      handleCreateNewRecord={() => redirect(`create`)}
      onRowClick={row => {
        if (row.original) {
          if ('id' in row.original) {
            const note = row.original['id'];
            redirect(`details/${note}`);
          }
        }
      }}
    />
  );
};

const NotesActions = ({ row }: { row: ReactTableRow }) => {
  const { redirect } = useRedirect();
  const [deleteNotesByID, { isSuccess: isDeleteNotesSuccess, isError: isDeleteNotesError, error: deleteNotesError }] =
    useDeleteNoteMutation();

  useResponse({
    isSuccess: isDeleteNotesSuccess,
    successTitle: 'You have deleted a Note',
    isError: isDeleteNotesError,
    error: deleteNotesError,
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
        deleteNotesByID(id).finally(() => {
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
            const row1 = row.original as INoteAPI;
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
            const row1 = row.original as INoteAPI;
            if (row1.id) {
              deleteRecord(row1.id);
            }
          },
        },
      ]}
    />
  );
};

export default Notes;
