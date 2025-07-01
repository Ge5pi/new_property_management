import { Fragment } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ErrorMessage, Field, FieldArray, getIn, useFormikContext } from 'formik';

import useResponse from 'services/api/hooks/useResponse';
import { useDeleteDependentMutation, useDeletePetMutation } from 'services/api/rental-applications';

import { AddBtn } from 'core-ui/add-another';
import { CustomSelect } from 'core-ui/custom-select';
import { DeleteBtn } from 'core-ui/delete-btn';
import { GroupedField } from 'core-ui/grouped-field';
import { InputDate } from 'core-ui/input-date';

import { PERMISSIONS } from 'constants/permissions';

import { IRentalFormContactDetails } from 'interfaces/IApplications';

import formFields from './form-fields';

import PetsOptions from 'data/pets.json';
import RelationshipOptions from 'data/relationships.json';

interface IProps {
  isDisabled?: boolean;
  dependantLoading?: boolean;
  petsLoading?: boolean;
}

const Step05Dependents = ({ isDisabled = false, dependantLoading, petsLoading }: IProps) => {
  const { values, touched, errors, handleBlur, handleChange, setFieldValue, setFieldTouched } =
    useFormikContext<IRentalFormContactDetails>();

  const { dependents, pets } = formFields.formField;

  const { application: application_id } = useParams();
  const [deleteDependant, { isError: isDeleteFinancialInfoError, error: deleteFinancialInfoError }] =
    useDeleteDependentMutation();
  useResponse({
    isError: isDeleteFinancialInfoError,
    error: deleteFinancialInfoError,
  });

  const deleteDependantDetails = (id: number | string) => {
    if (application_id && Number(application_id) > 0) {
      deleteDependant({ id, rental_application: application_id });
    }
  };

  const [deletePets, { isError: isDeleteAdditionalInfoError, error: deleteAdditionalInfoError }] =
    useDeletePetMutation();
  useResponse({
    isError: isDeleteAdditionalInfoError,
    error: deleteAdditionalInfoError,
  });

  const deletePetsDetails = (id: number | string) => {
    if (application_id && Number(application_id) > 0) {
      deletePets({ id, rental_application: application_id });
    }
  };

  return (
    <div>
      <p className="fw-bold m-0 text-primary">Dependents Information</p>
      <p className="small">Provide the dependents details of the applicant</p>

      <FieldArray
        name={dependents.name}
        render={arrayHelpers => (
          <div className="mb-5">
            <Fragment>
              {values.dependents &&
                values.dependents.map((_, index) => {
                  const firstNameFieldName = `dependents[${index}].first_name`;
                  const lastNameFieldName = `dependents[${index}].last_name`;
                  const relationshipFieldName = `dependents[${index}].relationship`;
                  const dateOfBirthFieldName = `dependents[${index}].birthday`;

                  return (
                    <Card key={index} className="py-4 px-3 mb-4 position-relative bg-secondary">
                      <Card.Body>
                        <Row className="gx-sm-4 gx-0">
                          <Col lg={4} sm={6}>
                            <Form.Group className="mb-4" controlId={firstNameFieldName}>
                              <Form.Label className="form-label-md">First Name</Form.Label>
                              <Field
                                type="text"
                                disabled={isDisabled || dependantLoading || petsLoading}
                                name={firstNameFieldName}
                                as={Form.Control}
                                placeholder="Type here"
                                isInvalid={!!getIn(errors, firstNameFieldName) && getIn(touched, firstNameFieldName)}
                                isValid={getIn(touched, firstNameFieldName) && !getIn(errors, firstNameFieldName)}
                              />
                              <ErrorMessage className="text-danger" name={firstNameFieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                          <Col lg={4} sm={6}>
                            <Form.Group className="mb-4" controlId={lastNameFieldName}>
                              <Form.Label className="form-label-md">Last Name</Form.Label>
                              <Field
                                type="text"
                                disabled={isDisabled || dependantLoading || petsLoading}
                                name={lastNameFieldName}
                                as={Form.Control}
                                placeholder="Type here"
                                isInvalid={!!getIn(errors, lastNameFieldName) && getIn(touched, lastNameFieldName)}
                                isValid={getIn(touched, lastNameFieldName) && !getIn(errors, lastNameFieldName)}
                              />
                              <ErrorMessage className="text-danger" name={lastNameFieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                          <Col lg={4} sm={6}>
                            <CustomSelect
                              disabled={isDisabled || dependantLoading || petsLoading}
                              labelText="Relationship"
                              onSelectChange={value => setFieldValue(relationshipFieldName, value)}
                              onBlurChange={() => {
                                setFieldTouched(relationshipFieldName, true);
                              }}
                              name={relationshipFieldName}
                              value={_.relationship}
                              controlId={relationshipFieldName}
                              options={RelationshipOptions}
                              classNames={{
                                labelClass: 'form-label-md',
                                wrapperClass: 'mb-4',
                              }}
                              isInvalid={
                                !!getIn(errors, relationshipFieldName) && getIn(touched, relationshipFieldName)
                              }
                              isValid={getIn(touched, relationshipFieldName) && !getIn(errors, relationshipFieldName)}
                              error={
                                <ErrorMessage
                                  className="text-danger"
                                  name={relationshipFieldName}
                                  component={Form.Text}
                                />
                              }
                            />
                          </Col>
                          <Col md={4} sm={8}>
                            <InputDate
                              maxDate={new Date()}
                              openToDate={new Date(`01-01-${new Date().getFullYear() - 20}`)}
                              disabled={isDisabled || dependantLoading || petsLoading}
                              labelText={'Date of Birth'}
                              controlId={dateOfBirthFieldName}
                              classNames={{ wrapperClass: 'mb-4', labelClass: 'form-label-md' }}
                              onDateSelection={date => setFieldValue(dateOfBirthFieldName, date)}
                              onBlur={handleBlur}
                              value={_.birthday}
                              name={dateOfBirthFieldName}
                              isInvalid={!!getIn(errors, dateOfBirthFieldName) && getIn(touched, dateOfBirthFieldName)}
                              isValid={getIn(touched, dateOfBirthFieldName) && !getIn(errors, dateOfBirthFieldName)}
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

                        {index > 0 && (
                          <DeleteBtn
                            disabled={isDisabled || dependantLoading || petsLoading}
                            permission={PERMISSIONS.LEASING}
                            onClick={() => {
                              _.id && deleteDependantDetails(_.id);
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
                disabled={isDisabled || dependantLoading || petsLoading}
                permission={PERMISSIONS.LEASING}
                onClick={() => {
                  arrayHelpers.push({
                    [dependents.first_name.name]: '',
                    [dependents.last_name.name]: '',
                    [dependents.relationship.name]: '',
                    [dependents.birthday.name]: '',
                  });
                }}
              />
            )}
          </div>
        )}
      />

      <p className="fw-bold m-0 text-primary">Pets</p>
      <p className="small">Provide the income information</p>

      <FieldArray
        name={pets.name}
        render={arrayHelpers => (
          <div className="mb-5">
            <Fragment>
              {values.pets &&
                values.pets.map((_, index) => {
                  const petNameFieldName = `pets[${index}].name`;
                  const petAgeFieldName = `pets[${index}].age`;
                  const petTypeFieldName = `pets[${index}].pet_type`;
                  const petWeightFieldName = `pets[${index}].weight`;

                  return (
                    <Card key={index} className="py-4 px-3 mb-4 position-relative bg-secondary">
                      <Card.Body>
                        <Row className="gx-sm-4 gx-0">
                          <Col lg={4} sm={6}>
                            <Form.Group className="mb-4" controlId={petNameFieldName}>
                              <Form.Label className="form-label-md">Pet name</Form.Label>
                              <Field
                                type="text"
                                as={Form.Control}
                                name={petNameFieldName}
                                placeholder="Type here"
                                disabled={isDisabled || dependantLoading || petsLoading}
                                isInvalid={!!getIn(errors, petNameFieldName) && getIn(touched, petNameFieldName)}
                                isValid={getIn(touched, petNameFieldName) && !getIn(errors, petNameFieldName)}
                              />
                              <ErrorMessage className="text-danger" name={petNameFieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                          <Col lg={4} sm={6}>
                            <CustomSelect
                              labelText="Pet type"
                              disabled={isDisabled || dependantLoading || petsLoading}
                              onSelectChange={value => setFieldValue(petTypeFieldName, value)}
                              onBlurChange={() => {
                                setFieldTouched(petTypeFieldName, true);
                              }}
                              value={_.pet_type}
                              name={petTypeFieldName}
                              controlId={petTypeFieldName}
                              options={PetsOptions}
                              classNames={{
                                labelClass: 'popup-form-labels',
                                wrapperClass: 'mb-4',
                              }}
                              isInvalid={!!getIn(errors, petTypeFieldName) && getIn(touched, petTypeFieldName)}
                              isValid={getIn(touched, petTypeFieldName) && !getIn(errors, petTypeFieldName)}
                              error={
                                <ErrorMessage className="text-danger" name={petTypeFieldName} component={Form.Text} />
                              }
                            />
                          </Col>
                          <Col lg={4} sm={6}>
                            <Form.Group className="mb-4" controlId={petWeightFieldName}>
                              <Form.Label className="form-label-md">Weight (KG)</Form.Label>
                              <Field
                                type="number"
                                as={Form.Control}
                                name={petWeightFieldName}
                                disabled={isDisabled || dependantLoading || petsLoading}
                                placeholder="Type here"
                                isInvalid={!!getIn(errors, petWeightFieldName) && getIn(touched, petWeightFieldName)}
                                isValid={getIn(touched, petWeightFieldName) && !getIn(errors, petWeightFieldName)}
                              />
                              <ErrorMessage className="text-danger" name={petWeightFieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                          <Col lg={4} sm={6}>
                            <GroupedField
                              type="number"
                              controlId={petAgeFieldName}
                              wrapperClass="mb-4"
                              labelClass="form-label-md"
                              icon={'Yrs'}
                              position="end"
                              label="Age"
                              disabled={isDisabled || dependantLoading || petsLoading}
                              name={petAgeFieldName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={_.age}
                              placeholder="1"
                              step={1}
                              min={1}
                              isInvalid={!!getIn(errors, petAgeFieldName) && getIn(touched, petAgeFieldName)}
                              isValid={getIn(touched, petAgeFieldName) && !getIn(errors, petAgeFieldName)}
                              error={
                                <ErrorMessage className="text-danger" name={petAgeFieldName} component={Form.Text} />
                              }
                            />
                          </Col>
                        </Row>

                        {index > 0 && (
                          <DeleteBtn
                            disabled={isDisabled || dependantLoading || petsLoading}
                            permission={PERMISSIONS.LEASING}
                            onClick={() => {
                              _.id && deletePetsDetails(_.id);
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
                disabled={isDisabled || dependantLoading || petsLoading}
                permission={PERMISSIONS.LEASING}
                onClick={() => {
                  arrayHelpers.push({
                    [pets.pet_name.name]: '',
                    [pets.age.name]: '',
                    [pets.pet_type.name]: '',
                    [pets.weight.name]: '',
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

export default Step05Dependents;
