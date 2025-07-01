import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetTenantWorkOrdersQuery } from 'services/api/tenants/work-orders';

import { ItemDate, ItemStatus, ItemWorkOrder } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';

import RequestsHeader from './requests-navigation';

function WorkOrders() {
  const columns = [
    {
      Header: 'Work Order No.',
      Cell: ItemWorkOrder,
      accessor: 'wo',
    },
    {
      Header: 'Description',
      accessor: 'job_description',
      minWidth: 300,
    },
    {
      Header: 'Created date',
      accessor: 'created_at',
      Cell: ItemDate,
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ItemStatus,
    },
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const pageNumber = searchParams.get('page');
    searchParams.set('page', pageNumber ?? '1');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return (
    <TableWithPagination columns={columns} useData={useGetTenantWorkOrdersQuery} pageHeader={<RequestsHeader />} />
  );
}

export default WorkOrders;
