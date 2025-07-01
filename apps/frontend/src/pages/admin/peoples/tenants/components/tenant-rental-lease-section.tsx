import { Fragment, lazy } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';

import { Formik, FormikTouched, FormikValues } from 'formik';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import { useGetLeaseByIdQuery } from 'services/api/lease';
import {
  useCreateEmergencyContactMutation,
  useCreateFinancialInformationMutation,
  useGetEmergencyContactQuery,
  useGetFinancialInformationQuery,
  useGetRentalApplicationsByIdQuery,
  useUpdateEmergencyContactMutation,
  useUpdateFinancialInformationMutation,
  useUpdateRentalApplicationsMutation,
} from 'services/api/rental-applications';
import { useCreateTenantUpcomingActivityMutation, useGetTenantUpcomingActivitiesQuery } from 'services/api/tenants';
import { BaseQueryError } from 'services/api/types/rtk-query';

import { InformationSkeleton } from 'components/skeleton';

import { RenderInformation } from 'core-ui/render-information';
import { SuspenseHOC } from 'core-ui/suspense/suspense-hoc';
import { Notify } from 'core-ui/toast';

import { PERMISSIONS } from 'constants/permissions';
import { getValidID, populateDynamicField, renderFormError, returnIfHave } from 'utils/functions';

import { IRentalEmergencyContact, IRentalFinancialInformation, ISingleRentalForm } from 'interfaces/IApplications';
import { ITenantUpcomingActivities } from 'interfaces/ITenant';
import { IUpcomingActivities } from 'interfaces/IUpcomingActivities';

import BankAccountsDetails from './details/bank-accounts';
import ContactDetails from './details/contact-details';
import EmergencyDetails from './details/emergency-contact';
import formValidation from './details/form-validation';
import ResidentialHistory from './details/residential-history';
import SecondaryTenant from './details/secondary-resident';

const UpcomingActivities = lazy(() => import('components/upcoming-activities/upcoming-activities'));

interface IProps {
  rental_id: number;
  tenant?: string | number;
  lease_id: number;
}

interface ITouchedProps {
  setSubmitting: (param: boolean) => void;
  setFieldError: (field: string, message: string | undefined) => void;
  setTouched: (touched: FormikTouched<FormikValues>, shouldValidate?: boolean) => void;
  resetForm: () => void;
}

