import { useState } from 'react';
import { Row as ReactTableRow } from 'react-table';

import { clsx } from 'clsx';

import useResponse from 'services/api/hooks/useResponse';
import { useDeleteUserMutation, useGetUsersQuery } from 'services/api/users';

import { Confirmation, PleaseWait } from 'components/alerts';
import { ItemSlug } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';
import RowActions from 'components/table/row-actions';

import { SwalExtended } from 'core-ui/sweet-alert';

import { useAuthState } from 'hooks/useAuthState';
import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';
import { getUserAccountType } from 'utils/functions';

import { IUser } from 'interfaces/IAvatar';

import UsersRolesHeader from './components/user-roles-navigation';

const Users = () => {
  const { redirect } = useRedirect();

  const columns = [
    {
      Header: 'Sr#',
      accessor: 'slug',
      Cell: ItemSlug,
    },
    {
      Header: 'First Name',
      accessor: 'first_name',
    },
    {
      Header: 'Last Name',
      accessor: 'last_name',
    },
    {
      Header: 'Email Address',
      accessor: 'email',
    },
    {
      Header: 'Type',
      accessor: 'account_type',
      Cell: ({ value }: { value?: 'TENANT' | 'ADMIN' | 'SUPER_ADMIN' }) => (
        <span
          className={clsx(
            {
              'text-warning': value === 'ADMIN',
              'text-danger': value === 'SUPER_ADMIN',
              'text-info': value === 'TENANT',
            },
            'fw-medium text-capitalize'
          )}
        >
          {value ? value.toLowerCase().replaceAll('_', ' ') : '-'}
        </span>
      ),
    },
    {
      Header: 'Account status',
      accessor: 'is_active',
      Cell: ({ value }: { value?: boolean }) => (
        <span className={clsx({ 'text-success': value }, 'fw-medium')}>{value ? 'Active' : 'Inactive'}</span>
      ),
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: UserActions,
      disableSortBy: true,
      sticky: 'right',
      width: 100,
    },
  ];

  return (
    <TableWithPagination
      clickable
      columns={columns}
      useData={useGetUsersQuery}
      handleCreateNewRecord={() => redirect('create')}
      newRecordButtonPermission={PERMISSIONS.ADMIN}
      pageHeader={<UsersRolesHeader />}
      onRowClick={row => {
        if (row.values) {
          redirect(`details/${(row.original as IUser).id}`);
        }
      }}
    />
  );
};

const UserActions = ({ row }: { row: ReactTableRow }) => {
  const { userID } = useAuthState();
  const { redirect } = useRedirect();

  const [deleteUserByID, { isSuccess: isDeleteUserSuccess, isError: isDeleteUserError, error: deleteUserError }] =
    useDeleteUserMutation();

  useResponse({
    isSuccess: isDeleteUserSuccess,
    successTitle: 'You have deleted a user',
    isError: isDeleteUserError,
    error: deleteUserError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      type: 'danger',
      description: `Are you sure you want to delete this user?\nThis may result in unexpected behavior such as, removal of data associated with this user. Considered suspending their account instead.`,
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deleteUserByID(id).finally(() => {
          SwalExtended.close();
          setDisabled(false);
        });
      }
    });
  };

  return (
    <RowActions
      className="action-btns justify-content-center"
      actions={[
        {
          disabled:
            disabled ||
            Number((row.original as IUser).id) === Number(userID) ||
            getUserAccountType(row.original as IUser) === 'SUPER_ADMIN',
          className: clsx({
            'd-none':
              Number((row.original as IUser).id) === Number(userID) ||
              getUserAccountType(row.original as IUser) === 'SUPER_ADMIN',
          }),
          icon: 'delete',
          permission: PERMISSIONS.ADMIN,
          onClick: () => {
            if (
              Number((row.original as IUser).id) !== Number(userID) &&
              !(getUserAccountType(row.original as IUser) === 'SUPER_ADMIN')
            ) {
              deleteRecord(Number((row.original as IUser).id));
            }
          },
        },
        {
          icon: 'edit',
          permission: PERMISSIONS.ADMIN,
          showText:
            Number((row.original as IUser).id) === Number(userID) ||
            getUserAccountType(row.original as IUser) === 'SUPER_ADMIN',
          onClick: () => redirect(`modify/${(row.original as IUser).id}`),
        },
      ]}
    />
  );
};

export default Users;
