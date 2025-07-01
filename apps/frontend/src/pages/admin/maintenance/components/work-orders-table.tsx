import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Column, Row as ReactTableRow } from 'react-table';

import { clsx } from 'clsx';

import useResponse from 'services/api/hooks/useResponse';
import { useGetAllWorkOrdersQuery, useUpdateWorkOrderMutation } from 'services/api/work-orders';

import { Confirmation, PleaseWait } from 'components/alerts';
import { ItemDate, ItemStatus, ItemWorkOrder } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';
import MoreOptions from 'components/table/more-options';

import { AssignWorkOrderModal } from 'core-ui/popups/assign-work-order';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { IWorkOrdersAPI, WorkOrderStatus } from 'interfaces/IWorkOrders';

import WorkOrderWrapper from './work-order-wrapper';

import '../maintenance.styles.css';

interface IProps {
  serviceRequestID?: string | number;
  withFilters?: boolean;
}

const WorkOrdersTable = ({ serviceRequestID, withFilters }: IProps) => {
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
      accessor: 'status_with_obj',
      Cell: ItemStatus,
    },
    {
      accessor: 'actions',
      Header: () => <div className="text-center">Actions</div>,
      Cell: ({ row }: { row: ReactTableRow }) => <WorkOrdersActions row={row} withFilters={withFilters} />,
      disableSortBy: true,
      sticky: 'right',
      minWidth: 0,
    },
  ];

  if (withFilters) {
    return <WorkOrderTableWithFilters columns={columns} />;
  } else {
    return <WorkOrderTableWithoutFilters columns={columns} serviceRequestID={serviceRequestID} />;
  }
};

interface IWorkOrderTableProps {
  columns: readonly Column<object>[];
  serviceRequestID?: string | number;
}

const WorkOrderTableWithFilters = ({ columns }: IWorkOrderTableProps) => {
  const { redirect } = useRedirect();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const pageNumber = searchParams.get('page');
    searchParams.set('page', pageNumber ?? '1');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return (
    <WorkOrderWrapper>
      {(filterValue, component) => (
        <TableWithPagination
          clickable
          columns={columns}
          useData={useGetAllWorkOrdersQuery}
          pageHeader={'Work Orders'}
          filterMenu={component}
          filterValues={{ status: filterValue }}
          newRecordButtonPermission={PERMISSIONS.MAINTENANCE}
          handleCreateNewRecord={() => redirect(`create`)}
          onRowClick={row => {
            if (row.original) {
              const row1 = row.original as IWorkOrdersAPI;
              if ('id' in row1) {
                const work_order = row1.id;
                redirect(`${work_order}/details/${row1.service_request}`);
              }
            }
          }}
        />
      )}
    </WorkOrderWrapper>
  );
};

const WorkOrderTableWithoutFilters = ({ columns, serviceRequestID }: IWorkOrderTableProps) => {
  const { redirect } = useRedirect();
  return (
    <TableWithPagination
      clickable
      saveValueInState
      searchable={false}
      columns={columns}
      showHeaderInsideContainer
      useData={useGetAllWorkOrdersQuery}
      filterValues={{ service_request: serviceRequestID }}
      pageHeader={<p className="fw-bold m-0 text-primary">Work Orders</p>}
      showTotal={false}
      shadow={false}
      defaultPageSize={5}
      wrapperClass="pb-3 border-0"
      classes={{ body: 'px-2', header: 'px-2', footer: 'px-2' }}
      newRecordButtonPermission={PERMISSIONS.MAINTENANCE}
      handleCreateNewRecord={() => redirect(`/work-orders/create/${serviceRequestID}`, false, 'service-requests')}
      onRowClick={row => {
        if (row.original) {
          if ('id' in row.original) {
            const work_order = row.original['id'];
            redirect(`/work-orders/${work_order}/details/${serviceRequestID}`, false, 'service-requests');
          }
        }
      }}
    />
  );
};

export default WorkOrdersTable;

