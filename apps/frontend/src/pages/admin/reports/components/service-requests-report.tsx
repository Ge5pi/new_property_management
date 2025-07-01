import { Button, Card, Col, Form, Row } from 'react-bootstrap';

import { Field, Formik } from 'formik';

import { BackButton } from 'components/back-button';
import { ItemName, ItemPriority, ItemStatus } from 'components/custom-cell';
import { Table } from 'components/table';

import { CustomSelect } from 'core-ui/custom-select';

import CustomTableHeader from './custom-table-header';
import StatusCard from './status-card';

const ServiceRequestsReport = () => {
  const serviceRequestReportData = [
    {
      property: {
        title: 'Property 1',
        subtitle: 'Address 1',
      },
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vitae.',
      status: 'Available',
      work_orders_count: 10,
      priority: 'URGENT',
    },
  ];

  const columns = [
    {
      Header: 'Property name',
      accessor: 'property',
      Cell: ItemName,
      width: '200px',
    },
    {
      Header: 'Description',
      accessor: 'description',
      width: '400px',
    },
    {
      Header: 'No. of work orders',
      accessor: 'work_orders_count',
      width: '175px',
    },
    {
      Header: 'Priority',
      accessor: 'priority',
      Cell: ItemPriority,
      width: '175px',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ItemStatus,
      width: '140px',
    },
  ];

  return (
    <div>
      <div>
        <BackButton />
        <h1 className="fw-bold h4 mt-1">Service request report</h1>
      </div>

      <Card className="border-0 p-0 page-section my-3">
        <Card.Body>
          <Formik
            initialValues={{
              from_date: '',
              to_date: '',
              status: '',
              priority: '',
            }}
            onSubmit={values => {
              console.log('::: values', values);
            }}
          >
            {({ handleSubmit }) => (
              <Form className="text-start" noValidate onSubmit={handleSubmit}>
                <Row>
                  <Col sm={3} lg={2}>
                    <Form.Group className="mb-4" controlId="ServiceRequestsReportFormFromDate">
                      <Form.Label className="form-label-md">From date</Form.Label>
                      <Field name="from_date" type="date" as={Form.Control} placeholder="Type here" />
                    </Form.Group>
                  </Col>
                  <Col sm={3} lg={2}>
                    <Form.Group className="mb-4" controlId="ServiceRequestsReportFormToDate">
                      <Form.Label className="form-label-md">To date</Form.Label>
                      <Field name="to_date" type="date" as={Form.Control} placeholder="Type here" />
                    </Form.Group>
                  </Col>

                  <Col sm={3} lg={2}>
                    <CustomSelect
                      labelText="status"
                      name="status"
                      controlId="ServiceRequestsReportFormStatus"
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
                    <CustomSelect
                      labelText="Priority"
                      name="priority"
                      controlId="ServiceRequestsReportFormPriority"
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
            total={serviceRequestReportData.length}
          />
        }
        showTotal={false}
        shadow={false}
        data={serviceRequestReportData}
        columns={columns}
        total={serviceRequestReportData.length}
      />
    </div>
  );
};

export default ServiceRequestsReport;
