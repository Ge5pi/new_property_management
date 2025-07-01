import { Card, Col, Form, Row } from 'react-bootstrap';

import { ErrorMessage, Field, useFormikContext } from 'formik';

import { IOwner } from 'interfaces/IPeoples';

import formFields from './form-fields';

const GeneralDetails = () => {
  const { touched, errors, values, setFieldValue, handleChange, handleBlur } = useFormikContext<IOwner>();

  const { company_name, first_name, last_name, is_use_as_display_name, tax_payer } = formFields;

  return (
    <Card className="border-0 p-4 page-section mb-3">
      <Card.Header className="border-0 p-0 bg-transparent text-start">
        <div>
          <p className="fw-bold m-0 text-primary">General Details</p>
          <p className="small">Provide general information regarding the vendor</p>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        <Row className="gx-sm-4 gx-0">
          <Col sm={8} md={5} xxl={4}>
            <Form.Group className="mb-4" controlId="OwnerFormFirstName">
              <Form.Label className="form-label-md">First Name</Form.Label>
              <Field
                name={first_name.name}
                type="text"
                as={Form.Control}
                isValid={touched.first_name && !errors.first_name}
                isInvalid={touched.first_name && !!errors.first_name}
                placeholder="First Name"
              />
              <ErrorMessage className="text-danger" name={first_name.name} component={Form.Text} />
            </Form.Group>
          </Col>
          <Col sm={8} md={5} xxl={4}>
            <Form.Group className="mb-4" controlId="OwnerFormLastName">
              <Form.Label className="form-label-md">Last Name</Form.Label>
              <Field
                name={last_name.name}
                type="text"
                as={Form.Control}
                isValid={touched.last_name && !errors.last_name}
                isInvalid={touched.last_name && !!errors.last_name}
                placeholder="Last Name"
              />
              <ErrorMessage className="text-danger" name={last_name.name} component={Form.Text} />
            </Form.Group>
          </Col>
        </Row>
        <Row className="gx-sm-4 gx-0">
          <Col sm={8} md={5} xxl={4}>
            <Form.Group className="mb-4" controlId="OwnerFormCompanyName">
              <Form.Label className="form-label-md">Company Name</Form.Label>
              <Form.Control
                type="text"
                name={company_name.name}
                onBlur={handleBlur}
                onChange={ev => {
                  handleChange(ev);
                  if (values.is_company_name_as_tax_payer) {
                    setFieldValue(tax_payer.name, ev.target.value);
                    return;
                  }
                  setFieldValue(tax_payer.name, '');
                }}
                isValid={touched.company_name && !errors.company_name}
                isInvalid={touched.company_name && !!errors.company_name}
                placeholder="Company Name"
              />
              <ErrorMessage className="text-danger" name={company_name.name} component={Form.Text} />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3" controlId="OwnerFormIsUseAsDisplayName">
          <Field
            type="checkbox"
            name={is_use_as_display_name.name}
            as={Form.Check}
            isInvalid={touched.is_use_as_display_name && !!errors.is_use_as_display_name}
            label="use as display name"
          />
          <ErrorMessage className="text-danger" name={is_use_as_display_name.name} component={Form.Text} />
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default GeneralDetails;
