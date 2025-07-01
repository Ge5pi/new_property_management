import { ItemName } from 'components/custom-cell';
import { SimpleTable } from 'components/table';

import CustomTableHeader from '../custom-table-header';

function PendingMoveIns() {
  const columns = [
    {
      Header: 'Property name',
      accessor: 'property',
      Cell: ItemName,
      disableSortBy: true,
    },
    {
      Header: 'Unit',
      accessor: 'unit_name',
      disableSortBy: true,
    },
    {
      Header: 'Accepted date',
      accessor: 'accepted_date',
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
        <CustomTableHeader heading="Pending Move Ins" url="/admin/leasing/leases" headingClassName="fw-bold" />
      }
    />
  );
}

export default PendingMoveIns;
