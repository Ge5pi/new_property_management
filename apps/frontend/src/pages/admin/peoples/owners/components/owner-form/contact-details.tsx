import { Fragment } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';

import { ErrorMessage, Field, FieldArray, getIn, useFormikContext } from 'formik';

import { AddBtn } from 'core-ui/add-another';
import { CustomSelect } from 'core-ui/custom-select';
import { DeleteBtn } from 'core-ui/delete-btn';
import { InputPhone } from 'core-ui/input-phone';

import { PERMISSIONS } from 'constants/permissions';

import { IOwnerContactDetails } from 'interfaces/IPeoples';

import formFields from './form-fields';

import countries from 'data/countries.json';

const ContactDetails = () => {
  const { values, touched, errors, setFieldTouched, setFieldValue, handleBlur } =
    useFormikContext<IOwnerContactDetails>();

  const {
    personal_contact_numbers,
    personal_emails,
    city,
    state,
    street_address,
    country,
    zip,
    company_contact_numbers,
    company_emails,
  } = formFields;

  return (
    <Card className="border-0 p-4 page-section mb-3">
      <Card.Header className="border-0 p-0 bg-transparent text-start">
        <div>
          <p className="fw-bold m-0 text-primary">Contact Details</p>
          <p className="small">Provide contact information regarding the vendor</p>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        <Row className="gx-2 gy-3">
          <Col xxl={4} xl={5} md={6}>
            <FieldArray
              name={personal_contact_numbers.name}
              render={arrayHelpers => (
                <div className="mb-5">
                  <Fragment>
                    {values.personal_contact_numbers &&
                      values.personal_contact_numbers.map((_, index) => {
                        const fieldName = `personal_contact_numbers[${index}].phone`;

                        return (
                          <Form.Group key={index} className="mb-4" controlId={fieldName}>
                            <Form.Label className="form-label-md">Phone number</Form.Label>
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
          <Col xxl={{ span: 4, offset: 3 }} xl={{ span: 5, offset: 1 }} md={6}>
            <FieldArray
              name={personal_emails.name}
              render={arrayHelpers => (
                <div className="mb-5">
                  <Fragment>
                    {values.personal_emails &&
                      values.personal_emails.map((_, index) => {
                        const fieldName = `personal_emails[${index}].email`;

                        return (
                          <Form.Group key={index} className="mb-4" controlId={fieldName}>
                            <Form.Label className="form-label-md">Personal Email</Form.Label>
                            <Row className="g-1 align-items-center">
                              <Col xs={11}>
                                <Field
                                  name={fieldName}
                                  type="email"
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

        <Row className="gx-sm-4 gx-0">
          <Col>
            <Form.Group className="mb-4" controlId="OwnerFormStreet">
              <Form.Label className="form-label-md">Street address</Form.Label>
              <Field
                name={street_address.name}
                type="text"
                as={Form.Control}
                isValid={touched.street_address && !errors.street_address}
                isInvalid={touched.street_address && !!errors.street_address}
                placeholder="Type here"
              />
              <ErrorMessage className="text-danger" name={street_address.name} component={Form.Text} />
            </Form.Group>
          </Col>
        </Row>
        <Row className="gx-sm-4 gx-0">
          <Col md={6} xxl={3}>
            <CustomSelect
              labelText={'Country'}
              onSelectChange={value => setFieldValue(country.name, value)}
              onBlurChange={() => setFieldTouched(country.name, true)}
              name={country.name}
              controlId="OwnerFormCountry"
              value={values.country}
              options={countries}
              searchable
              classNames={{
                labelClass: 'popup-form-labels',
                wrapperClass: 'mb-4',
              }}
              isValid={touched.country && !errors.country}
              isInvalid={touched.country && !!errors.country}
              error={errors && errors.country}
            />
          </Col>
          <Col md={6} xxl={3}>
            <Form.Group className="mb-4" controlId="OwnerFormCity">
              <Form.Label className="form-label-md">City</Form.Label>
              <Field
                type="text"
                name={city.name}
                as={Form.Control}
                isValid={touched.city && !errors.city}
                isInvalid={touched.city && !!errors.city}
                placeholder="Type here"
              />
              <ErrorMessage className="text-danger" name={city.name} component={Form.Text} />
            </Form.Group>
          </Col>
          <Col md={6} xxl={3}>
            <Form.Group className="mb-4" controlId="OwnerFormState">
              <Form.Label className="form-label-md">State</Form.Label>
              <Field
                name={state.name}
                type="text"
                as={Form.Control}
                isValid={touched.state && !errors.state}
                isInvalid={touched.state && !!errors.state}
                placeholder="Type here"
              />
              <ErrorMessage className="text-danger" name={state.name} component={Form.Text} />
            </Form.Group>
          </Col>
          <Col md={6} xxl={3}>
            <Form.Group className="mb-4" controlId="OwnerFormZip">
              <Form.Label className="form-label-md">Zip code</Form.Label>
              <Field
                name={zip.name}
                type="text"
                as={Form.Control}
                isValid={touched.zip && !errors.zip}
                isInvalid={touched.zip && !!errors.zip}
                placeholder="Type here"
              />
              <ErrorMessage className="text-danger" name={zip.name} component={Form.Text} />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>

      <Card.Header className="border-0 px-0 bg-transparent text-start">
        <div>
          <p className="fw-bold m-0 text-primary">Company Contact Details</p>
          <p className="small">Provide contact information regarding your company</p>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        <Row className="gx-2 gy-3">
          <Col xxl={4} xl={5} md={6}>
            <FieldArray
              name={company_contact_numbers.name}
              render={arrayHelpers => (
                <div className="mb-5">
                  <Fragment>
                    {values.company_contact_numbers &&
                      values.company_contact_numbers.map((_, index) => {
                        const fieldName = `company_contact_numbers[${index}].phone`;

                        return (
                          <Form.Group key={index} className="mb-4" controlId={fieldName}>
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
                        );
                      })}
                  </Fragment>
                  <AddBtn
                    permission={PERMISSIONS.PEOPLE}
                    onClick={() => arrayHelpers.push({ [company_contact_numbers.phone.name]: '' })}
                  />
                </div>
              )}
            />
          </Col>
          <Col xxl={{ span: 4, offset: 3 }} xl={{ span: 5, offset: 1 }} md={6}>
            <FieldArray
              name={company_emails.name}
              render={arrayHelpers => (
                <div className="mb-5">
                  <Fragment>
                    {values.company_emails &&
                      values.company_emails.map((_, index) => {
                        const fieldName = `company_emails[${index}].email`;

                        return (
                          <Form.Group key={index} className="mb-4" controlId={fieldName}>
                            <Form.Label className="form-label-md">Company Email Address</Form.Label>
                            <Row className="g-1 align-items-center">
                              <Col xs={11}>
                                <Field
                                  name={fieldName}
                                  type="email"
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
                        );
                      })}
                  </Fragment>
                  <AddBtn
                    permission={PERMISSIONS.PEOPLE}
                    onClick={() => arrayHelpers.push({ [company_emails.email.name]: '' })}
                  />
                </div>
              )}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ContactDetails;
