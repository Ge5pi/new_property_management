import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetChargesQuery } from 'services/api/charges';

import { ItemDate, ItemName, ItemPrice, ItemStatus, ItemUserName } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import ChargesWrapper from './components/charges-wrapper';
import ReceivableHeader from './receivable-navigation';

const Charges = () => {
  const columns = [
    {
      Header: 'Property / unit',
      accessor: 'property',
      Cell: ItemName,
      minWidth: 300,
    },
    {
      Header: 'Payer',
      accessor: 'tenant_name',
      Cell: ItemUserName,
      minWidth: 200,
    },
    {
      Header: 'Title',
      accessor: 'title',
    },
    {
      Header: 'GL account',
      accessor: 'gl_account',
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      Cell: ItemPrice,
    },
    {
      Header: 'Date',
      accessor: 'created_at',
      Cell: ItemDate,
    },
    {
      Header: 'Status',
      accessor: 'charge_status',
      Cell: ItemStatus,
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
    <ChargesWrapper>
      {(filterValue, component) => (
        <TableWithPagination
          clickable
          columns={columns}
          useData={useGetChargesQuery}
          pageHeader={<ReceivableHeader />}
          handleCreateNewRecord={() => redirect('create')}
          newRecordButtonPermission={PERMISSIONS.ACCOUNTS}
          newRecordButtonText="Create Charge"
          filterMenu={component}
          filterValues={filterValue}
          onRowClick={row => {
            if (row.original) {
              const charge = row.original;
              if ('id' in charge) {
                redirect(`${charge.id}/details`);
              }
            }
          }}
        />
      )}
    </ChargesWrapper>
  );
};

export default Charges;
