import { Card, Col, Form, Row } from 'react-bootstrap';

import { ErrorMessage, Field, useFormikContext } from 'formik';

import { IOwner } from 'interfaces/IPeoples';

import formFields from './form-fields';

const BankAccountDetails = () => {
  const { touched, errors } = useFormikContext<IOwner>();

  const { bank_name, bank_branch, bank_account_number, bank_routing_number, bank_account_title } = formFields;

  return (
    <Card className="border-0 p-4 page-section mb-3">
      <Card.Header className="border-0 p-0 bg-transparent text-start">
        <p className="fw-bold m-0 text-primary">Bank Account details</p>
        <p className="small">Provide the owners bank account information</p>
      </Card.Header>

      <Card.Body className="p-0">
        <Row className="gx-sm-4 gx-0">
          <Col sm={6} md={4} xxl={3}>
            <Form.Group className="mb-4" controlId="OwnerFormBankName">
              <Form.Label className="form-label-md">Bank Name</Form.Label>
              <Field
                name={bank_name.name}
                type="text"
                as={Form.Control}
                isValid={touched.bank_name && !errors.bank_name}
                isInvalid={touched.bank_name && !!errors.bank_name}
                placeholder="Type here"
              />
              <ErrorMessage className="text-danger" name={bank_name.name} component={Form.Text} />
            </Form.Group>
          </Col>
          <Col sm={6} md={4} xxl={4}>
            <Form.Group className="mb-4" controlId="OwnerFormBankBranch">
              <Form.Label className="form-label-md">Bank branch</Form.Label>
              <Field
                name={bank_branch.name}
                type="text"
                as={Form.Control}
                isValid={touched.bank_branch && !errors.bank_branch}
                isInvalid={touched.bank_branch && !!errors.bank_branch}
                placeholder="Type here"
              />
              <ErrorMessage className="text-danger" name={bank_branch.name} component={Form.Text} />
            </Form.Group>
          </Col>
        </Row>

        <Row className="gx-sm-4 gx-0">
          <Col sm={6} md={4} xxl={3}>
            <Form.Group className="mb-4" controlId="OwnerFormBankName">
              <Form.Label className="form-label-md">Routing number</Form.Label>
              <Field
                name={bank_routing_number.name}
                type="text"
                as={Form.Control}
                isValid={touched.bank_routing_number && !errors.bank_routing_number}
                isInvalid={touched.bank_routing_number && !!errors.bank_routing_number}
                placeholder="Type here"
              />
              <ErrorMessage className="text-danger" name={bank_routing_number.name} component={Form.Text} />
            </Form.Group>
          </Col>
          <Col sm={6} md={4} xxl={4}>
            <Form.Group className="mb-4" controlId="OwnerFormBankAccountNumber">
              <Form.Label className="form-label-md">Bank Account number</Form.Label>
              <Field
                name={bank_account_number.name}
                type="text"
                as={Form.Control}
                isValid={touched.bank_account_number && !errors.bank_account_number}
                isInvalid={touched.bank_account_number && !!errors.bank_account_number}
                placeholder="Type here"
              />
              <ErrorMessage className="text-danger" name={bank_account_number.name} component={Form.Text} />
            </Form.Group>
          </Col>
          <Col sm={6} md={4} xxl={4}>
            <Form.Group className="mb-4" controlId="OwnerFormBankAccountHolder">
              <Form.Label className="form-label-md">Bank Account Title</Form.Label>
              <Field
                name={bank_account_title.name}
                type="text"
                as={Form.Control}
                isValid={touched.bank_account_title && !errors.bank_account_title}
                isInvalid={touched.bank_account_title && !!errors.bank_account_title}
                placeholder="Type here"
              />
              <ErrorMessage className="text-danger" name={bank_account_title.name} component={Form.Text} />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default BankAccountDetails;
