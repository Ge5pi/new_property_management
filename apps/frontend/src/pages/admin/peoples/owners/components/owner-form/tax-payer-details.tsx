import { Card, Col, Form, Row } from 'react-bootstrap';

import { ErrorMessage, Field, useFormikContext } from 'formik';

import { IOwner } from 'interfaces/IPeoples';

import formFields from './form-fields';

const TaxPayerDetails = () => {
  const { touched, errors, values, handleBlur, handleChange, setFieldValue } = useFormikContext<IOwner>();

  const { tax_payer, tax_payer_id, is_company_name_as_tax_payer } = formFields;

  return (
    <Card className="border-0 p-4 page-section mb-3">
      <Card.Header className="border-0 p-0 bg-transparent text-start">
        <p className="fw-bold m-0 text-primary">Tax payer details</p>
        <p className="small">Provide the owners tax paying details</p>
      </Card.Header>

      <Card.Body className="p-0">
        <Row className="gx-sm-4 gx-0">
          <Col sm={6} md={4} xxl={4}>
            <Form.Group className="mb-4" controlId="OwnerFormTaxPayerName">
              <Form.Label className="form-label-md">Tax payer name</Form.Label>
              <Field
                name={tax_payer.name}
                type="text"
                as={Form.Control}
                readOnly={values.is_company_name_as_tax_payer}
                isValid={touched.tax_payer && !errors.tax_payer}
                isInvalid={touched.tax_payer && !!errors.tax_payer}
                placeholder="Type here"
              />
              <ErrorMessage className="text-danger" name={tax_payer.name} component={Form.Text} />
            </Form.Group>
          </Col>
          <Col sm={6} md={4} xxl={4}>
            <Form.Group className="mb-4" controlId="OwnerFormTaxPayerID">
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
        <Form.Group className="mb-3" controlId="OwnerFormIsCompanyNameAsTaxPayerName">
          <Form.Check
            type="checkbox"
            name={is_company_name_as_tax_payer.name}
            isInvalid={touched.is_company_name_as_tax_payer && !!errors.is_company_name_as_tax_payer}
            defaultChecked={values.is_company_name_as_tax_payer === true}
            onChange={ev => {
              handleChange(ev);
              if (ev.target.checked) {
                setFieldValue(tax_payer.name, values.company_name);
                return;
              }
              setFieldValue(tax_payer.name, '');
            }}
            onBlur={handleBlur}
            label="use company name as tax payer"
          />
          <ErrorMessage className="text-danger" name={is_company_name_as_tax_payer.name} component={Form.Text} />
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default TaxPayerDetails;
