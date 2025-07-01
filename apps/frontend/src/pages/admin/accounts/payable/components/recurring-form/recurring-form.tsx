import { Button, Card, Col, Form, Row, Stack } from 'react-bootstrap';

import { clsx } from 'clsx';
import { Field, Formik } from 'formik';

import { BackButton } from 'components/back-button';
import { Dropzone } from 'components/dropzone';
import { Log } from 'components/log';

import { CustomSelect, FilterInput } from 'core-ui/custom-select';
import { TrashIcon } from 'core-ui/icons';

import formFields from './form-fields';
import formValidation from './form-validation';
import ReceiptAttachments from './recurring-attachments';

const RecurringForm = () => {
  const onSubmit = () => {
    console.log('::: values');
  };

  const onDrop = () => {
    // TODO: write on drop logic when integrating
  };

  const {
    notes,
    payer,
    memo_on_check,
    remarks,
    total_amount,
    start_date,
    end_date,
    bill_day,
    due_date,
    post_code,
    repeats,
    months,
  } = formFields;

  return (
    <div>
      <Formik
        className="text-start"
        onSubmit={onSubmit}
        initialValues={{
          title: '',
          gl_account: '',
          receipt_date: '',
          reference_no: '',
          property: '',
          unit: '',
          receipt_amount: '',
          payer: '',
          notes: '',
          remarks: '',
          charge_amount: '',
          recurring_work_order: '',
          is_recurring: false,
          total_amount: '',
          start_date: '',
          end_date: '',
          bill_day: '',
          due_date: '',
          post_code: '',
          memo_on_check: '',
          repeats: '',
          months: '',
        }}
        validationSchema={formValidation}
      >
        {({ errors, touched, setFieldValue, setFieldTouched }) => (
          <>
            <Stack className="justify-content-between" direction="horizontal">
              <div>
                <BackButton />
                <h1 className="fw-bold h4 mt-1">Owner draw ID-213</h1>
              </div>
              <div>
                <Button variant="light border-primary" className="px-4 py-1 me-3">
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="px-4 py-1">
                  Save
                </Button>
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
                  <Col sm={6} md={4}>
                    <FilterInput
                      name={payer.name}
                      labelText="Payer"
                      controlId="RecurringFormPayer"
                      placeholder="Select Payer"
                      options={[]}
                      classNames={{
                        labelClass: 'form-label-md',
                        wrapperClass: 'mb-4',
                      }}
                      onSelectChange={() => setFieldValue(payer.name, false)}
                      onBlurChange={() => setFieldTouched(payer.name, true)}
                      isValid={touched.payer && !errors.payer}
                      isInvalid={touched.payer && !!errors.payer}
                      labelKey={payer.name}
                      error={errors.payer}
                      onSearch={function (): void {
                        throw new Error('Function not implemented.');
                      }}
                    />
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
                  <Col sm={6} md={2}>
                    <Form.Group className="mb-4" controlId="RecurringFormStartDate">
                      <Form.Label className="form-label-md">Start Date</Form.Label>
                      <Field
                        name={start_date.name}
                        type="date"
                        className={clsx(
                          'form-control',
                          touched?.start_date && (errors && errors.start_date ? 'is-invalid' : 'is-valid')
                        )}
                      />
                      <Form.Control.Feedback type="invalid">{errors.start_date}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col sm={6} md={2}>
                    <Form.Group className="mb-4" controlId="RecurringFormEndDate">
                      <Form.Label className="form-label-md">End Date</Form.Label>
                      <Field
                        name={end_date.name}
                        type="date"
                        className={clsx(
                          'form-control',
                          touched?.end_date && (errors && errors.end_date ? 'is-invalid' : 'is-valid')
                        )}
                      />
                      <Form.Control.Feedback type="invalid">{errors.end_date}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="gx-sm-4 gx-0">
                  <Col sm={6} md={2}>
                    <Form.Group className="mb-4" controlId="RecurringFormBillDay">
                      <Form.Label className="form-label-md">Bill Day</Form.Label>
                      <Field
                        name={bill_day.name}
                        type="number"
                        className={clsx(
                          'form-control',
                          touched?.bill_day && (errors && errors.bill_day ? 'is-invalid' : 'is-valid')
                        )}
                      />
                      <Form.Control.Feedback type="invalid">{errors.bill_day}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col sm={6} md={2}>
                    <CustomSelect
                      labelText="Due date"
                      onSelectChange={value => {
                        setFieldValue(due_date.name, value);
                        setFieldTouched(due_date.name, true);
                      }}
                      onBlurChange={() => {
                        setFieldTouched(due_date.name, true);
                      }}
                      name={due_date.name}
                      controlId="RecurringFormDueDate"
                      options={[{ value: '1', label: 'Option 1' }]}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-4',
                      }}
                      isInvalid={!!(touched.due_date && errors && errors.due_date)}
                      isValid={!!(touched.due_date && errors && !errors.due_date)}
                      error={errors && errors.due_date}
                    />
                  </Col>
                  <Col sm={6} md={2}>
                    <Form.Group className="mb-4" controlId="RecurringFormPostCode">
                      <Form.Label className="form-label-md">Post code</Form.Label>
                      <Field
                        name={post_code.name}
                        type="number"
                        className={clsx(
                          'form-control',
                          touched?.post_code && (errors && errors.post_code ? 'is-invalid' : 'is-valid')
                        )}
                      />
                      <Form.Control.Feedback type="invalid">{errors.post_code}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col sm={6} md={2}>
                    <Form.Group className="mb-4" controlId="RecurringFormMemoOnCheck">
                      <Form.Label className="form-label-md">Memo on check</Form.Label>
                      <Field
                        name={memo_on_check.name}
                        type="number"
                        className={clsx(
                          'form-control',
                          touched?.memo_on_check && (errors && errors.memo_on_check ? 'is-invalid' : 'is-valid')
                        )}
                      />
                      <Form.Control.Feedback type="invalid">{errors.memo_on_check}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="gx-sm-4 gx-0">
                  <Col sm={6} md={2}>
                    <CustomSelect
                      labelText="Repeats"
                      onSelectChange={value => {
                        setFieldValue(repeats.name, value);
                        setFieldTouched(repeats.name, true);
                      }}
                      onBlurChange={() => {
                        setFieldTouched(repeats.name, true);
                      }}
                      name={repeats.name}
                      controlId="RecurringFormRepeats"
                      options={[{ value: '1', label: 'Option 1' }]}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-4',
                      }}
                      isInvalid={!!(touched.repeats && errors && errors.repeats)}
                      isValid={!!(touched.repeats && errors && !errors.repeats)}
                      error={errors && errors.repeats}
                    />
                  </Col>
                  <Col sm={6} md={2}>
                    <CustomSelect
                      labelText="Select months"
                      onSelectChange={value => {
                        setFieldValue(months.name, value);
                        setFieldTouched(months.name, true);
                      }}
                      onBlurChange={() => {
                        setFieldTouched(months.name, true);
                      }}
                      name={months.name}
                      controlId="RecurringFormMonths"
                      options={[{ value: '1', label: 'Option 1' }]}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-4',
                      }}
                      isInvalid={!!(touched.months && errors && errors.months)}
                      isValid={!!(touched.months && errors && !errors.months)}
                      error={errors && errors.months}
                    />
                  </Col>
                </Row>

                <Row className="gx-sm-4 gx-0">
                  <Col sm={6} md={8}>
                    <Form.Group className="mb-4" controlId="ReceiptFormRemarks">
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
              </Card.Body>
            </Card>

            <Card className="border-0 p-4 page-section mb-3">
              <Card.Body className="p-0">
                <Row className="gx-sm-4 gx-0">
                  <Col>
                    <Form.Group className="mb-4" controlId="ReceiptFormNotes">
                      <Form.Label className="form-label-md mb-0 fw-bold">Notes</Form.Label>
                      <p className="small">
                        Write down all relevant information and quick notes for your help over here
                      </p>
                      <Field
                        as="textarea"
                        name={notes.name}
                        type="text"
                        row={8}
                        className={clsx(
                          'secondary-textarea form-control',
                          touched?.notes && (errors && errors.notes ? 'is-invalid' : 'is-valid')
                        )}
                        placeholder="Type here"
                      />
                      <Form.Control.Feedback type="invalid">{errors && errors?.notes}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="border-0 p-4 page-section mb-3">
              <Row className="g-0 align-items-stretch">
                <Col xl={7} lg={8}>
                  <ReceiptAttachments />
                </Col>
                <Col xl={5} lg={4}>
                  <Stack className="bg-white h-100">
                    <div className="py-3 px-lg-4 px-3 flex-fill">
                      <Dropzone styles={{ minHeight: 320 }} onDrop={onDrop} />
                    </div>
                  </Stack>
                </Col>
              </Row>
            </Card>

            <Card className="border-0 p-4 page-section mb-3">
              <Card.Header className="border-0 bg-transparent text-start">
                <Row className="gx-0 align-items-center py-1 flex-wrap">
                  <Col>
                    <p className="fw-bold m-0 text-primary">Audit Log</p>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="text-start p-0">
                <Log logs={[]} />
              </Card.Body>
            </Card>
          </>
        )}
      </Formik>
    </div>
  );
};

export default RecurringForm;
