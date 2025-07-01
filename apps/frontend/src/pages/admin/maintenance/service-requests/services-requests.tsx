import { Fragment, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { Row as ReactTableRow } from 'react-table';

import { useGetServiceRequestsQuery } from 'services/api/service-requests';

import { ItemName, ItemStatus } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';
import MoreOptions from 'components/table/more-options';

import { HScroll } from 'core-ui/h-scroll';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { IServiceRequestAPI } from 'interfaces/IServiceRequests';

import ServiceRequestWrapper from './components/service-request-wrapper';

import '../maintenance.styles.css';

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
      Header: 'Property name',
      accessor: 'property_and_unit',
      Cell: ItemName,
      minWidth: 300,
    },
    {
      Header: 'Description',
      accessor: 'description',
      minWidth: 300,
    },
    {
      Header: 'No. of work orders',
      accessor: 'work_order_count',
    },
    {
      Header: 'Status',
      accessor: 'status_with_obj',
      Cell: ItemStatus,
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: ({ row }: { row: ReactTableRow }) => (
        <MoreOptions
          className="text-center"
          actions={[
            {
              text: 'Edit',
              permission: PERMISSIONS.MAINTENANCE,
              onClick: () => {
                const row1 = row.original as IServiceRequestAPI;
                if (row1.id) {
                  const serviceReq = row1.id;
                  redirect(`modify/${serviceReq}`);
                }
              },
            },
          ]}
        />
      ),
      disableSortBy: true,
      sticky: 'right',
      minWidth: 0,
    },
  ];

  return (
    <Fragment>
      <HScroll
        arrowsPos={{ show: 'head', position: 'end' }}
        scrollContainerClassName="row gx-2 gy-3 flex-nowrap"
        itemClassName="col-lg-3 col-md-4 col-sm-6 col-12"
      >
        <div className="my-1">
          <OverviewCard title={'Unassigned Resident Requests'} value={25} />
        </div>
        <div className="my-1">
          <OverviewCard title={'Unassigned Internals'} value={25} />
        </div>
        <div className="my-1">
          <OverviewCard title={'Requests without actions'} value={25} />
        </div>
        <div className="my-1">
          <OverviewCard title={'Internal without actions'} value={25} />
        </div>
      </HScroll>

      <ServiceRequestWrapper>
        {(filterValue, component) => (
          <TableWithPagination
            clickable
            columns={columns}
            useData={useGetServiceRequestsQuery}
            pageHeader={'Service Requests'}
            newRecordButtonPermission={PERMISSIONS.MAINTENANCE}
            filterMenu={component}
            filterValues={{ ...filterValue }}
            handleCreateNewRecord={() => redirect(`create`)}
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

const OverviewCard = ({ title, value }: { title: string; value: number }) => {
  return (
    <Card className="overview-card min-h-100">
      <Card.Header>
        <p className="title fw-bold small">{title}</p>
        <p className="value fw-bold h3">{value}</p>
      </Card.Header>
    </Card>
  );
};

export default ServicesRequests;
