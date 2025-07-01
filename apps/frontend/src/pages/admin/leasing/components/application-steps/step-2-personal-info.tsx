import { Fragment } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

import { ErrorMessage, Field, FieldArray, getIn, useFormikContext } from 'formik';

import { AddBtn } from 'core-ui/add-another';
import { DeleteBtn } from 'core-ui/delete-btn';
import { InputDate } from 'core-ui/input-date';
import { InputPhone } from 'core-ui/input-phone';

import { PERMISSIONS } from 'constants/permissions';

import { IRentalFormContactDetails } from 'interfaces/IApplications';

import formFields from './form-fields';

interface IProps {
  isDisabled?: boolean;
}

const Step02PersonalInfo = ({ isDisabled = false }: IProps) => {
  const { values, touched, errors, handleBlur, setFieldValue } = useFormikContext<IRentalFormContactDetails>();

  const { birthday, ssn_or_tin, driving_license_number, phone_number, emails } = formFields.formField;

  return (
    <div>
      <p className="fw-bold m-0 text-primary">Personal Information</p>
      <p className="small">Applicants personal information</p>
      <Row className="gx-sm-4 gx-0">
        <Col sm={8} md={6} xxl={4}>
          <InputDate
            maxDate={new Date()}
            openToDate={new Date(`01-01-${new Date().getFullYear() - 20}`)}
            disabled={isDisabled}
            labelText={'Date of Birth'}
            controlId={'PersonalInfoFormDOB'}
            classNames={{ wrapperClass: 'mb-4', labelClass: 'form-label-md' }}
            onDateSelection={date => setFieldValue(birthday.name, date)}
            value={values.birthday}
            onBlur={handleBlur}
            name={birthday.name}
            isValid={touched.birthday && !errors.birthday}
            isInvalid={touched.birthday && !!errors.birthday}
            error={errors.birthday}
          />
        </Col>
      </Row>

      <Row className="gx-sm-4 gx-0">
        <Col sm={8} md={5} xxl={4}>
          <Form.Group className="mb-4" controlId="PersonalInfoFormSSNorTIN">
            <Form.Label className="form-label-md">SSN (or TIN)</Form.Label>
            <Field
              disabled={isDisabled}
              name={ssn_or_tin.name}
              type="text"
              as={Form.Control}
              placeholder="XXXX-XXXX-XXX"
              isValid={touched.ssn_or_tin && !errors.ssn_or_tin}
              isInvalid={touched.ssn_or_tin && !!errors.ssn_or_tin}
            />
            <ErrorMessage className="text-danger" name={ssn_or_tin.name} component={Form.Text} />
          </Form.Group>
        </Col>
        <Col sm={8} md={5} xxl={4}>
          <Form.Group className="mb-4" controlId="PersonalInfoFormDrivingLicense">
            <Form.Label className="form-label-md">Driving license number</Form.Label>
            <Field
              disabled={isDisabled}
              name={driving_license_number.name}
              type="text"
              as={Form.Control}
              placeholder="XXXX-XXXX-XXX"
              isValid={touched.driving_license_number && !errors.driving_license_number}
              isInvalid={touched.driving_license_number && !!errors.driving_license_number}
            />
            <ErrorMessage className="text-danger" name={driving_license_number.name} component={Form.Text} />
          </Form.Group>
        </Col>
      </Row>

      <p className="fw-bold m-0 text-primary">Contact Information</p>
      <p className="small">Provide the applicants contact information</p>

      <FieldArray
        name={phone_number.name}
        render={arrayHelpers => (
          <div>
            <Fragment>
              {values.phone_number &&
                values.phone_number.map((_, index) => {
                  const fieldName = `phone_number[${index}].phone`;

                  return (
                    <Row key={index} className="gx-sm-4 gx-0">
                      <Col sm={8} md={5} xxl={4}>
                        <Form.Group className="mb-4" controlId={fieldName}>
                          <Form.Label className="form-label-md">Phone number</Form.Label>
                          <Row className="g-1">
                            <Col xs={11}>
                              <InputPhone
                                name={fieldName}
                                value={_.phone}
                                onBlur={handleBlur}
                                disabled={isDisabled}
                                onPhoneNumberChange={phone => setFieldValue(fieldName, phone)}
                                isInvalid={!!getIn(errors, fieldName) && getIn(touched, fieldName)}
                                isValid={getIn(touched, fieldName) && !getIn(errors, fieldName)}
                              />
                              <ErrorMessage className="text-danger" name={fieldName} component={Form.Text} />
                            </Col>

                            {index > 0 && (
                              <Col xs={1} className="py-1">
                                <DeleteBtn onClick={() => arrayHelpers.remove(index)} />
                              </Col>
                            )}
                          </Row>
                        </Form.Group>
                      </Col>
                    </Row>
                  );
                })}
            </Fragment>
            {!isDisabled && (
              <AddBtn
                permission={PERMISSIONS.LEASING}
                onClick={() => arrayHelpers.push({ [phone_number.phone.name]: '' })}
              />
            )}
          </div>
        )}
      />

      <hr />

      <FieldArray
        name={emails.name}
        render={arrayHelpers => (
          <div>
            <Fragment>
              {values.emails &&
                values.emails.map((_, index) => {
                  const fieldName = `emails[${index}].email`;

                  return (
                    <Row key={index} className="gx-sm-4 gx-0">
                      <Col sm={8} md={5} xxl={4}>
                        <Form.Group className="mb-4" controlId={fieldName}>
                          <Form.Label className="form-label-md">Personal Email</Form.Label>
                          <Row className="g-1 align-items-center">
                            <Col xs={11}>
                              <Field
                                type="email"
                                name={fieldName}
                                disabled={isDisabled}
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
            {!isDisabled && (
              <AddBtn permission={PERMISSIONS.LEASING} onClick={() => arrayHelpers.push({ [emails.email.name]: '' })} />
            )}
          </div>
        )}
      />
    </div>
  );
};

export default Step02PersonalInfo;
