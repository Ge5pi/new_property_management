import { Card, Col, Form, Row } from 'react-bootstrap';

import { ErrorMessage, Field, FieldArray, getIn, useFormikContext } from 'formik';

import useResponse from 'services/api/hooks/useResponse';
import { useDeleteLeaseTenantMutation } from 'services/api/lease';

import { AddBtn } from 'core-ui/add-another';
import { DeleteBtn } from 'core-ui/delete-btn';
import { InputDate } from 'core-ui/input-date';
import { InputPhone } from 'core-ui/input-phone';

import { PERMISSIONS } from 'constants/permissions';

import { ILeaseForm, ISecondaryTenant } from 'interfaces/IApplications';

import formFields from './form-fields';

declare type LeaseTenantInformation = ILeaseForm & {
  secondary_tenants: Array<ISecondaryTenant>;
};

const TenantInformation = ({ formLoading }: { formLoading?: boolean }) => {
  const { values, touched, errors, handleChange, setFieldValue, handleBlur } =
    useFormikContext<LeaseTenantInformation>();
  const { secondary_tenants } = formFields;

  const [deleteSecondaryTenant, { isError: isDeleteSecondaryTenantError, error: deleteSecondaryTenantError }] =
    useDeleteLeaseTenantMutation();

  useResponse({
    isError: isDeleteSecondaryTenantError,
    error: deleteSecondaryTenantError,
  });

  const deleteTenant = (id: number | string) => {
    deleteSecondaryTenant(id);
  };

  return (
    <>
      <p className="fw-bold m-0 text-primary">Secondary Tenants</p>
      <p className="small">Provide information regarding the tenants</p>

      <FieldArray
        name="secondary_tenants"
        render={arrayHelpers => (
          <>
            <div className="mb-4">
              {values.secondary_tenants &&
                values.secondary_tenants.map((_, index) => {
                  const firstNameFieldName = `secondary_tenants[${index}].first_name`;
                  const lastNameFieldName = `secondary_tenants[${index}].last_name`;
                  const taxPayerFieldName = `secondary_tenants.${index}.tax_payer_id`;
                  const emailFieldName = `secondary_tenants[${index}].email`;
                  const phoneFieldName = `secondary_tenants[${index}].phone_number`;
                  const dateOfBirthFieldName = `secondary_tenants[${index}].birthday`;
                  const descriptionFieldName = `secondary_tenants[${index}].description`;

                  return (
                    <Card key={index} className="py-4 px-3 mb-4 position-relative bg-secondary">
                      <Card.Body>
                        <Row className="gx-sm-4 gx-0">
                          <Col md={4}>
                            <Form.Group className="mb-4" controlId={firstNameFieldName}>
                              <Form.Label className="form-label-md">First Name</Form.Label>
                              <Field
                                type="text"
                                name={firstNameFieldName}
                                as={Form.Control}
                                placeholder="Type here"
                                isInvalid={!!getIn(errors, firstNameFieldName) && getIn(touched, firstNameFieldName)}
                                isValid={getIn(touched, firstNameFieldName) && !getIn(errors, firstNameFieldName)}
                                disabled={formLoading}
                              />
                              <ErrorMessage className="text-danger" name={firstNameFieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-4" controlId={lastNameFieldName}>
                              <Form.Label className="form-label-md">Last Name</Form.Label>
                              <Field
                                type="text"
                                name={lastNameFieldName}
                                as={Form.Control}
                                placeholder="Type here"
                                isInvalid={!!getIn(errors, lastNameFieldName) && getIn(touched, lastNameFieldName)}
                                isValid={getIn(touched, lastNameFieldName) && !getIn(errors, lastNameFieldName)}
                                disabled={formLoading}
                              />
                              <ErrorMessage className="text-danger" name={lastNameFieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-4" controlId={taxPayerFieldName}>
                              <Form.Label className="form-label-md">Tax Payer ID</Form.Label>
                              <Field
                                type="text"
                                name={taxPayerFieldName}
                                as={Form.Control}
                                placeholder="Type here"
                                isInvalid={!!getIn(errors, taxPayerFieldName) && getIn(touched, taxPayerFieldName)}
                                isValid={getIn(touched, taxPayerFieldName) && !getIn(errors, taxPayerFieldName)}
                                disabled={formLoading}
                              />
                              <ErrorMessage className="text-danger" name={taxPayerFieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row className="gx-sm-4 gx-0">
                          <Col md={4}>
                            <Form.Group className="mb-4" controlId={emailFieldName}>
                              <Form.Label className="form-label-md">Email address</Form.Label>
                              <Field
                                type="email"
                                name={emailFieldName}
                                as={Form.Control}
                                placeholder="johndoe@example.com"
                                isInvalid={!!getIn(errors, emailFieldName) && getIn(touched, emailFieldName)}
                                isValid={getIn(touched, emailFieldName) && !getIn(errors, emailFieldName)}
                                disabled={formLoading}
                              />
                              <ErrorMessage className="text-danger" name={emailFieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-4" controlId={phoneFieldName}>
                              <Form.Label className="form-label-md">Phone number</Form.Label>
                              <InputPhone
                                name={phoneFieldName}
                                value={_.phone_number}
                                onPhoneNumberChange={phone => setFieldValue(phoneFieldName, phone)}
                                onBlur={handleBlur}
                                isInvalid={!!getIn(errors, phoneFieldName) && getIn(touched, phoneFieldName)}
                                isValid={getIn(touched, phoneFieldName) && !getIn(errors, phoneFieldName)}
                                disabled={formLoading}
                              />
                              <ErrorMessage className="text-danger" name={phoneFieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row className="gx-sm-4 gx-0">
                          <Col xl={3} lg={4} md={6}>
                            <InputDate
                              maxDate={new Date()}
                              openToDate={new Date(`01-01-${new Date().getFullYear() - 20}`)}
                              labelText={'Date of Birth'}
                              controlId={dateOfBirthFieldName}
                              classNames={{ wrapperClass: 'mb-4', labelClass: 'form-label-md' }}
                              onDateSelection={date => setFieldValue(dateOfBirthFieldName, date)}
                              onBlur={handleBlur}
                              value={_.birthday}
                              name={dateOfBirthFieldName}
                              isInvalid={!!getIn(errors, dateOfBirthFieldName) && getIn(touched, dateOfBirthFieldName)}
                              isValid={getIn(touched, dateOfBirthFieldName) && !getIn(errors, dateOfBirthFieldName)}
                              disabled={formLoading}
                              error={
                                <ErrorMessage
                                  className="text-danger"
                                  name={dateOfBirthFieldName}
                                  component={Form.Text}
                                />
                              }
                            />
                          </Col>
                        </Row>

                        <Row className="gx-sm-4 gx-0">
                          <Col>
                            <Form.Group className="mb-4" controlId={descriptionFieldName}>
                              <Form.Label className="form-label-md">Description</Form.Label>
                              <Form.Control
                                placeholder="Some test here..."
                                as="textarea"
                                rows={5}
                                name={descriptionFieldName}
                                onChange={handleChange}
                                value={_.description}
                                onBlur={handleBlur}
                                isInvalid={
                                  !!getIn(errors, descriptionFieldName) && getIn(touched, descriptionFieldName)
                                }
                                isValid={getIn(touched, descriptionFieldName) && !getIn(errors, descriptionFieldName)}
                                disabled={formLoading}
                              />
                              <ErrorMessage className="text-danger" name={descriptionFieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                        </Row>

                        {index > 0 && (
                          <DeleteBtn
                            permission={PERMISSIONS.LEASING}
                            onClick={() => {
                              _.id && deleteTenant(_.id);
                              arrayHelpers.remove(index);
                            }}
                          />
                        )}
                      </Card.Body>
                    </Card>
                  );
                })}
            </div>

            <AddBtn
              permission={PERMISSIONS.LEASING}
              onClick={() => {
                arrayHelpers.push({
                  [secondary_tenants.first_name.name]: '',
                  [secondary_tenants.last_name.name]: '',
                  [secondary_tenants.birthday.name]: '',
                  [secondary_tenants.phone_number.name]: '',
                  [secondary_tenants.email.name]: '',
                  [secondary_tenants.description.name]: '',
                  [secondary_tenants.tax_payer_id.name]: '',
                });
              }}
            />
          </>
        )}
      />
    </>
  );
};

export default TenantInformation;
