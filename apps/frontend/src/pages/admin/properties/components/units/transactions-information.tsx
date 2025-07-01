import { SimpleTable } from 'components/table';

const TransactionsInformation = ({ title = '' }: { title: string }) => {
  const columns = [
    {
      Header: 'Amount',
      accessor: 'amount',
      Cell: TransactionsAmount,
    },
    {
      Header: 'Charge Date',
      accessor: 'charge_date',
    },
    {
      Header: 'Posting Date',
      accessor: 'posting_date',
    },
    {
      Header: 'Type',
      accessor: 'type',
    },
  ];

  const data = [
    {
      amount: { amount: 500, description: 'Some description over here' },
      charge_date: '12/05/2022',
      posting_date: '12/05/2022',
      type: 'Recurring',
    },
    {
      amount: { amount: 500, description: 'Some description over here' },
      charge_date: '12/05/2022',
      posting_date: '12/05/2022',
      type: 'Recurring',
    },
    {
      amount: { amount: 500, description: 'Some description over here' },
      charge_date: '12/05/2022',
      posting_date: '12/05/2022',
      type: 'Recurring',
    },
  ];

  return (
    <SimpleTable
      data={data}
      columns={columns}
      pageHeader={<p className="fw-bold m-0 text-primary">{title} Information</p>}
      showTotal={false}
      wrapperClass={'detail-section-table'}
      showHeaderInsideContainer
    />
  );
};

const TransactionsAmount = ({ value }: { value: { amount: number; description?: string } }) => {
  return (
    <div>
      <p className="ms-2 mb-0 text-primary fw-medium">${value.amount}</p>
      <p className="ms-2 text-primary fw-light">{value.description}</p>
    </div>
  );
};

export default TransactionsInformation;
