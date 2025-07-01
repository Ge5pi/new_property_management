import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetTenantPaymentsQuery } from 'services/api/tenants/payments';

import { ItemDate, ItemPrice, ItemSlug, ItemStatus } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';

import { useRedirect } from 'hooks/useRedirect';

import ReceivableHeader from '../receivable-navigation';
import PaymentsWrapper from './components/payment-wrapper';

const Payments = () => {
  const columns = [
    {
      Header: 'Payment For',
      accessor: 'invoice_slug',
      Cell: ItemSlug,
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      Cell: ItemPrice,
    },
    {
      Header: 'Date',
      accessor: 'payment_date',
      Cell: ItemDate,
    },
    {
      Header: 'Payment Method',
      accessor: 'get_payment_method_display',
    },
    {
      Header: 'Status',
      accessor: 'status_with_obj',
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
    <PaymentsWrapper>
      {(filterValue, component) => (
        <TableWithPagination
          clickable
          columns={columns}
          useData={useGetTenantPaymentsQuery}
          pageHeader={<ReceivableHeader />}
          filterMenu={component}
          filterValues={filterValue}
          onRowClick={row => {
            if (row.original) {
              const payment = row.original;
              if ('id' in payment) {
                redirect(`details/${payment.id}`);
              }
            }
          }}
        />
      )}
    </PaymentsWrapper>
  );
};

export default Payments;
