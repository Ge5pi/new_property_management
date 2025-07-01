import { Fragment } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ErrorMessage, Field, FieldArray, getIn, useFormikContext } from 'formik';

import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateRentalApplicationAttachmentsMutation,
  useDeleteEmergencyContactMutation,
  useDeleteRentalApplicationAttachmentsMutation,
  useGetRentalApplicationAttachmentsQuery,
} from 'services/api/rental-applications';

import { Attachments } from 'components/attachments';
import { NotesControl } from 'components/notes';

import { AddBtn } from 'core-ui/add-another';
import { CustomSelect } from 'core-ui/custom-select';
import { DeleteBtn } from 'core-ui/delete-btn';
import { InputPhone } from 'core-ui/input-phone';

import { PERMISSIONS } from 'constants/permissions';
import { getValidID } from 'utils/functions';

import { IRentalAttachments, IRentalFormContactDetails } from 'interfaces/IApplications';
import { IAttachments } from 'interfaces/IAttachments';

import formFields from './form-fields';

import RelationshipOptions from 'data/relationships.json';

interface IProps {
  isDisabled?: boolean;
  formLoading?: boolean;
}

const Step06PersonalInfo = ({ isDisabled = false, formLoading }: IProps) => {
  const { values, touched, errors, setFieldValue, handleChange, handleBlur, setFieldTouched } =
    useFormikContext<IRentalFormContactDetails>();

  const {
    emergency_contacts,
    is_defendant_in_any_lawsuit,
    is_convicted,
    have_filed_case_against_landlord,
    is_smoker,
    notes,
  } = formFields.formField;

  const { application: application_id } = useParams();
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
      <p className="fw-bold m-0 text-primary">Emergency contact</p>
      <p className="small">Enter the emergency contact information</p>

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
                                disabled={isDisabled || formLoading}
                                name={emergencyNameFieldName}
                                type="text"
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
                              disabled={isDisabled || formLoading}
                              labelText="Relationship"
                              onSelectChange={value => setFieldValue(emergencyRelationFieldName, value)}
                              onBlurChange={() => {
                                setFieldTouched(emergencyRelationFieldName, true);
                              }}
                              name={emergencyRelationFieldName}
                              value={_.relationship}
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
                                getIn(touched, emergencyRelationFieldName) && !getIn(errors, emergencyRelationFieldName)
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
                                disabled={isDisabled || formLoading}
                                name={emergencyPhoneFieldName}
                                value={_.phone_number}
                                onPhoneNumberChange={phone => setFieldValue(emergencyPhoneFieldName, phone)}
                                isInvalid={
                                  !!getIn(errors, emergencyPhoneFieldName) && getIn(touched, emergencyPhoneFieldName)
                                }
                                isValid={
                                  getIn(touched, emergencyPhoneFieldName) && !getIn(errors, emergencyPhoneFieldName)
                                }
                                onBlur={handleBlur}
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
                                disabled={isDisabled || formLoading}
                                name={emergencyAddressFieldName}
                                type="text"
                                as={Form.Control}
                                placeholder="Type Here..."
                                isInvalid={
                                  !!getIn(errors, emergencyAddressFieldName) &&
                                  getIn(touched, emergencyAddressFieldName)
                                }
                                isValid={
                                  getIn(touched, emergencyAddressFieldName) && !getIn(errors, emergencyAddressFieldName)
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
                            disabled={isDisabled || formLoading}
                            permission={PERMISSIONS.LEASING}
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
            {!isDisabled && (
              <AddBtn
                disabled={isDisabled || formLoading}
                permission={PERMISSIONS.LEASING}
                onClick={() => {
                  arrayHelpers.push({
                    [emergency_contacts.emergency_contact_name.name]: '',
                    [emergency_contacts.emergency_contact_address.name]: '',
                    [emergency_contacts.emergency_contact_relationship.name]: '',
                    [emergency_contacts.emergency_contact_phone_number.name]: '',
                  });
                }}
              />
            )}
          </div>
        )}
      />

      <p className="fw-bold m-0 mt-4 text-primary">General Questions</p>
      <p className="small">Provide relevant information to the following questions.</p>
      <Row className="gx-0 mt-4 mb-4">
        <Form.Label className="form-label-md">
          Have you ever been a defendant in unlawful detainer or failed to perform any obligation of a rental lease?
        </Form.Label>
        <Form.Group as={Col} xs={'auto'} controlId="OtherInfoDefendantLawsuitY">
          <Form.Check
            disabled={isDisabled}
            type="radio"
            label="Yes"
            className="small text-primary"
            value="yes"
            checked={values.is_defendant_in_any_lawsuit === true}
            name={is_defendant_in_any_lawsuit.name}
            onChange={() => setFieldValue(is_defendant_in_any_lawsuit.name, true)}
            onBlur={() => setFieldTouched(is_defendant_in_any_lawsuit.name)}
            isInvalid={touched.is_defendant_in_any_lawsuit && !!errors.is_defendant_in_any_lawsuit}
          />
        </Form.Group>
        <Form.Group as={Col} xs={'auto'} className="ms-4" controlId="OtherInfoDefendantLawsuitN">
          <Form.Check
            disabled={isDisabled}
            type="radio"
            label="No"
            value="no"
            checked={values.is_defendant_in_any_lawsuit === false}
            className="small text-primary"
            name={is_defendant_in_any_lawsuit.name}
            onChange={() => setFieldValue(is_defendant_in_any_lawsuit.name, false)}
            onBlur={() => setFieldTouched(is_defendant_in_any_lawsuit.name)}
            isInvalid={touched.is_defendant_in_any_lawsuit && !!errors.is_defendant_in_any_lawsuit}
          />
        </Form.Group>
      </Row>
      <Row className="gx-0 mb-4">
        <Form.Label className="form-label-md">Have you ever been convicted of crime?</Form.Label>
        <Form.Group as={Col} xs={'auto'} controlId="OtherInfoIsConvictedY">
          <Form.Check
            disabled={isDisabled}
            type="radio"
            label="Yes"
            className="small text-primary"
            value="yes"
            checked={values.is_convicted === true}
            name={is_convicted.name}
            onChange={() => setFieldValue(is_convicted.name, true)}
            onBlur={() => setFieldTouched(is_convicted.name)}
            isInvalid={touched.is_convicted && !!errors.is_convicted}
          />
        </Form.Group>
        <Form.Group as={Col} xs="auto" className="ms-4" controlId="OtherInfoIsConvictedN">
          <Form.Check
            disabled={isDisabled}
            type={'radio'}
            label="No"
            value="no"
            checked={values.is_convicted === false}
            className="small text-primary"
            name={is_convicted.name}
            onChange={() => setFieldValue(is_convicted.name, false)}
            onBlur={() => setFieldTouched(is_convicted.name)}
            isInvalid={touched.is_convicted && !!errors.is_convicted}
          />
        </Form.Group>
      </Row>
      <Row className="gx-0 mb-4">
        <Form.Label className="form-label-md">Have you ever filed case against a landlord?</Form.Label>
        <Form.Group as={Col} xs={'auto'} controlId="OtherInfoFiledCaseY">
          <Form.Check
            disabled={isDisabled}
            type="radio"
            label="Yes"
            className="small text-primary"
            value="yes"
            checked={values.have_filed_case_against_landlord === true}
            name={have_filed_case_against_landlord.name}
            onChange={() => setFieldValue(have_filed_case_against_landlord.name, true)}
            onBlur={() => setFieldTouched(have_filed_case_against_landlord.name)}
            isInvalid={touched.have_filed_case_against_landlord && !!errors.have_filed_case_against_landlord}
          />
        </Form.Group>
        <Form.Group as={Col} xs="auto" className="ms-4" controlId="OtherInfoFiledCaseN">
          <Form.Check
            disabled={isDisabled}
            type={'radio'}
            label="No"
            value="no"
            checked={values.have_filed_case_against_landlord === false}
            className="small text-primary"
            name={have_filed_case_against_landlord.name}
            onChange={() => setFieldValue(have_filed_case_against_landlord.name, false)}
            onBlur={() => setFieldTouched(have_filed_case_against_landlord.name)}
            isInvalid={touched.have_filed_case_against_landlord && !!errors.have_filed_case_against_landlord}
          />
        </Form.Group>
      </Row>
      <Row className="gx-0 mb-5">
        <Form.Label className="form-label-md">Are you or any of your dependents a smoker?</Form.Label>
        <Form.Group as={Col} xs={'auto'} controlId="OtherInfoSmokerY">
          <Form.Check
            disabled={isDisabled}
            type="radio"
            label="Yes"
            className="small text-primary"
            value="yes"
            checked={values.is_smoker === true}
            name={is_smoker.name}
            onChange={() => setFieldValue(is_smoker.name, true)}
            onBlur={() => setFieldTouched(is_smoker.name)}
            isInvalid={touched.is_smoker && !!errors.is_smoker}
          />
        </Form.Group>
        <Form.Group as={Col} xs="auto" className="ms-4" controlId="OtherInfoSmokerN">
          <Form.Check
            disabled={isDisabled}
            type={'radio'}
            label="No"
            value="no"
            checked={values.is_smoker === false}
            className="small text-primary"
            name={is_smoker.name}
            onChange={() => setFieldValue(is_smoker.name, false)}
            onBlur={() => setFieldTouched(is_smoker.name)}
            isInvalid={touched.is_smoker && !!errors.is_smoker}
          />
        </Form.Group>
      </Row>
      <p className="fw-bold mb-0 mt-5 text-primary">Notes</p>
      <p className="small">Write down all relevant information and quick notes for your help over here</p>
      <Form.Group className="mb-4" controlId="OtherInfoNotes">
        <NotesControl
          name={notes.name}
          disabled={isDisabled}
          onBlur={handleBlur}
          value={values.notes}
          onChange={handleChange}
          isValid={touched.notes && !errors.notes}
          isInvalid={touched.notes && !!errors.notes}
        />
        <Form.Control.Feedback type="invalid">{errors && errors?.notes}</Form.Control.Feedback>
      </Form.Group>

      {isDisabled ? (
        <Attachments
          titleClass="ps-0"
          disabled={isDisabled}
          uploadPermission={PERMISSIONS.LEASING}
          deletePermission={PERMISSIONS.LEASING}
          uploadInfo={{ folder: 'attachments', module: 'rental-applications' }}
        />
      ) : (
        <ApplicationAttachments />
      )}
    </div>
  );
};

