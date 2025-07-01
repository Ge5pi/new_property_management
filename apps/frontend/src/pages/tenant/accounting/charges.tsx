import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetTenantChargesQuery } from 'services/api/tenants/accounts';

import { ItemDate, ItemPrice, ItemStatus } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';

import { useRedirect } from 'hooks/useRedirect';

import ChargesWrapper from './components/charges-wrapper';
import ReceivableHeader from './receivable-navigation';

const Charges = () => {
  const columns = [
    {
      Header: 'Charge Title',
      accessor: 'title',
      minWidth: 300,
    },
    {
      Header: 'Charge Type',
      accessor: 'get_charge_type_display',
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
          useData={useGetTenantChargesQuery}
          pageHeader={<ReceivableHeader />}
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
