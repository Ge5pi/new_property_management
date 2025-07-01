import { Col, Row } from 'react-bootstrap';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetRentalApplicantsQuery } from 'services/api/applicants';
import { useGetDashboardGeneralStatisticsQuery } from 'services/api/dashboard';

import { ItemName, ItemStatus, ItemUserName } from 'components/custom-cell';
import { SimpleTable } from 'components/table';

import { useRedirect } from 'hooks/useRedirect';

import { IApplicantForm } from 'interfaces/IApplications';
import { IRentalApplicationsPieChartsData } from 'interfaces/IDashboard';

import CustomTableHeader from '../custom-table-header';
import PieChart from '../pie-chart';

const returnChartsData = (rentalApplicationsChartsData: IRentalApplicationsPieChartsData) => {
  return [
    {
      name: 'Accepted',
      value: rentalApplicationsChartsData.approved_rental_applications_count,
      color: '#33D473',
      textColor: '#FFFFFF',
    },
    {
      name: 'Rejected',
      value: rentalApplicationsChartsData.rejected_rental_applications_count,
      color: '#E12323',
      textColor: '#FFFFFF',
    },
    {
      name: 'Pending',
      value: rentalApplicationsChartsData.pending_rental_applications_count,
      color: '#FBC02D',
      textColor: '#FFFFFF',
    },
    {
      name: 'On hold',
      value: rentalApplicationsChartsData.on_hold_rental_applications_count,
      color: '#638DFA',
      textColor: '#FFFFFF',
    },
    {
      name: 'Draft',
      value: rentalApplicationsChartsData.draft_rental_applications_count,
      color: '#DADCDB',
      textColor: '#8F8F8F',
    },
  ];
};

function RentalApplications() {
  const { redirect } = useRedirect();
  const { data: rentalApplicationsData, ...rest } = useGetRentalApplicantsQuery({ size: 10 });
  const rentalApplicationsCharts = useGetDashboardGeneralStatisticsQuery();

  const columns = [
    {
      Header: 'Property / unit',
      accessor: 'property',
      disableSortBy: true,
      Cell: ItemName,
      minWidth: 300,
    },
    {
      Header: 'Full Name',
      accessor: 'full_name',
      disableSortBy: true,
      Cell: ItemUserName,
      minWidth: 175,
    },
    {
      Header: 'Phone number',
      accessor: 'phone_number',
      disableSortBy: true,
    },
    {
      Header: 'Email',
      disableSortBy: true,
      accessor: 'email',
    },
    {
      Header: 'Status',
      accessor: 'status_with_obj',
      disableSortBy: true,
      Cell: ItemStatus,
    },
  ];

  return (
    <Row className="mb-3 page-section align-items-stretch gx-0">
      <Col md={4}>
        <div className="p-4">
          <p className="fw-bold fs-5 mb-5">Rental Applications</p>
          <ApiResponseWrapper
            {...rentalApplicationsCharts}
            showError={false}
            hideIfNoResults
            renderResults={data => {
              const chartData = returnChartsData(data);
              return <PieChart chartData={chartData} />;
            }}
          />
        </div>
      </Col>
      <Col className="border" md={8}>
        <SimpleTable
          {...rest}
          clickable
          wrapperClass="detail-section-table min-h-100"
          customHeader={<CustomTableHeader url="/admin/leasing/rental-applications" />}
          hideMainHeaderComponent
          showTotal={false}
          data={rentalApplicationsData?.results ?? []}
          columns={columns}
          shadow={false}
          onRowClick={row => {
            if (row.original) {
              const row1 = row.original as IApplicantForm;
              if ('id' in row1) {
                const applicant = row1.id;
                const application = row1.rental_application;
                redirect(`/leasing/rental-applications/${applicant}/details/${application}`, false, 'dashboard');
              }
            }
          }}
        />
      </Col>
    </Row>
  );
}

export default RentalApplications;