const ApplicationAttachments = () => {
  const { application: application_id } = useParams();

  // create attachment
  const [
    createRentalApplicationAttachments,
    { isSuccess: isCreateAttachmentSuccess, isError: isCreateAttachmentError, error: attachmentError },
  ] = useCreateRentalApplicationAttachmentsMutation();
  useResponse({
    isSuccess: isCreateAttachmentSuccess,
    successTitle: 'Your file has been successfully uploaded!',
    isError: isCreateAttachmentError,
    error: attachmentError,
  });

  const [
    deleteRentalApplicationAttachments,
    { isSuccess: isDeleteAttachmentSuccess, isError: isDeleteAttachmentError, error: deleteAttachmentError },
  ] = useDeleteRentalApplicationAttachmentsMutation();

  useResponse({
    isSuccess: isDeleteAttachmentSuccess,
    successTitle: 'Your file has been successfully deleted!',
    isError: isDeleteAttachmentError,
    error: deleteAttachmentError,
  });

  const handleAttachmentDelete = async (row: object) => {
    const attachment = row as IRentalAttachments;
    if (attachment.id && attachment.rental_application) {
      await deleteRentalApplicationAttachments({
        rental_application: attachment.rental_application,
        id: attachment.id,
      });
      return Promise.resolve('delete successful');
    }

    return Promise.reject('Incomplete data found');
  };

  const handleAttachmentUpload = async (data: IAttachments) => {
    if (application_id && Number(application_id) > 0) {
      return await createRentalApplicationAttachments({ ...data, rental_application: Number(application_id) });
    }
    return Promise.reject('Incomplete data found');
  };

  // get rental attachments
  const attachments = useGetRentalApplicationAttachmentsQuery(getValidID(application_id));

  return (
    <Attachments
      {...attachments}
      uploadPermission={PERMISSIONS.LEASING}
      deletePermission={PERMISSIONS.LEASING}
      onDelete={handleAttachmentDelete}
      onUpload={handleAttachmentUpload}
      uploadInfo={{ folder: 'attachments', module: 'rental-applications' }}
      titleClass="ps-0"
    />
  );
};

export default Step06PersonalInfo;
