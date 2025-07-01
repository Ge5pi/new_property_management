import { SimpleTable } from 'components/table';

import { Avatar } from 'core-ui/user-avatar';

import CustomTableHeader from '../custom-table-header';

function OutstandingInvoices() {
  const columns = [
    {
      Header: 'Tenant',
      accessor: 'tenant',
      Cell: () => <Avatar suffixClassName="fw-bold" size={40} showName name="Mr John Doe" />,
      disableSortBy: true,
    },
    {
      Header: 'Amount type',
      accessor: 'amount_type',
      disableSortBy: true,
    },
    {
      Header: 'Amount',
      accessor: 'amount',
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
          heading="Outstanding Invoices"
          headingClassName="fw-bold"
          url="/admin/accounts/receivables?page=1&status=UNPAID"
        />
      }
    />
  );
}

export default OutstandingInvoices;
