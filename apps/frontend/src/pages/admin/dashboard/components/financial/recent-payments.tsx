import { SimpleTable } from 'components/table';

import { Avatar } from 'core-ui/user-avatar';

import CustomTableHeader from '../custom-table-header';

function RecentPayments() {
  const columns = [
    {
      Header: 'Payer',
      accessor: 'payer',
      Cell: () => <Avatar suffixClassName="fw-bold" size={40} showName name="Mr John Doe" />,
      disableSortBy: true,
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      disableSortBy: true,
    },
    {
      Header: 'Date',
      accessor: 'date',
      disableSortBy: true,
    },
  ];

  return (
    <SimpleTable
      clickable
      data={[]}
      hideMainHeaderComponent
      showTotal={false}
      columns={columns}
      shadow={false}
      wrapperClass="detail-section-table min-h-100 page-section"
      customHeader={
        <CustomTableHeader
          heading="Recent Payments"
          headingClassName="fw-bold"
          url="/admin/accounts/payments?page=1&invoice__status=VERIFIED"
        />
      }
    />
  );
}

export default RecentPayments;
