import { useGetLeasesQuery } from 'services/api/lease';

import { ItemDate, ItemName, ItemUserName } from 'components/custom-cell';
import { SimpleTable } from 'components/table';

import { useRedirect } from 'hooks/useRedirect';

import CustomTableHeader from '../custom-table-header';

function ExpiringLeases() {
  const { redirect } = useRedirect();
  const { data: expiringLeasesData, ...rest } = useGetLeasesQuery({ size: 10, ordering: 'end_date' });

  const columns = [
    {
      Header: 'Property name',
      accessor: 'property',
      Cell: ItemName,
      disableSortBy: true,
      minWidth: 175,
    },
    {
      Header: 'Tenant',
      accessor: 'tenant_name',
      Cell: ItemUserName,
      disableSortBy: true,
      minWidth: 175,
    },
    {
      Header: 'Expire in days',
      accessor: 'end_date',
      disableSortBy: true,
      Cell: ItemDate,
    },
  ];

  return (
    <SimpleTable
      {...rest}
      clickable
      customHeader={
        <CustomTableHeader heading="Expiring leases" headingClassName="fw-bold" url="/admin/leasing/leases" />
      }
      hideMainHeaderComponent
      showTotal={false}
      data={expiringLeasesData?.results ?? []}
      columns={columns}
      shadow={false}
      wrapperClass="detail-section-table min-h-100 page-section"
      onRowClick={row => {
        if (row.original) {
          if ('id' in row.original) {
            const leasingRequest = row.original['id'];
            redirect(`/leasing/leases/details/${leasingRequest}`, false, 'dashboard');
          }
        }
      }}
    />
  );
}

export default ExpiringLeases;
