import { Table } from 'components/table';

const Marketing = () => {
  const columns = [
    {
      Header: 'Marketing Platform',
      accessor: 'platform',
      disableSortBy: true,
      minWidth: 500,
    },
    {
      Header: 'Posted Date',
      accessor: 'posted_on',
      disableSortBy: true,
    },
  ];

  const data = [
    {
      platform: 'Facebook',
      posted_on: '10/05/2022',
    },
    {
      platform: 'Youtube',
      posted_on: '10/05/2022',
    },
    {
      platform: 'Instagram',
      posted_on: '10/05/2022',
    },
    {
      platform: 'WhatsApp',
      posted_on: '10/05/2022',
    },
  ];

  return (
    <div className="container-fluid px-xl-4 page-section py-4">
      <div className="my-3">
        <Table data={data} columns={columns} shadow={false} showTotal={false} wrapperClass={'big-list-table'} />
      </div>
    </div>
  );
};

export default Marketing;
