import { Card, Col, Form, Row } from 'react-bootstrap';

import { ErrorMessage, Field, useFormikContext } from 'formik';

import { InputDate } from 'core-ui/input-date';

import { IVendor } from 'interfaces/IPeoples';

import formFields from './form-fields';

const InsuranceProvider = () => {
  const { touched, errors, values, setFieldValue, handleBlur } = useFormikContext<IVendor>();

  const { insurance_provide_name, insurance_policy_number, insurance_expiry_date } = formFields;

  return (
    <Card className="border-0 p-4 page-section mb-3">
      <Card.Header className="border-0 p-0 bg-transparent text-start">
        <p className="fw-bold m-0 text-primary">Insurance Provider</p>
        <p className="small">Details about the vendor’s insurance provider</p>
      </Card.Header>

      <Card.Body className="p-0">
        <Row className="gx-sm-4 gx-0">
          <Col sm={6} md={4} xxl={4}>
            <Form.Group className="mb-4" controlId="InsuranceProviderFormName">
              <Form.Label className="form-label-md">Provider name</Form.Label>
              <Field
                name={insurance_provide_name.name}
                type="text"
                as={Form.Control}
                isValid={touched.insurance_provide_name && !errors.insurance_provide_name}
                isInvalid={touched.insurance_provide_name && !!errors.insurance_provide_name}
                placeholder="Type here"
              />
              <ErrorMessage className="text-danger" name={insurance_provide_name.name} component={Form.Text} />
            </Form.Group>
          </Col>
          <Col sm={6} md={4} xxl={4}>
            <Form.Group className="mb-4" controlId="InsuranceProviderPolicyNumber">
              <Form.Label className="form-label-md">Policy number</Form.Label>
              <Field
                name={insurance_policy_number.name}
                type="text"
                as={Form.Control}
                isValid={touched.insurance_policy_number && !errors.insurance_policy_number}
                isInvalid={touched.insurance_policy_number && !!errors.insurance_policy_number}
                placeholder="Type here"
              />
              <ErrorMessage className="text-danger" name={insurance_policy_number.name} component={Form.Text} />
            </Form.Group>
          </Col>
          <Col sm={6} md={3} xxl={2}>
            <InputDate
              labelText={'Expiry Date'}
              controlId={'InsuranceProviderExpiryDate'}
              classNames={{ wrapperClass: 'mb-4', labelClass: 'form-label-md' }}
              onDateSelection={date => setFieldValue(insurance_expiry_date.name, date)}
              onBlur={handleBlur}
              minDate={new Date()}
              name={insurance_expiry_date.name}
              value={values.insurance_expiry_date}
              isValid={touched.insurance_expiry_date && !errors.insurance_expiry_date}
              isInvalid={touched.insurance_expiry_date && !!errors.insurance_expiry_date}
              error={<ErrorMessage className="text-danger" name={insurance_expiry_date.name} component={Form.Text} />}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default InsuranceProvider;
