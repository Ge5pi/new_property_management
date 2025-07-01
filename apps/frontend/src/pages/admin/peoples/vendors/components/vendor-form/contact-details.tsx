import { Fragment } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';

import { ErrorMessage, Field, FieldArray, getIn, useFormikContext } from 'formik';

import { AddBtn } from 'core-ui/add-another';
import { DeleteBtn } from 'core-ui/delete-btn';
import { InputPhone } from 'core-ui/input-phone';

import { PERMISSIONS } from 'constants/permissions';

import { IVendorContactDetails } from 'interfaces/IPeoples';

import formFields from './form-fields';

const ContactDetails = () => {
  const { values, touched, errors, setFieldValue, handleBlur } = useFormikContext<IVendorContactDetails>();

  const { personal_contact_numbers, business_contact_numbers, personal_emails, business_emails, website } = formFields;

  return (
    <Card className="border-0 p-4 page-section mb-3">
      <Card.Header className="border-0 p-0 bg-transparent text-start">
        <div>
          <p className="fw-bold m-0 text-primary">Contact Details</p>
          <p className="small">Provide contact information regarding the vendor</p>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        <Row className="g-2">
          <Col md={6}>
            <FieldArray
              name={personal_contact_numbers.name}
              render={arrayHelpers => (
                <div className="mb-5">
                  <Fragment>
                    {values.personal_contact_numbers &&
                      values.personal_contact_numbers.map((_, index) => {
                        const fieldName = `personal_contact_numbers[${index}].phone`;

                        return (
                          <Row key={index} className="gx-sm-4 gx-0">
                            <Col md={10} lg={8}>
                              <Form.Group className="mb-4" controlId={fieldName}>
                                <Form.Label className="form-label-md">Phone number</Form.Label>
                                <Row className="g-1">
                                  <Col xs={11}>
                                    <InputPhone
                                      name={fieldName}
                                      value={_.phone}
                                      onPhoneNumberChange={phone => setFieldValue(fieldName, phone)}
                                      onBlur={handleBlur}
                                      isInvalid={!!getIn(errors, fieldName) && getIn(touched, fieldName)}
                                      isValid={getIn(touched, fieldName) && !getIn(errors, fieldName)}
                                    />
                                    <ErrorMessage className="text-danger" name={fieldName} component={Form.Text} />
                                  </Col>

                                  {index > 0 && (
                                    <Col xs={1} className="py-1">
                                      <DeleteBtn
                                        permission={PERMISSIONS.PEOPLE}
                                        onClick={() => arrayHelpers.remove(index)}
                                      />
                                    </Col>
                                  )}
                                </Row>
                              </Form.Group>
                            </Col>
                          </Row>
                        );
                      })}
                  </Fragment>
                  <AddBtn
                    permission={PERMISSIONS.PEOPLE}
                    onClick={() => arrayHelpers.push({ [personal_contact_numbers.phone.name]: '' })}
                  />
                </div>
              )}
            />
          </Col>
          <Col md={6}>
            <FieldArray
              name={personal_emails.name}
              render={arrayHelpers => (
                <div className="mb-5">
                  <Fragment>
                    {values.personal_emails &&
                      values.personal_emails.map((_, index) => {
                        const fieldName = `personal_emails[${index}].email`;

                        return (
                          <Row key={index} className="gx-sm-4 gx-0">
                            <Col md={10} lg={8}>
                              <Form.Group className="mb-4" controlId={fieldName}>
                                <Form.Label className="form-label-md">Personal Email</Form.Label>
                                <Row className="g-1 align-items-center">
                                  <Col xs={11}>
                                    <Field
                                      type="email"
                                      name={fieldName}
                                      as={Form.Control}
                                      placeholder="johndoe@example.com"
                                      isInvalid={!!getIn(errors, fieldName) && getIn(touched, fieldName)}
                                      isValid={getIn(touched, fieldName) && !getIn(errors, fieldName)}
                                    />
                                  </Col>

                                  {index > 0 && (
                                    <Col xs={1}>
                                      <DeleteBtn
                                        permission={PERMISSIONS.PEOPLE}
                                        onClick={() => arrayHelpers.remove(index)}
                                      />
                                    </Col>
                                  )}

                                  <Col xs={12}>
                                    <ErrorMessage className="text-danger" name={fieldName} component={Form.Text} />
                                  </Col>
                                </Row>
                              </Form.Group>
                            </Col>
                          </Row>
                        );
                      })}
                  </Fragment>
                  <AddBtn
                    permission={PERMISSIONS.PEOPLE}
                    onClick={() => arrayHelpers.push({ [personal_emails.email.name]: '' })}
                  />
                </div>
              )}
            />
          </Col>
        </Row>

        <hr />

        <Row className="g-2 mt-4">
          <Col md={6}>
            <FieldArray
              name={business_contact_numbers.name}
              render={arrayHelpers => (
                <div className="mb-5">
                  <Fragment>
                    {values.business_contact_numbers &&
                      values.business_contact_numbers.map((_, index) => {
                        const fieldName = `business_contact_numbers[${index}].phone`;

                        return (
                          <Row key={index} className="gx-sm-4 gx-0">
                            <Col md={10} lg={8}>
                              <Form.Group className="mb-4" controlId={fieldName}>
                                <Form.Label className="form-label-md">Company Phone Number</Form.Label>
                                <Row className="g-1">
                                  <Col xs={11}>
                                    <InputPhone
                                      name={fieldName}
                                      value={_.phone}
                                      onBlur={handleBlur}
                                      onPhoneNumberChange={phone => setFieldValue(fieldName, phone)}
                                      isInvalid={!!getIn(errors, fieldName) && getIn(touched, fieldName)}
                                      isValid={getIn(touched, fieldName) && !getIn(errors, fieldName)}
                                    />
                                    <ErrorMessage className="text-danger" name={fieldName} component={Form.Text} />
                                  </Col>

                                  {index > 0 && (
                                    <Col xs={1} className="py-1">
                                      <DeleteBtn
                                        permission={PERMISSIONS.PEOPLE}
                                        onClick={() => arrayHelpers.remove(index)}
                                      />
                                    </Col>
                                  )}
                                </Row>
                              </Form.Group>
                            </Col>
                          </Row>
                        );
                      })}
                  </Fragment>
                  <AddBtn
                    permission={PERMISSIONS.PEOPLE}
                    onClick={() => arrayHelpers.push({ [business_contact_numbers.phone.name]: '' })}
                  />
                </div>
              )}
            />
          </Col>
          <Col md={6}>
            <FieldArray
              name={business_emails.name}
              render={arrayHelpers => (
                <div className="mb-5">
                  <Fragment>
                    {values.business_emails &&
                      values.business_emails.map((_, index) => {
                        const fieldName = `business_emails[${index}].email`;

                        return (
                          <Row key={index} className="gx-sm-4 gx-0">
                            <Col md={10} lg={8}>
                              <Form.Group className="mb-4" controlId={fieldName}>
                                <Form.Label className="form-label-md">Company Email Address</Form.Label>
                                <Row className="g-1 align-items-center">
                                  <Col xs={11}>
                                    <Field
                                      type="email"
                                      name={fieldName}
                                      as={Form.Control}
                                      placeholder="johndoe@example.com"
                                      isInvalid={!!getIn(errors, fieldName) && getIn(touched, fieldName)}
                                      isValid={getIn(touched, fieldName) && !getIn(errors, fieldName)}
                                    />
                                  </Col>

                                  {index > 0 && (
                                    <Col xs={1}>
                                      <DeleteBtn onClick={() => arrayHelpers.remove(index)} />
                                    </Col>
                                  )}

                                  <Col xs={12}>
                                    <ErrorMessage className="text-danger" name={fieldName} component={Form.Text} />
                                  </Col>
                                </Row>
                              </Form.Group>
                            </Col>
                          </Row>
                        );
                      })}
                  </Fragment>
                  <AddBtn
                    permission={PERMISSIONS.PEOPLE}
                    onClick={() => arrayHelpers.push({ [business_emails.email.name]: '' })}
                  />
                </div>
              )}
            />
          </Col>
        </Row>

        <hr />

        <Row>
          <Col xxl={3} lg={4} md={6}>
            <Form.Group className="mb-4" controlId="VendorFormWebsite">
              <Form.Label className="form-label-md">Website</Form.Label>
              <Field
                type="text"
                name={website.name}
                as={Form.Control}
                placeholder="https://"
                isValid={touched.website && !errors.website}
                isInvalid={touched.website && !!errors.website}
              />
              <ErrorMessage className="text-danger" name={website.name} component={Form.Text} />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ContactDetails;
