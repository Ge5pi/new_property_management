import { Fragment } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

import { ErrorMessage, Field, FieldArray, getIn, useFormikContext } from 'formik';

import { AddBtn } from 'core-ui/add-another';
import { DeleteBtn } from 'core-ui/delete-btn';
import { InputPhone } from 'core-ui/input-phone';

import { PERMISSIONS } from 'constants/permissions';

import { IRentalFormContactDetails } from 'interfaces/IApplications';

import formFields from './form-fields';

interface IProps {
  render: 'email' | 'phone';
}

const ContactDetails = ({ render }: IProps) => {
  const { values, touched, errors, dirty, isValid, setFieldValue, handleBlur, isSubmitting, handleSubmit } =
    useFormikContext<IRentalFormContactDetails>();
  const { phone_number, emails } = formFields.formField;

  if (render === 'phone') {
    return (
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
                      <Col xs={12}>
                        <Form.Group className="mb-4" controlId={fieldName}>
                          <Form.Label className="form-label-md">Phone number</Form.Label>
                          <Row className="g-1">
                            <Col xs={11}>
                              <InputPhone
                                value={_.phone}
                                name={fieldName}
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
                                  onClick={() => {
                                    arrayHelpers.remove(index);
                                    handleSubmit();
                                  }}
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
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
              onClick={() => {
                if (isValid && dirty) {
                  handleSubmit();
                }
                if (!isSubmitting) {
                  arrayHelpers.push({ [phone_number.phone.name]: '' });
                }
              }}
            >
              {dirty && isValid ? 'Save Changes' : 'Add Another'}
            </AddBtn>
          </div>
        )}
      />
    );
  } else {
    return (
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
                      <Col xs={12}>
                        <Form.Group className="mb-4" controlId={fieldName}>
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
                                  onClick={() => {
                                    arrayHelpers.remove(index);
                                    handleSubmit();
                                  }}
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
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
              onClick={() => {
                if (isValid && dirty) {
                  handleSubmit();
                }

                if (!isSubmitting) {
                  arrayHelpers.push({ [emails.email.name]: '' });
                }
              }}
            >
              {dirty && isValid ? 'Save Changes' : 'Add Another'}
            </AddBtn>
          </div>
        )}
      />
    );
  }
};

export default ContactDetails;
