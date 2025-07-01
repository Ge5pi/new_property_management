import { Fragment } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';

import { ErrorMessage, Field, FieldArray, getIn, useFormikContext } from 'formik';

import useResponse from 'services/api/hooks/useResponse';
import { useDeleteEmergencyContactMutation } from 'services/api/rental-applications';

import { AddBtn } from 'core-ui/add-another';
import { CustomSelect } from 'core-ui/custom-select';
import { DeleteBtn } from 'core-ui/delete-btn';
import { InputPhone } from 'core-ui/input-phone';

import { PERMISSIONS } from 'constants/permissions';

import { IRentalFormContactDetails } from 'interfaces/IApplications';

import formFields from './form-fields';

import RelationshipOptions from 'data/relationships.json';

interface IProps {
  application_id: number | string;
  formLoading?: boolean;
}

const EmergencyDetails = ({ application_id, formLoading }: IProps) => {
  const {
    values,
    touched,
    errors,
    isValid,
    dirty,
    isSubmitting,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<IRentalFormContactDetails>();
  const { emergency_contacts } = formFields.formField;

  const [deleteEmergency, { isError: isDeleteEmergencyError, error: deleteEmergencyError }] =
    useDeleteEmergencyContactMutation();
  useResponse({
    isError: isDeleteEmergencyError,
    error: deleteEmergencyError,
  });

  const deleteEmergencyDetails = (id: number | string) => {
    if (application_id && Number(application_id) > 0) {
      deleteEmergency({ id, rental_application: application_id });
    }
  };

  return (
    <div>
      <Card className="border-0 p-4 page-section mb-3">
        <Card.Header className="border-0 p-0 bg-transparent text-start">
          <div>
            <p className="fw-bold m-0 text-primary">Emergency contact</p>
            <p className="small">Enter the emergency contact information</p>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          <FieldArray
            name={emergency_contacts.name}
            render={arrayHelpers => (
              <div className="mb-5">
                <Fragment>
                  {values.emergency_contacts &&
                    values.emergency_contacts.map((_, index) => {
                      const emergencyNameFieldName = `emergency_contacts[${index}].name`;
                      const emergencyPhoneFieldName = `emergency_contacts[${index}].phone_number`;
                      const emergencyRelationFieldName = `emergency_contacts[${index}].relationship`;
                      const emergencyAddressFieldName = `emergency_contacts[${index}].address`;

                      return (
                        <Card key={index} className="py-4 px-3 mb-4 position-relative bg-secondary">
                          <Card.Body>
                            <Row className="gx-sm-4 gx-0">
                              <Col lg={4} sm={6}>
                                <Form.Group className="mb-4" controlId={emergencyNameFieldName}>
                                  <Form.Label className="form-label-md">Full Name</Form.Label>
                                  <Field
                                    type="text"
                                    disabled={formLoading}
                                    name={emergencyNameFieldName}
                                    as={Form.Control}
                                    placeholder="Type Here..."
                                    isInvalid={
                                      !!getIn(errors, emergencyNameFieldName) && getIn(touched, emergencyNameFieldName)
                                    }
                                    isValid={
                                      getIn(touched, emergencyNameFieldName) && !getIn(errors, emergencyNameFieldName)
                                    }
                                  />
                                  <ErrorMessage
                                    className="text-danger"
                                    name={emergencyNameFieldName}
                                    component={Form.Text}
                                  />
                                </Form.Group>
                              </Col>
                              <Col lg={4} sm={6}>
                                <CustomSelect
                                  labelText="Relationship"
                                  onSelectChange={value => setFieldValue(emergencyRelationFieldName, value)}
                                  onBlurChange={() => {
                                    setFieldTouched(emergencyRelationFieldName, true);
                                  }}
                                  value={_.relationship}
                                  disabled={formLoading}
                                  name={emergencyRelationFieldName}
                                  controlId={emergencyRelationFieldName}
                                  options={RelationshipOptions}
                                  classNames={{
                                    labelClass: 'form-label-md',
                                    wrapperClass: 'mb-4',
                                  }}
                                  isInvalid={
                                    !!getIn(errors, emergencyRelationFieldName) &&
                                    getIn(touched, emergencyRelationFieldName)
                                  }
                                  isValid={
                                    getIn(touched, emergencyRelationFieldName) &&
                                    !getIn(errors, emergencyRelationFieldName)
                                  }
                                  error={
                                    <ErrorMessage
                                      className="text-danger"
                                      name={emergencyRelationFieldName}
                                      component={Form.Text}
                                    />
                                  }
                                />
                              </Col>
                              <Col lg={4} sm={6}>
                                <Form.Group className="mb-4" controlId={emergencyPhoneFieldName}>
                                  <Form.Label className="form-label-md">Phone number</Form.Label>
                                  <InputPhone
                                    value={_.phone_number}
                                    disabled={formLoading}
                                    name={emergencyPhoneFieldName}
                                    onPhoneNumberChange={phone => setFieldValue(emergencyPhoneFieldName, phone)}
                                    onBlur={handleBlur}
                                    isInvalid={
                                      !!getIn(errors, emergencyPhoneFieldName) &&
                                      getIn(touched, emergencyPhoneFieldName)
                                    }
                                    isValid={
                                      getIn(touched, emergencyPhoneFieldName) && !getIn(errors, emergencyPhoneFieldName)
                                    }
                                  />
                                  <ErrorMessage
                                    className="text-danger"
                                    name={emergencyPhoneFieldName}
                                    component={Form.Text}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row className="gx-sm-4 gx-0">
                              <Col>
                                <Form.Group className="mb-4" controlId={emergencyAddressFieldName}>
                                  <Form.Label className="form-label-md">Address</Form.Label>
                                  <Field
                                    type="text"
                                    name={emergencyAddressFieldName}
                                    disabled={formLoading}
                                    as={Form.Control}
                                    placeholder="Type Here..."
                                    isInvalid={
                                      !!getIn(errors, emergencyAddressFieldName) &&
                                      getIn(touched, emergencyAddressFieldName)
                                    }
                                    isValid={
                                      getIn(touched, emergencyAddressFieldName) &&
                                      !getIn(errors, emergencyAddressFieldName)
                                    }
                                  />
                                  <ErrorMessage
                                    className="text-danger"
                                    name={emergencyAddressFieldName}
                                    component={Form.Text}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            {index > 0 && (
                              <DeleteBtn
                                disabled={formLoading}
                                permission={PERMISSIONS.PEOPLE}
                                onClick={() => {
                                  _.id && deleteEmergencyDetails(_.id);
                                  arrayHelpers.remove(index);
                                }}
                              />
                            )}
                          </Card.Body>
                        </Card>
                      );
                    })}
                </Fragment>
                <AddBtn
                  permission={PERMISSIONS.PEOPLE}
                  disabled={!isValid || isSubmitting || formLoading}
                  loading={isSubmitting}
                  onClick={() => {
                    if (isValid && dirty) {
                      handleSubmit();
                    }

                    if (!isSubmitting) {
                      arrayHelpers.push({
                        [emergency_contacts.emergency_contact_name.name]: '',
                        [emergency_contacts.emergency_contact_address.name]: '',
                        [emergency_contacts.emergency_contact_relationship.name]: '',
                        [emergency_contacts.emergency_contact_phone_number.name]: '',
                      });
                    }
                  }}
                >
                  {dirty && isValid ? 'Save Changes' : 'Add Another'}
                </AddBtn>
              </div>
            )}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default EmergencyDetails;
