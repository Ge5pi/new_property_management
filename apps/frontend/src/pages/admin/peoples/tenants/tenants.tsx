import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetTenantsQuery } from 'services/api/tenants';

import { ItemStatus, ItemUserName } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { ITenantAPI } from 'interfaces/ITenant';

import TenantWrapper from './tenant-wrapper';

const Tenants = () => {
  const { redirect } = useRedirect();

  // TODO : Update any to object shape type in column custom cell components.
  const columns = [
    {
      Header: 'Tenant Name',
      accessor: 'full_name',
      Cell: ItemUserName,
      minWidth: 200,
    },
    {
      Header: 'Phone number',
      accessor: 'phone_number',
    },
    {
      Header: 'Property',
      accessor: 'property',
      minWidth: 200,
    },
    {
      Header: 'Unit',
      accessor: 'unit',
      minWidth: 200,
    },
    {
      Header: 'Status',
      accessor: 'status_with_obj',
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
    <TenantWrapper>
      {(filterValue, component) => (
        <TableWithPagination
          clickable
          columns={columns}
          useData={useGetTenantsQuery}
          pageHeader={'Tenants'}
          filterMenu={component}
          newRecordButtonPermission={PERMISSIONS.PEOPLE}
          filterValues={{ ...filterValue, search: filterValue?.tenant_name }}
          onRowClick={row => {
            const row1 = row.original as ITenantAPI;
            if (row1.id) {
              const tenant_id = row1.id;
              redirect(`${tenant_id}/details`);
            }
          }}
        />
      )}
    </TenantWrapper>
  );
};

export default Tenants;
