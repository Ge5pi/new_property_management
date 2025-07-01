import { Fragment } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ErrorMessage, Field, FieldArray, getIn, useFormikContext } from 'formik';

import useResponse from 'services/api/hooks/useResponse';
import { useDeleteRentalHistoryMutation } from 'services/api/rental-applications';

import { AddBtn } from 'core-ui/add-another';
import { CustomSelect } from 'core-ui/custom-select';
import { DeleteBtn } from 'core-ui/delete-btn';
import { GroupedField } from 'core-ui/grouped-field';
import { InputDate } from 'core-ui/input-date';
import { InputPhone } from 'core-ui/input-phone';

import { PERMISSIONS } from 'constants/permissions';

import { IRentalFormContactDetails } from 'interfaces/IApplications';

import formFields from './form-fields';

import countries from 'data/countries.json';

interface IProps {
  isDisabled?: boolean;
  formLoading?: boolean;
}

const Step03History = ({ isDisabled = false, formLoading }: IProps) => {
  const { values, touched, errors, handleBlur, handleChange, setFieldValue, setFieldTouched } =
    useFormikContext<IRentalFormContactDetails>();

  const { residential_history } = formFields.formField;

  const { application: application_id } = useParams();
  const [deleteRentalHistory, { isError: isDeleteRentalHistoryError, error: deleteRentalHistoryError }] =
    useDeleteRentalHistoryMutation();
  useResponse({
    isError: isDeleteRentalHistoryError,
    error: deleteRentalHistoryError,
  });

  const deleteHistory = (id: number | string) => {
    if (application_id && Number(application_id) > 0) {
      deleteRentalHistory({ id, rental_application: application_id });
    }
  };

  return (
    <div>
      <p className="fw-bold m-0 text-primary">Rental History</p>
      <p className="small">Provide the applicants previous rental history</p>

      <FieldArray
        name={residential_history.name}
        render={arrayHelpers => (
          <div className="mb-5">
            <Fragment>
              {values.residential_history &&
                values.residential_history.map((_, index) => {
                  const addressFieldName = `residential_history[${index}].current_address`;
                  const address2FieldName = `residential_history[${index}].current_address_2`;
                  const cityFieldName = `residential_history[${index}].current_city`;
                  const stateFieldName = `residential_history[${index}].current_state`;
                  const countryFieldName = `residential_history[${index}].current_country`;
                  const zipFieldName = `residential_history[${index}].current_zip_code`;

                  const landLordEmailFieldName = `residential_history[${index}].landlord_email`;
                  const landLordPhoneFieldName = `residential_history[${index}].landlord_phone_number`;
                  const landLordNameFieldName = `residential_history[${index}].landlord_name`;
                  const monthlyRentFieldName = `residential_history[${index}].monthly_rent`;
                  const reasonForLeavingFieldName = `residential_history[${index}].reason_of_leaving`;
                  const residedFromFieldName = `residential_history[${index}].resident_from`;
                  const residedToFieldName = `residential_history[${index}].resident_to`;

                  return (
                    <Card key={index} className="py-4 px-3 mb-4 position-relative bg-secondary">
                      <Card.Body>
                        <Row className="gx-sm-4 gx-0">
                          <Col xs={12}>
                            <Form.Group className="mb-4" controlId={addressFieldName}>
                              <Form.Label className="form-label-md">Current Address</Form.Label>
                              <Field
                                type="text"
                                disabled={isDisabled || formLoading}
                                name={addressFieldName}
                                as={Form.Control}
                                placeholder="Type here"
                                isInvalid={!!getIn(errors, addressFieldName) && getIn(touched, addressFieldName)}
                                isValid={getIn(touched, addressFieldName) && !getIn(errors, addressFieldName)}
                              />
                              <ErrorMessage className="text-danger" name={addressFieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                          <Col xs={12}>
                            <Form.Group className="mb-4" controlId={address2FieldName}>
                              <Form.Label className="form-label-md">Address Line 2</Form.Label>
                              <Field
                                type="text"
                                disabled={isDisabled || formLoading}
                                name={address2FieldName}
                                as={Form.Control}
                                placeholder="Type here"
                                isInvalid={!!getIn(errors, address2FieldName) && getIn(touched, address2FieldName)}
                                isValid={getIn(touched, address2FieldName) && !getIn(errors, address2FieldName)}
                              />
                              <ErrorMessage className="text-danger" name={address2FieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row className="gx-sm-4 gx-0">
                          <Col md={6} xxl={3}>
                            <CustomSelect
                              disabled={isDisabled || formLoading}
                              labelText={'Country'}
                              onSelectChange={value => setFieldValue(countryFieldName, value)}
                              onBlurChange={() => setFieldTouched(countryFieldName, true)}
                              name={countryFieldName}
                              controlId={countryFieldName}
                              value={_.current_country}
                              options={countries}
                              searchable
                              classNames={{
                                labelClass: 'popup-form-labels',
                                wrapperClass: 'mb-4',
                              }}
                              isInvalid={!!getIn(errors, countryFieldName) && getIn(touched, countryFieldName)}
                              isValid={getIn(touched, countryFieldName) && !getIn(errors, countryFieldName)}
                              error={
                                <ErrorMessage className="text-danger" name={countryFieldName} component={Form.Text} />
                              }
                            />
                          </Col>
                          <Col md={6} xxl={3}>
                            <Form.Group className="mb-4" controlId={cityFieldName}>
                              <Form.Label className="form-label-md">City</Form.Label>
                              <Field
                                type="text"
                                disabled={isDisabled || formLoading}
                                name={cityFieldName}
                                as={Form.Control}
                                placeholder="Type here"
                                isInvalid={!!getIn(errors, cityFieldName) && getIn(touched, cityFieldName)}
                                isValid={getIn(touched, cityFieldName) && !getIn(errors, cityFieldName)}
                              />
                              <ErrorMessage className="text-danger" name={cityFieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                          <Col md={6} xxl={3}>
                            <Form.Group className="mb-4" controlId={stateFieldName}>
                              <Form.Label className="form-label-md">State</Form.Label>
                              <Field
                                type="text"
                                disabled={isDisabled || formLoading}
                                name={stateFieldName}
                                as={Form.Control}
                                placeholder="Type here"
                                isInvalid={!!getIn(errors, stateFieldName) && getIn(touched, stateFieldName)}
                                isValid={getIn(touched, stateFieldName) && !getIn(errors, stateFieldName)}
                              />
                              <ErrorMessage className="text-danger" name={stateFieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                          <Col md={6} xxl={3}>
                            <Form.Group className="mb-4" controlId={zipFieldName}>
                              <Form.Label className="form-label-md">Zip code</Form.Label>
                              <Field
                                type="text"
                                disabled={isDisabled || formLoading}
                                name={zipFieldName}
                                as={Form.Control}
                                placeholder="Type here"
                                isInvalid={!!getIn(errors, zipFieldName) && getIn(touched, zipFieldName)}
                                isValid={getIn(touched, zipFieldName) && !getIn(errors, zipFieldName)}
                              />
                              <ErrorMessage className="text-danger" name={zipFieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row className="gx-sm-4 gx-0">
                          <Col lg={3} md={6} xs={12}>
                            <InputDate
                              disabled={isDisabled || formLoading}
                              name={residedFromFieldName}
                              labelText={'Resided from'}
                              controlId={residedFromFieldName}
                              classNames={{ wrapperClass: 'mb-3', labelClass: 'popup-form-labels' }}
                              value={_.resident_from}
                              onDateSelection={date => setFieldValue(residedFromFieldName, date)}
                              onBlur={() => setFieldTouched(residedFromFieldName)}
                              isInvalid={!!getIn(errors, residedFromFieldName) && getIn(touched, residedFromFieldName)}
                              isValid={getIn(touched, residedFromFieldName) && !getIn(errors, residedFromFieldName)}
                              error={
                                <ErrorMessage
                                  className="text-danger"
                                  name={residedFromFieldName}
                                  component={Form.Text}
                                />
                              }
                            />
                          </Col>
                          <Col lg={3} md={6} xs={12}>
                            <InputDate
                              disabled={isDisabled || formLoading}
                              name={residedToFieldName}
                              labelText={'Resided to'}
                              controlId={residedToFieldName}
                              classNames={{ wrapperClass: 'mb-3', labelClass: 'popup-form-labels' }}
                              value={_.resident_to}
                              minDate={new Date(_.resident_from ?? '')}
                              onDateSelection={date => setFieldValue(residedToFieldName, date)}
                              onBlur={() => setFieldTouched(residedToFieldName)}
                              isInvalid={!!getIn(errors, residedToFieldName) && getIn(touched, residedToFieldName)}
                              isValid={getIn(touched, residedToFieldName) && !getIn(errors, residedToFieldName)}
                              error={
                                <ErrorMessage className="text-danger" name={residedToFieldName} component={Form.Text} />
                              }
                            />
                          </Col>
                        </Row>

                        <Row className="gx-sm-4 gx-0">
                          <Col lg={3} md={6} xs={12}>
                            <GroupedField
                              type="number"
                              controlId={monthlyRentFieldName}
                              wrapperClass="mb-4"
                              labelClass="form-label-md"
                              icon={'$'}
                              position="end"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={_.monthly_rent}
                              label="Monthly Rent"
                              disabled={isDisabled || formLoading}
                              name={monthlyRentFieldName}
                              placeholder="0.00"
                              isInvalid={!!getIn(errors, monthlyRentFieldName) && getIn(touched, monthlyRentFieldName)}
                              isValid={getIn(touched, monthlyRentFieldName) && !getIn(errors, monthlyRentFieldName)}
                              error={
                                <ErrorMessage
                                  className="text-danger"
                                  name={monthlyRentFieldName}
                                  component={Form.Text}
                                />
                              }
                            />
                          </Col>
                        </Row>

                        <Row className="gx-sm-4 gx-0">
                          <Col md={6} xs={12}>
                            <Form.Group className="mb-4" controlId={landLordNameFieldName}>
                              <Form.Label className="form-label-md">Landlord Name</Form.Label>
                              <Field
                                type="text"
                                disabled={isDisabled || formLoading}
                                name={landLordNameFieldName}
                                as={Form.Control}
                                placeholder="Type here"
                                isInvalid={
                                  !!getIn(errors, landLordNameFieldName) && getIn(touched, landLordNameFieldName)
                                }
                                isValid={getIn(touched, landLordNameFieldName) && !getIn(errors, landLordNameFieldName)}
                              />
                              <ErrorMessage
                                className="text-danger"
                                name={landLordNameFieldName}
                                component={Form.Text}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6} xs={12}>
                            <Form.Group className="mb-4" controlId={landLordPhoneFieldName}>
                              <Form.Label className="form-label-md">Landlord Phone</Form.Label>
                              <InputPhone
                                disabled={isDisabled || formLoading}
                                name={landLordPhoneFieldName}
                                value={_.landlord_phone_number}
                                onPhoneNumberChange={phone => setFieldValue(landLordPhoneFieldName, phone)}
                                isInvalid={
                                  !!getIn(errors, landLordPhoneFieldName) && getIn(touched, landLordPhoneFieldName)
                                }
                                isValid={
                                  getIn(touched, landLordPhoneFieldName) && !getIn(errors, landLordPhoneFieldName)
                                }
                                onBlur={handleBlur}
                              />
                              <ErrorMessage
                                className="text-danger"
                                name={landLordPhoneFieldName}
                                component={Form.Text}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6} xs={12}>
                            <Form.Group className="mb-4" controlId={landLordEmailFieldName}>
                              <Form.Label className="form-label-md">Landlord email</Form.Label>
                              <Field
                                type="email"
                                disabled={isDisabled || formLoading}
                                name={landLordEmailFieldName}
                                as={Form.Control}
                                placeholder="johndoe@example.com"
                                isInvalid={
                                  !!getIn(errors, landLordEmailFieldName) && getIn(touched, landLordEmailFieldName)
                                }
                                isValid={
                                  getIn(touched, landLordEmailFieldName) && !getIn(errors, landLordEmailFieldName)
                                }
                              />
                              <ErrorMessage
                                className="text-danger"
                                name={landLordEmailFieldName}
                                component={Form.Text}
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row className="gx-sm-4 gx-0">
                          <Col>
                            <Form.Group className="mb-4" controlId={reasonForLeavingFieldName}>
                              <Form.Label className="form-label-md">Reason for leaving</Form.Label>
                              <Field
                                type="text"
                                disabled={isDisabled || formLoading}
                                name={reasonForLeavingFieldName}
                                as={Form.Control}
                                placeholder="Type here"
                                isInvalid={
                                  !!getIn(errors, reasonForLeavingFieldName) &&
                                  getIn(touched, reasonForLeavingFieldName)
                                }
                                isValid={
                                  getIn(touched, reasonForLeavingFieldName) && !getIn(errors, reasonForLeavingFieldName)
                                }
                              />
                              <ErrorMessage
                                className="text-danger"
                                name={reasonForLeavingFieldName}
                                component={Form.Text}
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        {index > 0 && (
                          <DeleteBtn
                            permission={PERMISSIONS.LEASING}
                            disabled={isDisabled || formLoading}
                            onClick={() => {
                              _.id && deleteHistory(_.id);
                              arrayHelpers.remove(index);
                            }}
                          />
                        )}
                      </Card.Body>
                    </Card>
                  );
                })}
            </Fragment>
            {!isDisabled && (
              <AddBtn
                disabled={isDisabled || formLoading}
                permission={PERMISSIONS.LEASING}
                onClick={() => {
                  arrayHelpers.push({
                    [residential_history.current_address.name]: '',
                    [residential_history.current_address_2.name]: '',
                    [residential_history.current_country.name]: '',
                    [residential_history.current_city.name]: '',
                    [residential_history.current_state.name]: '',
                    [residential_history.current_zip_code.name]: '',
                    [residential_history.landlord_email.name]: '',
                    [residential_history.landlord_name.name]: '',
                    [residential_history.landlord_phone_number.name]: '',
                    [residential_history.monthly_rent.name]: '',
                    [residential_history.reason_of_leaving.name]: '',
                    [residential_history.resident_from.name]: '',
                    [residential_history.resident_to.name]: '',
                  });
                }}
              />
            )}
          </div>
        )}
      />
    </div>
  );
};

export default Step03History;
