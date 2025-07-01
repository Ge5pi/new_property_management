import { useState } from 'react';
import { Row as ReactTableRow } from 'react-table';

import useResponse from 'services/api/hooks/useResponse';
import { useDeleteRoleMutation, useGetRolesQuery } from 'services/api/users';

import { Confirmation, PleaseWait } from 'components/alerts';
import { TableWithPagination } from 'components/table';
import RowActions from 'components/table/row-actions';

import { SwalExtended } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { IRoles } from 'interfaces/IAvatar';

import UsersRolesHeader from './components/user-roles-navigation';

const Roles = () => {
  const { redirect } = useRedirect();
  const [deleteRoleByID, { isSuccess: isDeleteRoleSuccess, isError: isDeleteRoleError, error: deleteRoleError }] =
    useDeleteRoleMutation();

  useResponse({
    isSuccess: isDeleteRoleSuccess,
    successTitle: 'You have deleted a role',
    isError: isDeleteRoleError,
    error: deleteRoleError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      type: 'danger',
      description: `Are you sure you want to delete this record?\nThis may result in unexpected behavior as this record may linked with user(s)`,
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deleteRoleByID(id).finally(() => {
          SwalExtended.close();
          setDisabled(false);
        });
      }
    });
  };

  const columns = [
    {
      Header: 'Role name',
      accessor: 'name',
      disableSortBy: true,
    },
    {
      Header: 'Role description',
      accessor: 'description',
      disableSortBy: true,
    },
    {
      Header: 'No. of users',
      accessor: 'users_count',
      disableSortBy: true,
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: ({ row }: { row: ReactTableRow }) => {
        return (
          <RowActions
            className="action-btns justify-content-center"
            actions={[
              {
                disabled,
                icon: 'delete',
                permission: PERMISSIONS.ADMIN,
                onClick: () => deleteRecord(Number((row.original as IRoles).id)),
              },
              {
                icon: 'edit',
                permission: PERMISSIONS.ADMIN,
                onClick: () => redirect(`modify/${(row.original as IRoles).id}`),
              },
            ]}
          />
        );
      },
      disableSortBy: true,
      sticky: 'right',
      width: 100,
    },
  ];

  return (
    <TableWithPagination
      columns={columns}
      useData={useGetRolesQuery}
      handleCreateNewRecord={() => redirect('create')}
      newRecordButtonPermission={PERMISSIONS.ADMIN}
      pageHeader={<UsersRolesHeader />}
    />
  );
};

export default Roles;
