import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row as ReactTableRow } from 'react-table';

import { useDeleteContactMutation, useGetContactsQuery } from 'services/api/contacts';
import useResponse from 'services/api/hooks/useResponse';

import { Confirmation, PleaseWait } from 'components/alerts';
import { TableWithPagination } from 'components/table';
import MoreOptions from 'components/table/more-options';

import { SwalExtended } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { IContactAPI } from 'interfaces/ICommunication';

const Contacts = () => {
  // TODO : Update any to object shape type in column custom cell components.
  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      minWidth: 200,
    },
    {
      Header: 'Category',
      accessor: 'category_name',
      minWidth: 200,
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Primary number',
      accessor: 'primary_contact',
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: ContactsActions,
      disableSortBy: true,
      sticky: 'right',
      width: 100,
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
      useData={useGetContactsQuery}
      pageHeader={'Contacts'}
      newRecordButtonPermission={PERMISSIONS.COMMUNICATION}
      handleCreateNewRecord={() => redirect(`create`)}
      onRowClick={row => {
        if (row.original) {
          if ('id' in row.original) {
            const contact_id = row.original['id'];
            redirect(`details/${contact_id}`);
          }
        }
      }}
    />
  );
};

const ContactsActions = ({ row }: { row: ReactTableRow }) => {
  const { redirect } = useRedirect();
  const [
    deleteContactsByID,
    { isSuccess: isDeleteContactsSuccess, isError: isDeleteContactsError, error: deleteContactsError },
  ] = useDeleteContactMutation();

  useResponse({
    isSuccess: isDeleteContactsSuccess,
    successTitle: 'You have deleted a Contact',
    isError: isDeleteContactsError,
    error: deleteContactsError,
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
        deleteContactsByID(id).finally(() => {
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
            const row1 = row.original as IContactAPI;
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
            const row1 = row.original as IContactAPI;
            if (row1.id) {
              deleteRecord(row1.id);
            }
          },
        },
      ]}
    />
  );
};

export default Contacts;
