import { ItemName, ItemUserName } from 'components/custom-cell';
import { Table } from 'components/table';

import { useRedirect } from 'hooks/useRedirect';

import PayableWrapper from './components/payable-wrapper';

const Recurring = () => {
  const { redirect } = useRedirect();

  const columns = [
    {
      Header: 'Property / unit',
      accessor: 'property',
      Cell: ItemName,
      width: '200px',
    },
    {
      Header: 'Payer',
      accessor: 'name',
      Cell: ItemUserName,
      width: '200px',
    },
    {
      Header: 'GL account',
      accessor: 'gl_account',
      width: '150px',
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      width: '150px',
    },
    {
      Header: 'Last billed date',
      accessor: 'date',
      width: '150px',
    },
    {
      Header: 'Repeats',
      accessor: 'repeats',
      width: '150px',
    },
  ];

  const Recurring = [
    {
      id: '1',
      name: 'John Doe',
      type: 'Type 1',
      title: 'title',
      gl_account: 'XXXX-XXX',
      amount: '500 $',
      date: '2022-12-12',
      status: 'current',
      repeats: 'Monthly',
      property: {
        title: 'Unit 1',
        subtitle: 'asd',
      },
    },
  ];

  return (
    <PayableWrapper
      createNewButtonTitle="Create bill"
      handleCreateNewRecord={() => {
        redirect('#/create');
      }}
    >
      <Table
        data={Recurring}
        columns={columns}
        total={Recurring.length}
        onRowClick={row => {
          if (row.values) {
            redirect('#/details');
          }
        }}
      />
    </PayableWrapper>
  );
};

export default Recurring;