const TenantRentalLeaseSection = ({ lease_id, tenant, rental_id }: IProps) => {
  const rental_application = useGetRentalApplicationsByIdQuery(getValidID(rental_id));
  const lease = useGetLeaseByIdQuery(getValidID(lease_id));

  const [updateRentalApplication, { isError: isUpdateRentalApplicationError, error: updateRentalApplicationError }] =
    useUpdateRentalApplicationsMutation();

  useResponse({
    isError: isUpdateRentalApplicationError,
    error: updateRentalApplicationError,
  });

  const {
    data: financial_information,
    isLoading: financialLoading,
    isFetching: financialFetching,
  } = useGetFinancialInformationQuery(getValidID(rental_id));

  const {
    data: emergency_contacts,
    isLoading: emergencyLoading,
    isFetching: emergencyFetching,
  } = useGetEmergencyContactQuery(getValidID(rental_id));

  const handleInformationUpdate = (
    data: Partial<ISingleRentalForm>,
    { setSubmitting, setFieldError, setTouched, resetForm }: ITouchedProps
  ) => {
    updateRentalApplication(data)
      .then(result => {
        if (result.data) {
          Notify.show({
            title: 'Tenant detail has been successfully updated!',
            type: 'success',
          });
        } else {
          const error = result.error as BaseQueryError;
          if (error.status === 400 && error.data) {
            renderFormError(error.data, setFieldError);
          }
          resetForm();
        }
      })
      .finally(() => {
        setTouched({});
        setSubmitting(false);
      });
  };

  const upcoming_activities = useGetTenantUpcomingActivitiesQuery(getValidID(tenant));

  const [
    createUpcomingActivity,
    {
      isSuccess: isCreateUpcomingActivitySuccess,
      isError: isCreateUpcomingActivityError,
      error: createUpcomingActivityError,
    },
  ] = useCreateTenantUpcomingActivityMutation();

  useResponse({
    isSuccess: isCreateUpcomingActivitySuccess,
    successTitle: 'New Upcoming Activity has been added',
    isError: isCreateUpcomingActivityError,
    error: createUpcomingActivityError,
  });
  const handleUpcomingActivity = async (values: IUpcomingActivities) => {
    if (!isNaN(Number(tenant)) && Number(tenant) > 0) {
      return await createUpcomingActivity({ ...values, tenant: Number(tenant) } as ITenantUpcomingActivities);
    }

    return Promise.reject('Incomplete data found');
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
      }

      return results;
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
      }
      return results;
    });
  };

  return (
    <Fragment>
      <ApiResponseWrapper
        {...rental_application}
        showBack={false}
        renderResults={data => {
          return (
            <Fragment>
              <Card className="border-0 p-4 page-section mb-3">
                <Card.Header className="border-0 p-0 bg-transparent text-start">
                  <div>
                    <p className="fw-bold m-0 text-primary">Contact Information</p>
                    <p className="small">This sections includes all contact information about the tenant</p>
                  </div>
                </Card.Header>

                <Card.Body className="p-0">
                  <Row className="gx-0 justify-content-between">
                    <Col lg={4} md={6}>
                      <Formik
                        validateOnMount
                        enableReinitialize
                        validationSchema={formValidation.contact_details}
                        initialValues={{
                          phone_number: populateDynamicField('phone', data.phone_number),
                        }}
                        onSubmit={(values, touched) => {
                          const rental = {
                            id: Number(data.id),
                            applicant: Number(data.applicant),
                            phone_number: values.phone_number.map(num => num['phone']).filter(f => f !== ''),
                          };

                          if (rental.phone_number.length > 0) {
                            handleInformationUpdate(rental, touched);
                          }
                        }}
                      >
                        {({ handleSubmit }) => (
                          <Form className="text-start" noValidate onSubmit={handleSubmit}>
                            <ContactDetails render="phone" />
                          </Form>
                        )}
                      </Formik>
                    </Col>
                    <Col lg={4} md={6}>
                      <Formik
                        validateOnMount
                        enableReinitialize
                        validationSchema={formValidation.contact_details}
                        initialValues={{
                          emails: populateDynamicField('email', data.emails),
                        }}
                        onSubmit={(values, touched) => {
                          const rental = {
                            id: Number(data.id),
                            applicant: Number(data.applicant),
                            emails: values.emails.map(mail => mail['email']).filter(f => f !== ''),
                          };

                          if (rental.emails.length > 0) {
                            handleInformationUpdate(rental, touched);
                          }
                        }}
                      >
                        {({ handleSubmit }) => (
                          <Form className="text-start" noValidate onSubmit={handleSubmit}>
                            <ContactDetails render="email" />
                          </Form>
                        )}
                      </Formik>
                    </Col>
                  </Row>

                  <hr />

                  <div className="mt-4">
                    <RenderInformation title="Address" description={data.employer_address} />
                  </div>
                </Card.Body>
              </Card>

              <Formik
                validateOnMount
                enableReinitialize
                validationSchema={formValidation.emergency_contacts}
                initialValues={{
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
                }}
                onSubmit={values => {
                  const rental = {
                    id: Number(data.id),
                    applicant: Number(data.applicant),
                    emergency_contacts: values.emergency_contacts
                      .filter(e => !Object.values(e).every(e => !e))
                      .map(e => ({
                        ...e,
                        rental_application: Number(data.id),
                      })),
                  };

                  if (rental.emergency_contacts.length > 0) {
                    handleEmergencyContact(rental.emergency_contacts, rental.id);
                  }
                }}
              >
                {({ handleSubmit }) => (
                  <Form className="text-start" noValidate onSubmit={handleSubmit}>
                    <EmergencyDetails
                      application_id={Number(data.id)}
                      formLoading={emergencyLoading || emergencyFetching}
                    />
                  </Form>
                )}
              </Formik>
              <Formik
                validateOnMount
                enableReinitialize
                validationSchema={formValidation.financial_information}
                initialValues={{
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
                }}
                onSubmit={values => {
                  const rental = {
                    id: Number(data.id),
                    applicant: Number(data.applicant),
                    financial_information: values.financial_information
                      .filter(e => !Object.values(e).every(e => !e))
                      .map(f => ({
                        ...f,
                        rental_application: Number(data.id),
                      })),
                  };

                  if (rental.financial_information.length > 0) {
                    handleFinancialInformation(rental.financial_information, rental.id);
                  }
                }}
              >
                {({ handleSubmit }) => (
                  <Form className="text-start" noValidate onSubmit={handleSubmit}>
                    <BankAccountsDetails
                      application_id={Number(data.id)}
                      formLoading={financialLoading || financialFetching}
                    />
                  </Form>
                )}
              </Formik>

              <ResidentialHistory rental_application={data} />
            </Fragment>
          );
        }}
      />

      <ApiResponseWrapper
        {...lease}
        hideIfNoResults
        showBack={false}
        loadingComponent={
          <Fragment>
            <InformationSkeleton lines="single" />
            <InformationSkeleton skeletonType="column" title={false} columnCount={2} sm>
              <InformationSkeleton lines="single" />
            </InformationSkeleton>
            <InformationSkeleton lines="single" />
            <InformationSkeleton lines="single" />
          </Fragment>
        }
        renderResults={data => <SecondaryTenant lease={data} />}
      />

      <UpcomingActivities
        {...upcoming_activities}
        permission={PERMISSIONS.PEOPLE}
        createUpcomingActivity={handleUpcomingActivity}
      />
    </Fragment>
  );
};

export default SuspenseHOC(TenantRentalLeaseSection);
