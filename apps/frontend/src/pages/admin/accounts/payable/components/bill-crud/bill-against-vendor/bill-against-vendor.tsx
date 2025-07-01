import { Button, Card, Col, Form, Row, Stack } from 'react-bootstrap';

import { clsx } from 'clsx';
import { Field, Formik } from 'formik';

import { BackButton } from 'components/back-button';
import { Dropzone } from 'components/dropzone';
import { Log } from 'components/log';

import { CustomSelect, FilterInput } from 'core-ui/custom-select';
import { TrashIcon } from 'core-ui/icons';

import BillAttachments from '../bill-attachments';
import formFields from './form-fields';
import formValidation from './form-validation';

const BillAgainstVendor = () => {
  const onSubmit = () => {
    console.log('::: values');
  };

  const onDrop = () => {
    // TODO: write on drop logic when integrating
  };

  const {
    notes,
    payer,
    total_amount,
    invoice_date,
    reference_no,
    due_date,
    description,
    purchase_order,
    work_order,
    project,
    gl_account,
  } = formFields;

  return (
    <div>
      <Formik
        className="text-start"
        onSubmit={onSubmit}
        initialValues={{
          due_date: '',
          invoice_date: '',
          notes: '',
          payer: '',
          work_order: '',
          total_amount: '',
          project: '',
          description: '',
          gl_account: '',
          reference_no: '',
          purchase_order: '',
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
                    <Form.Group className="mb-4" controlId="RecurringFormInvoiceDate">
                      <Form.Label className="form-label-md">Invoice Date</Form.Label>
                      <Field
                        name={invoice_date.name}
                        type="date"
                        className={clsx(
                          'form-control',
                          touched?.invoice_date && (errors && errors.invoice_date ? 'is-invalid' : 'is-valid')
                        )}
                      />
                      <Form.Control.Feedback type="invalid">{errors.invoice_date}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col sm={6} md={2}>
                    <Form.Group className="mb-4" controlId="RecurringFormDueDate">
                      <Form.Label className="form-label-md">Due Date</Form.Label>
                      <Field
                        name={due_date.name}
                        type="date"
                        className={clsx(
                          'form-control',
                          touched?.due_date && (errors && errors.due_date ? 'is-invalid' : 'is-valid')
                        )}
                      />
                      <Form.Control.Feedback type="invalid">{errors.due_date}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="gx-sm-4 gx-0">
                  <Col sm={6} md={4}>
                    <CustomSelect
                      labelText="Purchase Order"
                      onSelectChange={value => {
                        setFieldValue(purchase_order.name, value);
                        setFieldTouched(purchase_order.name, true);
                      }}
                      onBlurChange={() => {
                        setFieldTouched(purchase_order.name, true);
                      }}
                      name={purchase_order.name}
                      controlId="RecurringFormRepeatsPurchaseOrder"
                      options={[{ value: '1', label: 'Option 1' }]}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-4',
                      }}
                      isInvalid={!!(touched.purchase_order && errors && errors.purchase_order)}
                      isValid={!!(touched.purchase_order && errors && !errors.purchase_order)}
                      error={errors && errors.purchase_order}
                    />
                  </Col>
                  <Col sm={6} md={4}>
                    <CustomSelect
                      labelText="Work Order"
                      onSelectChange={value => {
                        setFieldValue(work_order.name, value);
                        setFieldTouched(work_order.name, true);
                      }}
                      onBlurChange={() => {
                        setFieldTouched(work_order.name, true);
                      }}
                      name={work_order.name}
                      controlId="RecurringFormRepeatsWorkOrder"
                      options={[{ value: '1', label: 'Option 1' }]}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-4',
                      }}
                      isInvalid={!!(touched.work_order && errors && errors.work_order)}
                      isValid={!!(touched.work_order && errors && !errors.work_order)}
                      error={errors && errors.work_order}
                    />
                  </Col>
                  <Col sm={6} md={4}>
                    <CustomSelect
                      labelText="Project"
                      onSelectChange={value => {
                        setFieldValue(project.name, value);
                        setFieldTouched(project.name, true);
                      }}
                      onBlurChange={() => {
                        setFieldTouched(project.name, true);
                      }}
                      name={project.name}
                      controlId="RecurringFormRepeatsProject"
                      options={[{ value: '1', label: 'Option 1' }]}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-4',
                      }}
                      isInvalid={!!(touched.project && errors && errors.project)}
                      isValid={!!(touched.project && errors && !errors.project)}
                      error={errors && errors.project}
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
                  <Col sm={6} md={4}>
                    <CustomSelect
                      labelText="GL Account"
                      onSelectChange={value => {
                        setFieldValue(gl_account.name, value);
                        setFieldTouched(gl_account.name, true);
                      }}
                      onBlurChange={() => {
                        setFieldTouched(gl_account.name, true);
                      }}
                      name={gl_account.name}
                      controlId="RecurringFormGLAccount"
                      options={[{ value: '1', label: 'Option 1' }]}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-4',
                      }}
                      isInvalid={!!(touched.gl_account && errors && errors.gl_account)}
                      isValid={!!(touched.gl_account && errors && !errors.gl_account)}
                      error={errors && errors.gl_account}
                    />
                  </Col>
                </Row>

                <Row className="gx-sm-4 gx-0">
                  <Col sm={6} md={8}>
                    <Form.Group className="mb-4" controlId="ReceiptFormDescription">
                      <Form.Label className="form-label-md">Description</Form.Label>
                      <Field
                        name={description.name}
                        type="text"
                        as="textarea"
                        className={clsx(
                          'form-control',
                          touched?.description && (errors && errors.description ? 'is-invalid' : 'is-valid')
                        )}
                      />
                      <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
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
                  <BillAttachments />
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

export default BillAgainstVendor;
