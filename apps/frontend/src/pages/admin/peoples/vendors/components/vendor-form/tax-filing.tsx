import { Card, Col, Form, Row } from 'react-bootstrap';

import { ErrorMessage, Field, useFormikContext } from 'formik';

import { CustomSelect } from 'core-ui/custom-select';

import { IVendor } from 'interfaces/IPeoples';

import formFields from './form-fields';

const TaxFilingInformation = () => {
  const { touched, errors, setFieldValue, setFieldTouched } = useFormikContext<IVendor>();

  const { tax_payer_id, tax_identity_type } = formFields;

  return (
    <Card className="border-0 p-4 page-section mb-3">
      <Card.Header className="border-0 p-0 bg-transparent text-start">
        <p className="fw-bold m-0 text-primary">Tax filling information</p>
        <p className="small">Provide the vendor’s tax filling details</p>
      </Card.Header>

      <Card.Body className="p-0">
        <Row className="gx-sm-4 gx-0">
          <Col sm={6} md={5} xxl={4}>
            <CustomSelect
              labelText={'Tax identity type'}
              onSelectChange={value => setFieldValue(tax_identity_type.name, value)}
              onBlurChange={() => setFieldTouched(tax_identity_type.name, true)}
              name={tax_identity_type.name}
              controlId="TaxFilingFormTaxIdentityType"
              options={[
                { value: 'SSN', label: 'SSN' },
                { value: 'EIN', label: 'EIN' },
              ]}
              classNames={{
                labelClass: 'popup-form-labels',
                wrapperClass: 'mb-4',
              }}
              isValid={touched.tax_identity_type && !errors.tax_identity_type}
              isInvalid={touched.tax_identity_type && !!errors.tax_identity_type}
              error={errors && errors.tax_identity_type}
            />
          </Col>
          <Col sm={6} md={5} xxl={4}>
            <Form.Group className="mb-4" controlId="TaxFilingFormPayerID">
              <Form.Label className="form-label-md">Tax payer ID</Form.Label>
              <Field
                name={tax_payer_id.name}
                type="text"
                as={Form.Control}
                isValid={touched.tax_payer_id && !errors.tax_payer_id}
                isInvalid={touched.tax_payer_id && !!errors.tax_payer_id}
                placeholder="Type here"
              />
              <ErrorMessage className="text-danger" name={tax_payer_id.name} component={Form.Text} />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default TaxFilingInformation;
