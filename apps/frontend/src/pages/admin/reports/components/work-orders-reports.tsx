import { Button, Card, Col, Form, Row } from 'react-bootstrap';

import { Field, Formik } from 'formik';

import { BackButton } from 'components/back-button';
import { ItemDate, ItemStatus, ItemWorkOrder } from 'components/custom-cell';
import { Table } from 'components/table';

import { CustomSelect } from 'core-ui/custom-select';

import CustomTableHeader from './custom-table-header';
import StatusCard from './status-card';

const WorkOrdersReport = () => {
  const workOrdersReportData = [
    {
      wo: {
        id: 123,
        is_recurring: true,
      },
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vitae.',
      created_at: '2021-01-01',
      status: 'Completed',
      property_name: 'Property name',
    },
  ];

  const columns = [
    {
      Header: 'Work Order No.',
      accessor: 'wo',
      Cell: ItemWorkOrder,
      width: '250px',
    },
    {
      Header: 'Property name',
      accessor: 'property_name',
      width: '300px',
    },
    {
      Header: 'Description',
      accessor: 'description',
      width: '300px',
    },
    {
      Header: 'Created date',
      accessor: 'created_at',
      Cell: ItemDate,
      width: '150px',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ItemStatus,
      width: '125px',
    },
  ];

  return (
    <div>
      <div>
        <BackButton />
        <h1 className="fw-bold h4 mt-1">Work orders report</h1>
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
                    <Form.Group className="mb-4" controlId="WorkOrdersReportFormFromDate">
                      <Form.Label className="form-label-md">From date</Form.Label>
                      <Field name="from_date" type="date" as={Form.Control} placeholder="Type here" />
                    </Form.Group>
                  </Col>
                  <Col sm={3} lg={2}>
                    <Form.Group className="mb-4" controlId="WorkOrdersReportFormToDate">
                      <Form.Label className="form-label-md">To date</Form.Label>
                      <Field name="to_date" type="date" as={Form.Control} placeholder="Type here" />
                    </Form.Group>
                  </Col>

                  <Col sm={3} lg={2}>
                    <CustomSelect
                      labelText="Status"
                      name="status"
                      controlId="WorkOrdersReportFormStatus"
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
          { name: 'Completed', value: 400, color: '#189915' },
          { name: 'Incomplete', value: 300, color: '#CFCFCF' },
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
            total={workOrdersReportData.length}
          />
        }
        showTotal={false}
        shadow={false}
        data={workOrdersReportData}
        columns={columns}
        total={workOrdersReportData.length}
      />
    </div>
  );
};

export default WorkOrdersReport;
