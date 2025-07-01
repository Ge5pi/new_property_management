import { Card } from 'react-bootstrap';

import { SimpleTable } from 'components/table';

const OwnerWithdrawal = () => {
  const columns = [
    {
      Header: 'Date',
      accessor: 'date',
      disableSortBy: true,
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      disableSortBy: true,
    },
    {
      Header: 'To GL Account',
      accessor: 'to_gl_account',
      minWidth: 200,
      disableSortBy: true,
    },
  ];

  return (
    <Card className="border-0 min-h-100 page-section">
      <Card.Header className="my-2 border-0 bg-transparent text-start">
        <p className="fw-bold m-0 text-primary">Owner withdrawals </p>
      </Card.Header>
      <Card.Body className="text-start p-0">
        <SimpleTable
          clickable
          data={[]}
          hideMainHeaderComponent
          showTotal={false}
          columns={columns}
          shadow={false}
          wrapperClass="detail-section-table secondary-header"
        />
      </Card.Body>
    </Card>
  );
};

export default OwnerWithdrawal;
