import { Button, Card, Col, Form, Row, Stack } from 'react-bootstrap';

import { clsx } from 'clsx';
import { Field, Formik } from 'formik';

import { BackButton } from 'components/back-button';

import { CustomSelect } from 'core-ui/custom-select';
import { TrashIcon } from 'core-ui/icons';

import formFields from './form-fields';
import formValidation from './form-validation';

const TransferByCash = () => {
  const onSubmit = () => {
    console.log('::: values');
  };

  const { total_amount, reference_no, property, unit, from_account, to_account, date, remarks } = formFields;

  return (
    <div>
      <Formik
        className="text-start"
        onSubmit={onSubmit}
        initialValues={{
          total_amount: '',
          due_date: '',
          reference_no: '',
          property: '',
          unit: '',
          from_account: '',
          to_account: '',
          date: '',
          remarks: '',
        }}
        validationSchema={formValidation}
      >
        {({ errors, touched, setFieldValue, setFieldTouched }) => (
          <>
            <Stack className="justify-content-between" direction="horizontal">
              <div>
                <BackButton />
                <h1 className="fw-bold h4 mt-1">Vendor Bill ID-213</h1>
              </div>
            </Stack>

            <Card className="border-0 p-4 page-section mb-3">
              <Card.Header className="border-0 p-0 bg-transparent text-start">
                <Stack direction="horizontal" className="justify-content-between">
                  <div>
                    <p className="fw-bold m-0 text-primary">Bill Details</p>
                    <p className="small">Basic Information of this bill</p>
                  </div>
                  <Button className="mb-auto shadow-none btn btn-link bg-transparent text-decoration-none d-inline-flex align-items-center">
                    <TrashIcon color="#fc3939" /> <small className="text-danger ms-2">Delete</small>
                  </Button>
                </Stack>
              </Card.Header>

              <Card.Body className="p-0 mt-4">
                <Row className="gx-sm-4 gx-0">
                  <Col sm={6} md={3}>
                    <CustomSelect
                      labelText="Property"
                      onSelectChange={value => {
                        setFieldValue(property.name, value);
                        setFieldTouched(property.name, true);
                      }}
                      onBlurChange={() => {
                        setFieldTouched(property.name, true);
                      }}
                      name={property.name}
                      controlId="RecurringFormGLAccount"
                      options={[{ value: '1', label: 'Option 1' }]}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-4',
                      }}
                      isInvalid={!!(touched.property && errors && errors.property)}
                      isValid={!!(touched.property && errors && !errors.property)}
                      error={errors && errors.property}
                    />
                  </Col>
                  <Col sm={6} md={3}>
                    <CustomSelect
                      labelText="Select unit"
                      onSelectChange={value => {
                        setFieldValue(unit.name, value);
                        setFieldTouched(unit.name, true);
                      }}
                      onBlurChange={() => {
                        setFieldTouched(unit.name, true);
                      }}
                      name={unit.name}
                      controlId="RecurringFormGLAccount"
                      options={[{ value: '1', label: 'Option 1' }]}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-4',
                      }}
                      isInvalid={!!(touched.unit && errors && errors.unit)}
                      isValid={!!(touched.unit && errors && !errors.unit)}
                      error={errors && errors.unit}
                    />
                  </Col>
                </Row>
                <Row className="gx-sm-4 gx-0">
                  <Col sm={6} md={2}>
                    <Form.Group className="mb-4" controlId="RecurringFormReferenceNo">
                      <Form.Label className="form-label-md">Reference No.</Form.Label>
                      <Field
                        name={reference_no.name}
                        type="number"
                        className={clsx(
                          'form-control',
                          touched?.reference_no && (errors && errors.reference_no ? 'is-invalid' : 'is-valid')
                        )}
                      />
                      <Form.Control.Feedback type="invalid">{errors.reference_no}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col sm={6} md={2}>
                    <Form.Group className="mb-4" controlId="RecurringFormTotalAmount">
                      <Form.Label className="form-label-md">Total Amount</Form.Label>
                      <Field
                        name={total_amount.name}
                        type="text"
                        className={clsx(
                          'form-control',
                          touched?.total_amount && (errors && errors.total_amount ? 'is-invalid' : 'is-valid')
                        )}
                        placeholder="Title"
                      />
                      <Form.Control.Feedback type="invalid">{errors.total_amount}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="gx-sm-4 gx-0">
                  <Col sm={6} md={4}>
                    <CustomSelect
                      labelText="From Account"
                      onSelectChange={value => {
                        setFieldValue(from_account.name, value);
                        setFieldTouched(from_account.name, true);
                      }}
                      onBlurChange={() => {
                        setFieldTouched(from_account.name, true);
                      }}
                      name={from_account.name}
                      controlId="RecurringFormRepeatsPurchaseOrder"
                      options={[{ value: '1', label: 'Option 1' }]}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-4',
                      }}
                      isInvalid={!!(touched.from_account && errors && errors.from_account)}
                      isValid={!!(touched.from_account && errors && !errors.from_account)}
                      error={errors && errors.from_account}
                    />
                  </Col>
                  <Col sm={6} md={4}>
                    <CustomSelect
                      labelText="To Account"
                      onSelectChange={value => {
                        setFieldValue(to_account.name, value);
                        setFieldTouched(to_account.name, true);
                      }}
                      onBlurChange={() => {
                        setFieldTouched(to_account.name, true);
                      }}
                      name={to_account.name}
                      controlId="RecurringFormRepeatsWorkOrder"
                      options={[{ value: '1', label: 'Option 1' }]}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-4',
                      }}
                      isInvalid={!!(touched.to_account && errors && errors.to_account)}
                      isValid={!!(touched.to_account && errors && !errors.to_account)}
                      error={errors && errors.to_account}
                    />
                  </Col>
                  <Col sm={6} md={2}>
                    <Form.Group className="mb-4" controlId="RecurringFormDueDate">
                      <Form.Label className="form-label-md">Date</Form.Label>
                      <Field
                        name={date.name}
                        type="date"
                        className={clsx(
                          'form-control',
                          touched?.date && (errors && errors.date ? 'is-invalid' : 'is-valid')
                        )}
                      />
                      <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="gx-sm-4 gx-0">
                  <Col sm={6} md={8}>
                    <Form.Group className="mb-4" controlId="ReceiptFormDescription">
                      <Form.Label className="form-label-md">Remarks</Form.Label>
                      <Field
                        name={remarks.name}
                        type="text"
                        as="textarea"
                        className={clsx(
                          'form-control',
                          touched?.remarks && (errors && errors.remarks ? 'is-invalid' : 'is-valid')
                        )}
                      />
                      <Form.Control.Feedback type="invalid">{errors.remarks}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Stack className="justify-content-end mt-4" direction="horizontal">
                  <div>
                    <Button variant="light border-primary" className="px-4 py-1 me-3">
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit" className="px-4 py-1">
                      Transfer
                    </Button>
                  </div>
                </Stack>
              </Card.Body>
            </Card>
          </>
        )}
      </Formik>
    </div>
  );
};

export default TransferByCash;
