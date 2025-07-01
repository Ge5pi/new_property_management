import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row as ReactTableRow } from 'react-table';

import useResponse from 'services/api/hooks/useResponse';
import { useCloseLeaseMutation, useDeleteLeaseMutation, useGetLeasesQuery } from 'services/api/lease';

import { Confirmation, PleaseWait } from 'components/alerts';
import { ItemDate, ItemName, ItemOwner, ItemUserName } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';
import MoreOptions from 'components/table/more-options';

import { SwalExtended } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { ILeaseAPI, ILeaseForm } from 'interfaces/IApplications';

import LeaseWrapper from './lease-wrapper';

const Leases = () => {
  const { redirect } = useRedirect();

  const columns = [
    {
      Header: 'Property / unit',
      accessor: 'property',
      Cell: ItemName,
      minWidth: 300,
    },
    {
      Header: 'Tenant',
      accessor: 'tenant_name',
      Cell: ItemUserName,
      minWidth: 200,
    },
    {
      Header: 'Start date',
      accessor: 'start_date',
      Cell: ItemDate,
    },
    {
      Header: 'End date',
      accessor: 'end_date',
      Cell: ItemDate,
    },
    {
      Header: 'Property Owner',
      accessor: 'owners',
      Cell: ItemOwner,
      minWidth: 200,
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: LeaseActions,
      disableSortBy: true,
      sticky: 'right',
      minWidth: 0,
    },
  ];

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const pageNumber = searchParams.get('page');
    searchParams.set('page', pageNumber ?? '1');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return (
    <LeaseWrapper>
      {(filterValue, component) => (
        <TableWithPagination
          clickable
          columns={columns}
          useData={useGetLeasesQuery}
          pageHeader={'Leases'}
          filterMenu={component}
          filterValues={filterValue}
          newRecordButtonPermission={PERMISSIONS.LEASING}
          handleCreateNewRecord={() => redirect(`create`)}
          onRowClick={row => {
            if (row.original) {
              const row1 = row.original as ILeaseAPI;
              if ('id' in row1) {
                const lease = row1.id;
                redirect(`details/${lease}`);
              }
            }
          }}
        />
      )}
    </LeaseWrapper>
  );
};

const LeaseActions = ({ row }: { row: ReactTableRow }) => {
  const { redirect } = useRedirect();

  // close Lease
  const [closeLease, { isSuccess: isClosedLeaseSuccess, isError: isClosedLeaseError, error: closedLeaseError }] =
    useCloseLeaseMutation();

  useResponse({
    isSuccess: isClosedLeaseSuccess,
    successTitle: 'Lease has been successfully closed!',
    isError: isClosedLeaseError,
    error: closedLeaseError,
  });

  const [deleteLeaseByID, { isSuccess: isDeleteLeaseSuccess, isError: isDeleteLeaseError, error: deleteLeaseError }] =
    useDeleteLeaseMutation();

  useResponse({
    isSuccess: isDeleteLeaseSuccess,
    successTitle: 'You have deleted Lease',
    isError: isDeleteLeaseError,
    error: deleteLeaseError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      title: 'Delete',
      type: 'danger',
      description: 'Are you sure you want to delete this record?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deleteLeaseByID(id).finally(() => {
          SwalExtended.close();
          setDisabled(false);
        });
      }
    });
  };

  const closeRecord = (id: string | number) => {
    Confirmation({
      title: 'Close Lease',
      type: 'warning',
      description: 'Are you sure you want to close this lease?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        closeLease(id).finally(() => {
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
          permission: PERMISSIONS.LEASING,
          onClick: () => {
            const row1 = row.original as ILeaseForm;
            if (row1.id) {
              redirect(`${row1.id}/modify`);
            }
          },
        },
        {
          disabled,
          text: 'Close',
          permission: PERMISSIONS.LEASING,
          onClick: () => {
            const row1 = row.original as ILeaseForm;
            if (row1.id) {
              const lease_id = row1.id;
              closeRecord(lease_id);
            }
          },
        },
        {
          disabled,
          permission: PERMISSIONS.LEASING,
          text: 'Renew',
          onClick: () => {
            const row1 = row.original as ILeaseForm;
            if (row1.id) {
              redirect(`${row1.id}/renew`);
            }
          },
        },
        {
          disabled,
          text: 'Delete',
          permission: PERMISSIONS.LEASING,
          onClick: () => {
            const row1 = row.original as ILeaseForm;
            if (row1.id) {
              deleteRecord(row1.id);
            }
          },
        },
      ]}
    />
  );
};

export default Leases;
