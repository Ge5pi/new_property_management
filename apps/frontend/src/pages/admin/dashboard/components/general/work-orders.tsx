import { Col, Row } from 'react-bootstrap';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetDashboardGeneralStatisticsQuery } from 'services/api/dashboard';
import { useGetAllWorkOrdersQuery } from 'services/api/work-orders';

import { ItemStatus, ItemUserName, ItemWorkOrder } from 'components/custom-cell';
import { SimpleTable } from 'components/table';

import { useRedirect } from 'hooks/useRedirect';

import { IWorkOrdersPieChartsData } from 'interfaces/IDashboard';
import { IWorkOrdersAPI } from 'interfaces/IWorkOrders';

import CustomTableHeader from '../custom-table-header';
import PieChart from '../pie-chart';

const returnChartsData = (workOrdersChartsData: IWorkOrdersPieChartsData) => {
  return [
    {
      name: 'Unassigned',
      value: workOrdersChartsData.unassigned_work_orders_count,
      color: '#DADCDB',
      textColor: '#8F8F8F',
    },
    {
      name: 'Assigned',
      value: workOrdersChartsData.assigned_work_orders_count,
      color: '#638DFA',
      textColor: '#FFFFFF',
    },
    {
      name: 'Inprogress',
      value: workOrdersChartsData.open_work_orders_count,
      color: '#FBC02D',
      textColor: '#FFFFFF',
    },
    {
      name: 'Completed',
      value: workOrdersChartsData.completed_work_orders_count,
      color: '#33D473',
      textColor: '#FFFFFF',
    },
  ];
};

function WorkOrders() {
  const { redirect } = useRedirect();
  const { data: workOrdersData, ...rest } = useGetAllWorkOrdersQuery({ size: 10 });
  const workOrdersCharts = useGetDashboardGeneralStatisticsQuery();

  const columns = [
    {
      Header: 'Work Order ID',
      accessor: 'wo',
      Cell: ItemWorkOrder,
      disableSortBy: true,
      minWidth: 175,
    },
    {
      Header: 'Property',
      accessor: 'property_name',
      disableSortBy: true,
      minWidth: 300,
    },
    {
      Header: 'Assigned to',
      accessor: 'assigned_to',
      Cell: ItemUserName,
      disableSortBy: true,
      minWidth: 175,
    },
    {
      Header: 'Status',
      accessor: 'status_with_obj',
      Cell: ItemStatus,
      disableSortBy: true,
    },
  ];

  return (
    <Row className="mb-3 page-section align-items-stretch gx-0">
      <Col md={4}>
        <div className="p-4">
          <p className="fw-bold fs-5 mb-5">Work Orders</p>
          <ApiResponseWrapper
            {...workOrdersCharts}
            showError={false}
            hideIfNoResults
            renderResults={data => {
              const chartData = returnChartsData(data);
              return <PieChart chartData={chartData} />;
            }}
          />
        </div>
      </Col>
      <Col md={8} className="border">
        <SimpleTable
          {...rest}
          clickable
          wrapperClass="detail-section-table min-h-100"
          customHeader={<CustomTableHeader url="/admin/maintenance/work-orders" />}
          hideMainHeaderComponent
          showTotal={false}
          data={workOrdersData?.results ?? []}
          columns={columns}
          shadow={false}
          onRowClick={row => {
            if (row.original) {
              const row1 = row.original as IWorkOrdersAPI;
              if ('id' in row1) {
                const work_order = row1.id;
                redirect(`/maintenance/work-orders/${work_order}/details/${row1.service_request}`, false, 'dashboard');
              }
            }
          }}
        />
      </Col>
    </Row>
  );
}

export default WorkOrders;
