import { Button, Card, Col, Form, Row } from 'react-bootstrap';

import { Field, Formik } from 'formik';

import { BackButton } from 'components/back-button';
import { ItemName, ItemOwner, ItemUnitStatus } from 'components/custom-cell';
import { Table } from 'components/table';

import { CustomSelect } from 'core-ui/custom-select';

import CustomTableHeader from './custom-table-header';
import StatusCard from './status-card';

const AssociationUnitReport = () => {
  const associationUnitReportData = [
    {
      property: {
        title: 'Property 1',
        subtitle: 'Address 1',
      },
      status: 'Available',
      total_units: 10,
      property_manager: 'John Doe',
      owners: [
        {
          first_name: 'John',
          last_name: 'Doe',
        },
        {
          first_name: 'John',
          last_name: 'Doe',
        },
        {
          first_name: 'John',
          last_name: 'Doe',
        },
      ],
      date_of_leasing: '01/01/2021',
    },
  ];

  const columns = [
    {
      Header: 'Association name',
      accessor: 'property',
      Cell: ItemName,
      width: '200px',
    },
    {
      Header: 'No. of units',
      accessor: 'total_units',
      width: '200px',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ItemUnitStatus,
      width: '200px',
    },
    {
      Header: 'Owners',
      accessor: 'owners',
      Cell: ItemOwner,
      width: '170px',
    },
    {
      Header: 'Property Manager',
      accessor: 'property_manager',
      width: '200px',
    },
    {
      Header: 'Date of leasing',
      accessor: 'date_of_leasing',
      width: '200px',
    },
  ];

  return (
    <div>
      <div>
        <BackButton />
        <h1 className="fw-bold h4 mt-1">Association Unit Report</h1>
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
                      labelText="Associations"
                      name="associations"
                      controlId="AssociationUnitReportFormAssociations"
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
                    <Form.Group className="mb-4" controlId="AssociationUnitReportFormLeaseStartDate">
                      <Form.Label className="form-label-md">Lease start date</Form.Label>
                      <Field name="lease_start_date" type="date" as={Form.Control} placeholder="Type here" />
                    </Form.Group>
                  </Col>
                  <Col sm={3} lg={2}>
                    <Form.Group className="mb-4" controlId="AssociationUnitReportFormLeaseEndDate">
                      <Form.Label className="form-label-md">Lease end date</Form.Label>
                      <Field name="lease_end_date" type="date" as={Form.Control} placeholder="Type here" />
                    </Form.Group>
                  </Col>
                  <Col sm={3} lg={2}>
                    <CustomSelect
                      labelText="status"
                      name="status"
                      controlId="AssociationUnitReportFormStatus"
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
          { name: 'Occupied', value: 400, color: '#189915' },
          { name: 'Vacant', value: 300, color: '#CFCFCF' },
        ]}
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
            total={associationUnitReportData.length}
          />
        }
        showTotal={false}
        shadow={false}
        data={associationUnitReportData}
        columns={columns}
        total={associationUnitReportData.length}
      />
    </div>
  );
};

export default AssociationUnitReport;
