import { Fragment, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetTenantServiceRequestsQuery } from 'services/api/tenants/service-requests';

import { ItemSlug, ItemStatus } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';

import { useRedirect } from 'hooks/useRedirect';

import ServiceRequestWrapper from './components/service-request-wrapper';
import RequestsHeader from './requests-navigation';

const ServicesRequests = () => {
  const { redirect } = useRedirect();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const pageNumber = searchParams.get('page');
    searchParams.set('page', pageNumber ?? '1');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const columns = [
    {
      Header: 'Request ID',
      accessor: 'slug',
      Cell: ItemSlug,
      minWidth: 300,
    },
    {
      Header: 'Subject',
      accessor: 'subject',
      minWidth: 300,
    },
    {
      Header: 'Status',
      accessor: 'status_with_obj',
      Cell: ItemStatus,
    },
  ];

  return (
    <Fragment>
      <ServiceRequestWrapper>
        {(filterValue, component) => (
          <TableWithPagination
            clickable
            columns={columns}
            useData={useGetTenantServiceRequestsQuery}
            pageHeader={<RequestsHeader />}
            handleCreateNewRecord={() => redirect(`create`)}
            filterMenu={component}
            filterValues={{ status: filterValue }}
            onRowClick={row => {
              if (row.original) {
                if ('id' in row.original) {
                  const serviceReq = row.original['id'];
                  redirect(`details/${serviceReq}`);
                }
              }
            }}
          />
        )}
      </ServiceRequestWrapper>
    </Fragment>
  );
};

export default ServicesRequests;
