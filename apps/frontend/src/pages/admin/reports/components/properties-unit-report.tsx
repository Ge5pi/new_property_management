import { Button, Card, Col, Form, Row } from 'react-bootstrap';

import { Field, Formik } from 'formik';

import { BackButton } from 'components/back-button';
import { ItemUnit, ItemUnitStatus } from 'components/custom-cell';
import { Table } from 'components/table';

import { CustomSelect } from 'core-ui/custom-select';
import { Avatar } from 'core-ui/user-avatar';

import CustomTableHeader from './custom-table-header';
import StatusCard from './status-card';

const PropertiesUnitReport = () => {
  const propertiesUnitReportData = [
    {
      unit: {
        id: 1123,
        unit_type: {
          bed_rooms: 2,
          bath_rooms: 2,
        },
        is_occupied: true,
      },
      monthly_rent: '$1,000',
      status: 'Available',
    },
  ];

  const columns = [
    {
      Header: 'Unit ID',
      accessor: 'unit',
      Cell: ItemUnit,
      width: '300px',
    },
    {
      Header: 'Monthly Rent',
      accessor: 'monthly_rent',
      width: '200px',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ItemUnitStatus,
      width: '140px',
    },
    {
      Header: 'Lease start-end',
      accessor: 'lease_start_end',
      Cell: () => <div>01/01/2021 - 01/01/2022</div>,
      width: '170px',
    },
    {
      Header: 'Tenant',
      accessor: 'tenant_name',
      Cell: () => <Avatar name="John Doe" size={30} showName={true} />,
      width: '200px',
    },
  ];

  return (
    <div>
      <div>
        <BackButton />
        <h1 className="fw-bold h4 mt-1">Unit Report</h1>
      </div>

      <Card className="border-0 p-0 page-section my-3">
        <Card.Body>
          <Formik
            initialValues={{
              from_date: '',
              to_date: '',
              status: '',
            }}
            onSubmit={values => {
              console.log('::: values', values);
            }}
          >
            {({ handleSubmit }) => (
              <Form className="text-start" noValidate onSubmit={handleSubmit}>
                <Row>
                  <Col sm={3} lg={2}>
                    <CustomSelect
                      labelText="Property"
                      name="property"
                      controlId="PropertiesUnitReportFormProperty"
                      options={[]}
                      searchable
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-4',
                      }}
                      placeholder="Select here"
                    />
                  </Col>
                  <Col sm={3} lg={2}>
                    <Form.Group className="mb-4" controlId="PropertiesUnitReportFormLeaseStartDate">
                      <Form.Label className="form-label-md">Lease start date</Form.Label>
                      <Field name="lease_start_date" type="date" as={Form.Control} placeholder="Type here" />
                    </Form.Group>
                  </Col>
                  <Col sm={3} lg={2}>
                    <Form.Group className="mb-4" controlId="PropertiesUnitReportFormLeaseEndDate">
                      <Form.Label className="form-label-md">Lease end date</Form.Label>
                      <Field name="lease_end_date" type="date" as={Form.Control} placeholder="Type here" />
                    </Form.Group>
                  </Col>
                  <Col sm={3} lg={2}>
                    <CustomSelect
                      labelText="status"
                      name="status"
                      controlId="PropertiesUnitReportFormStatus"
                      options={[]}
                      searchable
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-4',
                      }}
                      placeholder="Select here"
                    />
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-3">
                  <Button variant="light border-primary" className="px-4 py-1 me-3">
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" className="px-4 py-1">
                    Get Report
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>

      <StatusCard
        data={[
          { name: 'Available', value: 400, color: '#189915' },
          { name: 'Occupied', value: 300, color: '#CE6300' },
        ]}
        emptyColor="#F3F3F3"
        total={1000}
      />

      <Table
        wrapperClass="border"
        className="m-0"
        customHeader={
          <CustomTableHeader
            handleCreateNewRecord={() => {
              console.log('::: values');
            }}
            total={propertiesUnitReportData.length}
          />
        }
        showTotal={false}
        shadow={false}
        data={propertiesUnitReportData}
        columns={columns}
        total={propertiesUnitReportData.length}
      />
    </div>
  );
};

export default PropertiesUnitReport;
