import { useParams } from 'react-router-dom';

import { useGetLeasesQuery } from 'services/api/lease';

import { ItemDate, ItemPrice, ItemUserName } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { ILeaseAPI } from 'interfaces/IApplications';

const UnitLeaseInformation = () => {
  const { unit: unit_id } = useParams();

  const columns = [
    {
      Header: 'Start Date',
      accessor: 'start_date',
      Cell: ItemDate,
    },
    {
      Header: 'End Date',
      accessor: 'end_date',
      Cell: ItemDate,
    },
    {
      Header: 'Tenant',
      accessor: 'tenant_name',
      Cell: ItemUserName,
      minWidth: 300,
    },
    {
      Header: 'Rent',
      accessor: 'amount',
      Cell: ItemPrice,
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: LeaseStatus,
    },
  ];

  const { redirect } = useRedirect();

  return (
    <div className="min-h-100 border page-section pgr-white">
      <TableWithPagination
        clickable
        columns={columns}
        shadow={false}
        showTotal={false}
        useData={useGetLeasesQuery}
        pageHeader={<p className="fw-bold m-0 text-primary">Lease Information</p>}
        filterValues={{ unit: unit_id }}
        saveValueInState
        showHeaderInsideContainer
        wrapperClass="detail-section-table"
        newRecordButtonPermission={PERMISSIONS.LEASING}
        className="border-none"
        searchable={false}
        onRowClick={row => {
          if (row.original) {
            const row1 = row.original as ILeaseAPI;
            if ('id' in row1) {
              redirect(`/leasing/leases/details/${row1.id}`, false, 'properties');
            }
          }
        }}
      />
    </div>
  );
};

const LeaseStatus = ({ value }: { value?: string }) => {
  if (!value) return <span>-</span>;

  if (value.toLowerCase() === 'active') {
    return <span className="py-1 px-2 badge rounded-pill unit-available-bg">{value}</span>;
  } else {
    return <span className="py-1 px-2 badge rounded-pill unit-occupied-bg">{value}</span>;
  }
};

export default UnitLeaseInformation;
