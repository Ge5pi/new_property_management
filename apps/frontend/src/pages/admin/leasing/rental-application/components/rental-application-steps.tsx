import { Children, MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Form, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { Formik } from 'formik';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateAdditionalIncomeMutation,
  useCreateDependentMutation,
  useCreateEmergencyContactMutation,
  useCreateFinancialInformationMutation,
  useCreatePetMutation,
  useCreateRentalHistoryMutation,
  useGetAdditionalIncomeQuery,
  useGetDependentQuery,
  useGetEmergencyContactQuery,
  useGetFinancialInformationQuery,
  useGetPetQuery,
  useGetRentalHistoryQuery,
  useUpdateAdditionalIncomeMutation,
  useUpdateDependentMutation,
  useUpdateEmergencyContactMutation,
  useUpdateFinancialInformationMutation,
  useUpdatePetMutation,
  useUpdateRentalApplicationsMutation,
  useUpdateRentalHistoryMutation,
} from 'services/api/rental-applications';
import { useGetRentalTemplateByIdQuery } from 'services/api/rental-templates';
import { BaseQueryError } from 'services/api/types/rtk-query';

import { CustomStepper } from 'components/custom-stepper';

import { CheckMarkIcon, NextIcon, PrevIcon } from 'core-ui/icons';
import { Notify } from 'core-ui/toast';

import { rentalApplicationSteps } from 'constants/steps';
import {
  getIDFromObject,
  getReadableError,
  getValidID,
  populateDynamicField,
  renderFormError,
  returnIfHave,
} from 'utils/functions';

import {
  ApplicantType,
  IApplicantForm,
  IRentalAdditionalIncome,
  IRentalDependents,
  IRentalEmergencyContact,
  IRentalFinancialInformation,
  IRentalPets,
  IRentalResidentialHistory,
  IRentalTemplate,
  ISingleRentalForm,
} from 'interfaces/IApplications';

import {
  Step01General,
  Step02PersonalInfo,
  Step03History,
  Step04FinancialInfo,
  Step05Dependents,
  Step06Other,
} from 'pages/admin/leasing/components/application-steps';

import formValidation from './form-validation';

interface IProps {
  rental_template_id: number;
  rental_application?: ISingleRentalForm;
  applicationSteps?: Array<{ label: string; name: string }>;
  applicant: IApplicantForm;
}

const RentalApplicationForm = ({ rental_template_id, applicationSteps, applicant, rental_application }: IProps) => {
  const template = useGetRentalTemplateByIdQuery(getValidID(rental_template_id));

  return (
    <ApiResponseWrapper
      {...template}
      showMiniError
      renderResults={data => {
        if (applicationSteps && applicationSteps.length <= 0) {
          applicationSteps = Object.keys(data).flatMap(k =>
            rentalApplicationSteps.filter(r => r.name === k && data[k as keyof IRentalTemplate])
          );
        }

        return (
          <RentalApplicationSteps
            rental_application={rental_application}
            applicationSteps={applicationSteps}
            templateName={data.name}
            applicant={applicant}
          />
        );
      }}
    />
  );
};

interface IStepsProps extends Partial<IProps> {
  templateName: string;
}

