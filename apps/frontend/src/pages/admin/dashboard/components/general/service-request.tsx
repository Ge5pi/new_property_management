import { Col, Row } from 'react-bootstrap';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetDashboardGeneralStatisticsQuery } from 'services/api/dashboard';
import { useGetServiceRequestsQuery } from 'services/api/service-requests';

import { ItemName, ItemStatus } from 'components/custom-cell';
import { SimpleTable } from 'components/table';

import { useRedirect } from 'hooks/useRedirect';

import { IServiceRequestPieChartsData } from 'interfaces/IDashboard';

import CustomTableHeader from '../custom-table-header';
import PieChart from '../pie-chart';

const returnChartsData = (serviceRequestChartsData: IServiceRequestPieChartsData) => {
  return [
    {
      name: 'Pending',
      value: serviceRequestChartsData.pending_service_requests_count,
      color: '#DADCDB',
      textColor: '#8F8F8F',
    },
    {
      name: 'Completed',
      value: serviceRequestChartsData.completed_service_requests_count,
      color: '#33D473',
      textColor: '#FFFFFF',
    },
  ];
};

function ServiceRequest() {
  const { redirect } = useRedirect();
  const { data: serviceRequestData, ...rest } = useGetServiceRequestsQuery({ size: 10 });
  const serviceRequestCharts = useGetDashboardGeneralStatisticsQuery();

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
  ];

  return (
    <Row className="mb-3 page-section align-items-stretch gx-0">
      <Col md={4}>
        <div className="p-4">
          <p className="fw-bold fs-5 mb-5">Service Request</p>
          <ApiResponseWrapper
            {...serviceRequestCharts}
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
          customHeader={<CustomTableHeader url="/admin/maintenance/service-requests" />}
          hideMainHeaderComponent
          showTotal={false}
          data={serviceRequestData?.results ?? []}
          columns={columns}
          shadow={false}
          onRowClick={row => {
            if (row.original) {
              if ('id' in row.original) {
                const serviceReq = row.original['id'];
                redirect(`/maintenance/service-requests/details/${serviceReq}`, false, 'dashboard');
              }
            }
          }}
        />
      </Col>
    </Row>
  );
}

export default ServiceRequest;