const WorkOrdersActions = ({ row, withFilters }: { row: ReactTableRow; withFilters?: boolean }) => {
  const [disabled, setDisabled] = useState(false);
  const { redirect } = useRedirect();

  const wo = row.original as IWorkOrdersAPI;

  // update WorkOrder
  const [
    changeWorkOrderStatus,
    { isSuccess: isUpdatedWorkOrderSuccess, isError: isUpdatedWorkOrderError, error: updatedWorkOrderError },
  ] = useUpdateWorkOrderMutation();

  useResponse({
    isSuccess: isUpdatedWorkOrderSuccess,
    successTitle: 'Work order status has been updated!',
    isError: isUpdatedWorkOrderError,
    error: updatedWorkOrderError,
  });

  const changeStatus = (id: string | number, service_request_id: number, status: WorkOrderStatus) => {
    Confirmation({
      type: 'info',
      title: 'Confirmation',
      description: `You are about to change the status of this work order to "${status}".`,
    }).then(result => {
      if (result.isConfirmed) {
        let data = {
          id,
          service_request: service_request_id,
          status,
        } as Partial<IWorkOrdersAPI>;

        if (status === 'UNASSIGNED') {
          data = { ...data, assign_to: null };
        }

        PleaseWait();
        setDisabled(true);
        changeWorkOrderStatus(data).finally(() => {
          setDisabled(false);
          SwalExtended.close();
        });
      }
    });
  };

  return (
    <MoreOptions
      className="text-center"
      actions={[
        {
          text: 'Edit',
          permission: PERMISSIONS.MAINTENANCE,
          disabled: disabled || wo.status === 'COMPLETED',
          onClick: () => {
            const row1 = row.original as IWorkOrdersAPI;
            if (row1.id && wo.status !== 'COMPLETED') {
              const work_order = row1.id;
              const p = `${work_order}/modify/${row1.service_request}`;
              if (withFilters) {
                redirect(p);
                return;
              }
              redirect(`/work-orders/${p}`, false, 'service-requests');
            }
          },
        },
        {
          disabled: disabled || wo.status === 'COMPLETED' || wo.status === 'OPEN' || wo.status === 'UNASSIGNED',
          className: clsx({
            'd-none': wo.status === 'COMPLETED' || wo.status === 'OPEN' || wo.status === 'UNASSIGNED',
          }),
          permission: PERMISSIONS.MAINTENANCE,
          text: 'Mark as completed',
          onClick: () => {
            if (wo.id && wo.status === 'ASSIGNED') {
              changeStatus(wo.id, wo.service_request, 'COMPLETED');
            }
          },
        },
        {
          text: 'Assign',
          permission: PERMISSIONS.MAINTENANCE,
          disabled: disabled || wo.status === 'COMPLETED' || wo.status === 'ASSIGNED',
          className: clsx({ 'd-none': wo.status === 'COMPLETED' || wo.status === 'ASSIGNED' }),
          onClick: () => {
            if (wo.id && (wo.status === 'OPEN' || wo.status === 'UNASSIGNED')) {
              SweetAlert({
                html: (
                  <AssignWorkOrderModal
                    workOrder={wo.id}
                    assignTo={wo.assign_to as number}
                    serviceRequest={wo.service_request}
                  />
                ),
              }).fire({
                allowOutsideClick: () => !SwalExtended.isLoading(),
              });
            }
          },
        },
        {
          disabled: disabled || wo.status === 'OPEN' || wo.status === 'UNASSIGNED' || wo.status === 'COMPLETED',
          className: clsx({
            'd-none': wo.status === 'OPEN' || wo.status === 'UNASSIGNED' || wo.status === 'COMPLETED',
          }),
          text: 'Unassign',
          permission: PERMISSIONS.MAINTENANCE,
          onClick: () => {
            if (wo.id && wo.status === 'ASSIGNED') {
              changeStatus(wo.id, wo.service_request, 'UNASSIGNED');
            }
          },
        },
      ]}
    />
  );
};
