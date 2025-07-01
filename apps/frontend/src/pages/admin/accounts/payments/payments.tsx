import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row as ReactTableRow } from 'react-table';

import useResponse from 'services/api/hooks/useResponse';
import { useUpdateInvoiceStatusMutation } from 'services/api/invoices';
import { useGetPaymentsQuery } from 'services/api/payments';

import { ItemDate, ItemPrice, ItemSlug, ItemStatus } from 'components/custom-cell';
import { SubmitBtn } from 'components/submit-button';
import { TableWithPagination } from 'components/table';

import { DotIcon } from 'core-ui/icons';

import { useRedirect } from 'hooks/useRedirect';

import { ITenantPayments } from 'interfaces/IAccounting';

import PaymentsWrapper from './payment-wrapper';

const Payments = () => {
  const columns = [
    {
      Header: 'Reference No.',
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
    {
      Header: () => <div className="text-center">Action</div>,
      accessor: 'actions',
      Cell: ItemVerifyPayment,
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
    <PaymentsWrapper>
      {(filterValue, component) => (
        <TableWithPagination
          clickable
          columns={columns}
          useData={useGetPaymentsQuery}
          pageHeader={'Payments'}
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

const ItemVerifyPayment = ({ row }: { row: ReactTableRow }) => {
  const [submitting, setSubmitting] = useState(false);
  const payment = row.original as ITenantPayments;

  const [
    updateInvoiceStatus,
    { isSuccess: isUpdatePaymentSuccess, isError: isUpdatePaymentError, error: updatePaymentError },
  ] = useUpdateInvoiceStatusMutation();

  useResponse({
    isSuccess: isUpdatePaymentSuccess,
    successTitle: 'Payment status has been updated!',
    isError: isUpdatePaymentError,
    error: updatePaymentError,
  });

  const handleVerification = () => {
    if (payment.status === 'VERIFIED') return;

    setSubmitting(true);
    updateInvoiceStatus({ id: payment.invoice, payment: payment.id, status: 'VERIFIED' }).finally(() =>
      setSubmitting(false)
    );
  };

  if (payment.status === 'UNPAID') {
    return (
      <div className="text-info fw-medium text-center">
        Not Paid <DotIcon />
      </div>
    );
  }

  return (
    <div className="text-center">
      <SubmitBtn
        onClick={handleVerification}
        variant={payment.status === 'NOT_VERIFIED' ? 'light' : 'success'}
        disabled={payment.status === 'VERIFIED' || submitting}
      >
        {payment.status === 'NOT_VERIFIED' ? 'Verify Payment' : 'Payment Verified'}
      </SubmitBtn>
    </div>
  );
};

export default Payments;