const RentalApplicationSteps = ({
  applicationSteps = [],
  applicant,
  rental_application,
  templateName,
}: IStepsProps) => {
  const { applicant: applicant_id, application: application_id } = useParams();
  const [updateRentalApplication, { isError: isUpdateRentalApplicationError, error: updateRentalApplicationError }] =
    useUpdateRentalApplicationsMutation();

  useResponse({
    isError: isUpdateRentalApplicationError,
    error: updateRentalApplicationError,
  });

  const {
    data: emergency_contacts,
    isLoading: emergencyLoading,
    isFetching: emergencyFetching,
  } = useGetEmergencyContactQuery(getIDFromObject('id', rental_application));
  const {
    data: dependents,
    isLoading: dependentLoading,
    isFetching: dependentFetching,
  } = useGetDependentQuery(getIDFromObject('id', rental_application));
  const {
    data: financial_information,
    isLoading: financialLoading,
    isFetching: financialFetching,
  } = useGetFinancialInformationQuery(getIDFromObject('id', rental_application));
  const {
    data: additional_income,
    isLoading: incomeLoading,
    isFetching: incomeFetching,
  } = useGetAdditionalIncomeQuery(getIDFromObject('id', rental_application));
  const {
    data: pets,
    isLoading: petsLoading,
    isFetching: petsFetching,
  } = useGetPetQuery(getIDFromObject('id', rental_application));
  const {
    data: residential_history,
    isLoading: historyLoading,
    isFetching: historyFetching,
  } = useGetRentalHistoryQuery(getIDFromObject('id', rental_application));

  const residentLoading = historyLoading || historyFetching;

  const additionalLoading = incomeLoading || incomeFetching;
  const infoLoading = financialLoading || financialFetching;

  const contactLoading = emergencyLoading || emergencyFetching;

  const dependLoading = dependentLoading || dependentFetching;
  const petLoading = petsLoading || petsFetching;

  const [index, setIndex] = useState(1);
  const [validationSchema, setValidationSchema] = useState<unknown[]>([]);
  const [currentValidationSchema, setCurrentValidationSchema] = useState<unknown>();

  const isLastStep = index === applicationSteps.length;

  const prevButton = () => {
    setIndex(prev => prev - 1);
  };

  const nextButton = () => {
    if (!isLastStep) setIndex(prev => prev + 1);
  };

  const GetSteps = useMemo(() => {
    const steps: {
      [key: string]: JSX.Element;
    } = {
      general_info: <Step01General />,
      personal_details: <Step02PersonalInfo />,
      rental_history: <Step03History formLoading={residentLoading} />,
      financial_info: <Step04FinancialInfo financeLoading={infoLoading} incomeLoading={additionalLoading} />,
      dependents_info: <Step05Dependents dependantLoading={dependLoading} petsLoading={petLoading} />,
      other_info: <Step06Other formLoading={contactLoading} />,
    };

    const demoApplicationSteps: JSX.Element[] = [];

    Object.keys(steps).forEach(
      key => applicationSteps.find(step => step.name === key) && demoApplicationSteps.push(steps[key])
    );

    const validateSchema: unknown[] = [];
    Object.keys(formValidation).forEach(
      key =>
        applicationSteps.find(step => step.name === key) && validateSchema.push(formValidation[key as keyof unknown])
    );

    setValidationSchema(validateSchema);
    return Children.toArray(demoApplicationSteps);
  }, [applicationSteps, contactLoading, petLoading, infoLoading, dependLoading, additionalLoading, residentLoading]);

  const handleStepClick: MouseEventHandler<HTMLElement> = ev => {
    const dataKey = ev.currentTarget.dataset['step'];
    setIndex(Number(dataKey));
  };

  useEffect(() => {
    setCurrentValidationSchema(validationSchema[index - 1]);
  }, [index, validationSchema]);

  const [updateResidentHistory] = useUpdateRentalHistoryMutation();
  const [createResidentHistory] = useCreateRentalHistoryMutation();

  const handleResidentHistory = async (histories: IRentalResidentialHistory[], rental_application_id: number) => {
    const promises = histories.map(history => {
      if (history.id && Number(history.id) > 0) {
        return updateResidentHistory({ ...history, rental_application: rental_application_id });
      }
      return createResidentHistory({ ...history, rental_application: rental_application_id });
    });

    return await Promise.all(promises).then(results => {
      if (results.some(r => 'error' in r)) {
        Notify.show({
          type: 'danger',
          title: 'Error while saving Rental History details. Please verify your input',
        });
        return 'is_rental_history_filled';
      }
    });
  };

  const [updateAdditionalIncome] = useUpdateAdditionalIncomeMutation();
  const [createAdditionalIncome] = useCreateAdditionalIncomeMutation();

  const handleAdditionalIncome = async (incomes: IRentalAdditionalIncome[], rental_application_id: number) => {
    const promises = incomes.map(income => {
      if (income.id && Number(income.id) > 0) {
        return updateAdditionalIncome({ ...income, rental_application: rental_application_id });
      }
      return createAdditionalIncome({ ...income, rental_application: rental_application_id });
    });

    return await Promise.all(promises).then(results => {
      if (results.some(r => 'error' in r)) {
        Notify.show({
          type: 'danger',
          title: 'Error while saving Additional Income details. Please verify your input',
        });
        return 'is_financial_info_filled';
      }
    });
  };

  const [updateFinancialInformation] = useUpdateFinancialInformationMutation();
  const [createFinancialInformation] = useCreateFinancialInformationMutation();

  const handleFinancialInformation = async (
    financial: IRentalFinancialInformation[],
    rental_application_id: number
  ) => {
    const promises = financial.map(income => {
      if (income.id && Number(income.id) > 0) {
        return updateFinancialInformation({ ...income, rental_application: rental_application_id });
      }
      return createFinancialInformation({ ...income, rental_application: rental_application_id });
    });

    return await Promise.all(promises).then(results => {
      if (results.some(r => 'error' in r)) {
        Notify.show({
          type: 'danger',
          title: 'Error while saving Financial Information. Please verify your input',
        });
        return 'is_financial_info_filled';
      }
    });
  };

  const [updateEmergencyContact] = useUpdateEmergencyContactMutation();
  const [createEmergencyContact] = useCreateEmergencyContactMutation();

  const handleEmergencyContact = async (contacts: IRentalEmergencyContact[], rental_application_id: number) => {
    const promises = contacts.map(contact => {
      if (contact.id && Number(contact.id) > 0) {
        return updateEmergencyContact({ ...contact, rental_application: rental_application_id });
      }
      return createEmergencyContact({ ...contact, rental_application: rental_application_id });
    });

    return await Promise.all(promises).then(results => {
      if (results.some(r => 'error' in r)) {
        Notify.show({
          type: 'danger',
          title: 'Error while saving Emergency Contacts for the application. Please verify your input',
        });
        return 'is_other_info_filled';
      }
    });
  };

  const [updateDependent] = useUpdateDependentMutation();
  const [createDependent] = useCreateDependentMutation();

  const handleDependent = async (dependencies: IRentalDependents[], rental_application_id: number) => {
    const promises = dependencies.map(dependency => {
      if (dependency.id && Number(dependency.id) > 0) {
        return updateDependent({ ...dependency, rental_application: rental_application_id });
      }
      return createDependent({ ...dependency, rental_application: rental_application_id });
    });

    return await Promise.all(promises).then(results => {
      if (results.some(r => 'error' in r)) {
        Notify.show({
          type: 'danger',
          title: 'Error while saving Dependents information. Please verify your input',
        });
        return 'is_dependents_filled';
      }
    });
  };

  const [updatePets] = useUpdatePetMutation();
  const [createPets] = useCreatePetMutation();

  const handlePets = async (animals: IRentalPets[], rental_application_id: number) => {
    const promises = animals.map(animal => {
      if (animal.id && Number(animal.id) > 0) {
        return updatePets({ ...animal, rental_application: rental_application_id });
      }
      return createPets({ ...animal, rental_application: rental_application_id });
    });

    return await Promise.all(promises).then(results => {
      if (results.some(r => 'error' in r)) {
        Notify.show({
          type: 'danger',
          title: 'Error while saving Pets details. Please verify your input',
        });
        return 'is_dependents_filled';
      }
    });
  };

  const personal_phones = useMemo(() => {
    if (rental_application && applicant) {
      const phones = Object.assign([], rental_application.phone_number);
      phones.push(applicant.phone_number);

      return phones.filter((item, index) => phones.indexOf(item) === index);
    }

    return [];
  }, [applicant, rental_application]);

  const personal_emails = useMemo(() => {
    if (rental_application && applicant) {
      const emails = Object.assign([], rental_application.emails);
      emails.push(applicant.email);

      return emails.filter((item, index) => emails.indexOf(item) === index);
    }

    return [];
  }, [applicant, rental_application]);

  return (
    <Card className="border-0 p-4 page-section">
      <Card.Header className="p-0 border-0 bg-transparent text-start">
        <p className="fw-bold m-0 text-primary">Rental Application</p>
        <p className="small">Provide the needed information to submit the rental application</p>

        <p className="mt-3">
          This Application Form uses following Template: <span className="fw-bold">{templateName}</span>
        </p>
      </Card.Header>

      <Card.Body className="px-0 text-start">
        <Formik
          validateOnMount
          initialValues={{
            applicant: applicant_id,
            application_type: rental_application?.application_type ?? ('DEPENDENT' as ApplicantType),
            desired_move_in_date: rental_application?.desired_move_in_date ?? '',
            legal_first_name: rental_application?.legal_first_name ?? applicant?.first_name ?? '',
            middle_name: rental_application?.middle_name ?? '',
            legal_last_name: rental_application?.legal_last_name ?? applicant?.last_name ?? '',
            notes: rental_application?.notes ?? '',
            birthday: rental_application?.birthday ?? '',
            ssn_or_tin: rental_application?.ssn_or_tin ?? '',
            driving_license_number: rental_application?.driving_license_number ?? '',
            employer_name: rental_application?.employer_name ?? '',
            employer_address: rental_application?.employer_address ?? '',
            employer_phone_number: rental_application?.employer_phone_number ?? '',
            employment_city: rental_application?.employment_city ?? '',
            employment_zip_code: rental_application?.employment_zip_code ?? '',
            employment_country: rental_application?.employment_country ?? '',
            monthly_salary: rental_application?.monthly_salary ?? '',
            position_held: rental_application?.position_held ?? '',
            years_worked: rental_application?.years_worked ?? 1,
            supervisor_name: rental_application?.supervisor_name ?? '',
            supervisor_title: rental_application?.supervisor_title ?? '',
            supervisor_phone_number: rental_application?.supervisor_phone_number ?? '',
            supervisor_email: rental_application?.supervisor_email ?? '',
            emergency_contacts: returnIfHave<IRentalEmergencyContact>(
              [
                {
                  name: '',
                  relationship: '',
                  phone_number: '',
                  address: '',
                },
              ],
              emergency_contacts
            ),
            is_defendant_in_any_lawsuit: rental_application?.is_defendant_in_any_lawsuit ?? false,
            is_convicted: rental_application?.is_convicted ?? false,
            have_filed_case_against_landlord: rental_application?.have_filed_case_against_landlord ?? false,
            is_smoker: rental_application?.is_smoker ?? false,
            phone_number: populateDynamicField('phone', personal_phones),
            emails: populateDynamicField('email', personal_emails),
            residential_history: returnIfHave<IRentalResidentialHistory>(
              [
                {
                  current_address: '',
                  current_address_2: '',
                  current_city: '',
                  current_zip_code: '',
                  current_country: '',
                  current_state: '',
                  monthly_rent: '',
                  resident_from: '',
                  resident_to: '',
                  landlord_name: '',
                  landlord_phone_number: '',
                  landlord_email: '',
                  reason_of_leaving: '',
                },
              ],
              residential_history
            ),
            financial_information: returnIfHave<IRentalFinancialInformation>(
              [
                {
                  name: '',
                  bank: '',
                  account_type: '',
                  account_number: '',
                },
              ],
              financial_information
            ),
            additional_income: returnIfHave<IRentalAdditionalIncome>(
              [
                {
                  monthly_income: '',
                  source_of_income: '',
                },
              ],
              additional_income
            ),
            dependents: returnIfHave<IRentalDependents>(
              [
                {
                  first_name: '',
                  last_name: '',
                  birthday: '',
                  relationship: '',
                },
              ],
              dependents
            ),
            pets: returnIfHave<IRentalPets>(
              [
                {
                  name: '',
                  pet_type: '',
                  weight: '',
                  age: '',
                },
              ],
              pets
            ),
            is_general_info_filled: rental_application?.is_general_info_filled ?? false,
            is_personal_details_filled: rental_application?.is_personal_details_filled ?? false,
            is_rental_history_filled: rental_application?.is_rental_history_filled ?? false,
            is_financial_info_filled: rental_application?.is_financial_info_filled ?? false,
            is_dependents_filled: rental_application?.is_dependents_filled ?? false,
            is_other_info_filled: rental_application?.is_other_info_filled ?? false,
          }}
          enableReinitialize
          validationSchema={currentValidationSchema}
          onSubmit={(values, { setTouched, setSubmitting, setFieldError }) => {
            if (application_id && Number(application_id) > 0 && applicant_id && Number(applicant_id) > 0) {
              const steps = applicationSteps.reduce(
                (o, key) => ({
                  ...o,
                  [key.name]: true,
                }),
                {}
              );

              let request_body: Partial<ISingleRentalForm> = {
                ...steps,
                id: Number(application_id),
                applicant: Number(applicant_id),
              };

              const promises = [];
              switch (applicationSteps[index - 1].name) {
                case 'general_info':
                  request_body = {
                    ...request_body,
                    desired_move_in_date: values.desired_move_in_date || undefined,
                    legal_first_name: values.legal_first_name,
                    legal_last_name: values.legal_last_name,
                    middle_name: values.middle_name,
                    application_type: values.application_type,
                    is_general_info_filled: true,
                  };
                  break;
                case 'personal_details':
                  request_body = {
                    ...request_body,
                    birthday: values.birthday || undefined,
                    ssn_or_tin: values.ssn_or_tin,
                    driving_license_number: values.driving_license_number,
                    phone_number: values.phone_number.map(num => num['phone']).filter(f => f !== ''),
                    emails: values.emails.map(mail => mail['email']).filter(f => f !== ''),
                    is_personal_details_filled: true,
                  };
                  break;
                case 'rental_history':
                  request_body = {
                    ...request_body,
                    is_rental_history_filled: true,
                    residential_history: values.residential_history
                      .filter(e => !Object.values(e).every(e => !e))
                      .map(r => ({
                        ...r,
                        resident_to: r.resident_to || undefined,
                        resident_from: r.resident_from || undefined,
                        rental_application: Number(application_id),
                      })),
                  };

                  if (request_body.residential_history && request_body.residential_history.length > 0) {
                    promises.push(handleResidentHistory(request_body.residential_history, Number(application_id)));
                  }
                  break;
                case 'financial_info':
                  request_body = {
                    ...request_body,
                    financial_information: values.financial_information
                      .filter(e => !Object.values(e).every(e => !e))
                      .map(f => ({
                        ...f,
                        rental_application: Number(application_id),
                      })),
                    additional_income: values.additional_income
                      .filter(e => !Object.values(e).every(e => !e))
                      .map(a => ({
                        ...a,
                        rental_application: Number(application_id),
                      })),
                    employer_name: values.employer_name,
                    employer_address: values.employer_address,
                    employer_phone_number: values.employer_phone_number,
                    employment_country: values.employment_country,
                    employment_city: values.employment_city,
                    employment_zip_code: values.employment_zip_code,
                    monthly_salary: values.monthly_salary,
                    position_held: values.position_held,
                    years_worked: values.years_worked,
                    supervisor_name: values.supervisor_name,
                    supervisor_title: values.supervisor_title,
                    supervisor_email: values.supervisor_email,
                    is_financial_info_filled: true,
                  };

                  if (request_body.financial_information && request_body.financial_information.length > 0) {
                    promises.push(
                      handleFinancialInformation(request_body.financial_information, Number(application_id))
                    );
                  }

                  if (request_body.additional_income && request_body.additional_income.length > 0) {
                    promises.push(handleAdditionalIncome(request_body.additional_income, Number(application_id)));
                  }
                  break;
                case 'dependents_info':
                  request_body = {
                    ...request_body,
                    dependents: values.dependents
                      .filter(e => !Object.values(e).every(e => !e))
                      .map(d => ({ ...d, rental_application: Number(application_id) })),
                    pets: values.pets
                      .filter(e => !Object.values(e).every(e => !e))
                      .map(p => ({
                        ...p,
                        weight: p.weight || undefined,
                        age: p.age || undefined,
                        rental_application: Number(application_id),
                      })),
                    is_dependents_filled: true,
                  };

                  if (request_body.dependents && request_body.dependents.length > 0) {
                    promises.push(handleDependent(request_body.dependents, Number(application_id)));
                  }

                  if (request_body.pets && request_body.pets.length > 0) {
                    promises.push(handlePets(request_body.pets, Number(application_id)));
                  }
                  break;
                case 'other_info':
                  request_body = {
                    ...request_body,
                    emergency_contacts: values.emergency_contacts
                      .filter(e => !Object.values(e).every(e => !e))
                      .map(e => ({
                        ...e,
                        rental_application: Number(application_id),
                      })),
                    have_filed_case_against_landlord: values.have_filed_case_against_landlord,
                    is_defendant_in_any_lawsuit: values.is_defendant_in_any_lawsuit,
                    is_convicted: values.is_convicted,
                    is_smoker: values.is_smoker,
                    notes: values.notes,
                    is_other_info_filled: true,
                  };

                  if (request_body.emergency_contacts && request_body.emergency_contacts.length > 0) {
                    promises.push(handleEmergencyContact(request_body.emergency_contacts, Number(application_id)));
                  }
                  break;

                default:
                  Notify.show({
                    type: 'danger',
                    title: "Something's not right. Invalid step details found.",
                    description: 'Please try refreshing the page, or contact support',
                  });
                  return;
              }

              let is_something_failed = false;
              Promise.all(promises)
                .then(results => {
                  results.forEach(field => {
                    if (field && field in request_body) {
                      request_body[field] = false;
                      is_something_failed = true;
                    }
                  });
                  return updateRentalApplication(request_body);
                })
                .then(result => {
                  if (result.data) {
                    if (is_something_failed) return;
                    if (isLastStep) {
                      const is_steps_filled: Array<{ [key: string]: unknown }> = [];
                      Object.keys(values).forEach(key => {
                        if (
                          applicationSteps.find(
                            step => `is_${step.name}_filled` === key && values[key as keyof unknown] === true
                          )
                        ) {
                          is_steps_filled.push({ [key]: values[key as keyof unknown] });
                        }
                      });

                      let successMessage = 'Rental Application has been updated!';
                      if (is_steps_filled.length === applicationSteps.length) {
                        successMessage = 'Rental Application Form has been submitted successfully!';
                      }

                      Notify.show({
                        title: successMessage,
                        type: 'success',
                      });
                    } else {
                      setIndex(prev => prev + 1);
                    }
                  } else {
                    const error = result.error as BaseQueryError;
                    if (error.status === 400 && error.data) {
                      renderFormError(error.data, setFieldError);
                    }
                  }
                })
                .catch(error => {
                  Notify.show({
                    type: 'danger',
                    title: 'Something went wrong, please check your input record',
                    description: getReadableError(error),
                  });
                })
                .finally(() => {
                  setTouched({});
                  setSubmitting(false);
                });
            }
          }}
        >
          {({ isSubmitting, handleSubmit, dirty, setTouched }) => (
            <Form className="text-start" noValidate onSubmit={handleSubmit}>
              <CustomStepper
                active={index}
                steps={applicationSteps}
                randomSteps
                nameAsLabel
                onStepClick={ev => {
                  if (!isSubmitting) {
                    handleStepClick(ev);
                    setTouched({});
                  }
                }}
                actions={
                  <RentalApplicationButtons
                    prevButton={prevButton}
                    isSubmitting={isSubmitting}
                    nextButton={e => {
                      if (!dirty) {
                        e.preventDefault();
                        setTouched({});
                        nextButton();
                      }
                    }}
                    currentItem={index}
                    totalItems={applicationSteps.length}
                  />
                }
              >
                {GetSteps}
              </CustomStepper>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

interface IStepActions {
  prevButton?: MouseEventHandler<HTMLButtonElement>;
  nextButton?: MouseEventHandler<HTMLButtonElement>;
  isSubmitting?: boolean;
  currentItem: number;
  totalItems: number;
}

const RentalApplicationButtons = ({ currentItem, isSubmitting, nextButton, prevButton, totalItems }: IStepActions) => {
  return (
    <Row className="gx-1 justify-content-sm-end justify-content-center">
      {Number(currentItem) > 1 && (
        <Col xs={'auto'}>
          <OverlayTrigger
            overlay={tooltipProps => (
              <Tooltip {...tooltipProps} id={`tooltip-prev`}>
                Previous Step
              </Tooltip>
            )}
          >
            <Button
              size={'lg'}
              variant={'outline-light'}
              className="d-inline-flex align-items-center btn-next-prev mx-2 px-0"
              disabled={isSubmitting}
              onClick={prevButton}
            >
              <PrevIcon />
            </Button>
          </OverlayTrigger>
        </Col>
      )}
      <Col xs={'auto'}>
        <OverlayTrigger
          overlay={tooltipProps => (
            <Tooltip {...tooltipProps} id={`tooltip-next`}>
              {Number(currentItem) === Number(totalItems) ? 'Save Changes' : 'Next Step'}
            </Tooltip>
          )}
        >
          <Button
            size={'lg'}
            type={'submit'}
            variant={'outline-light'}
            className="d-inline-flex align-items-center btn-next-prev mx-2 px-0"
            onClick={nextButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : Number(currentItem) === Number(totalItems) ? (
              <CheckMarkIcon />
            ) : (
              <NextIcon />
            )}
          </Button>
        </OverlayTrigger>
      </Col>
    </Row>
  );
};

export default RentalApplicationForm;
