import { ItemName, ItemStatus, ItemUserName } from 'components/custom-cell';
import { Table } from 'components/table';

import { NewBillModal } from 'core-ui/popups/newbill';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import PayableWrapper from './components/payable-wrapper';

const Bills = () => {
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
      Header: 'Type',
      accessor: 'type',
      width: '150px',
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
      Header: 'Bill Date',
      accessor: 'date',
      width: '150px',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ItemStatus,
      width: '125px',
    },
  ];

  const Bills = [
    {
      id: '1',
      name: 'John Doe',
      type: 'Type 1',
      title: 'title',
      gl_account: 'XXXX-XXX',
      amount: '500 $',
      date: '2022-12-12',
      status: 'current',
      property: {
        title: 'Unit 1',
        subtitle: 'asd',
      },
    },
  ];

  return (
    <PayableWrapper
      createNewButtonTitle="Create Bills"
      handleCreateNewRecord={() => {
        SweetAlert({
          size: 'md',
          html: (
            <NewBillModal
              handleCreateBill={(id: string) => {
                redirect(`bills/${id}/#/create`);
                SwalExtended.close();
              }}
            />
          ),
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
    >
      <Table
        data={Bills}
        columns={columns}
        total={Bills.length}
        onRowClick={row => {
          if (row.values) {
            redirect(`#/details`);
          }
        }}
      />
    </PayableWrapper>
  );
};

export default Bills;
