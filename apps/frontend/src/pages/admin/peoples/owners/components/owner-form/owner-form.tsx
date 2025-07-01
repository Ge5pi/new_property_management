import { Button, Card, Col, Form, Row, Stack } from 'react-bootstrap';

import { clsx } from 'clsx';
import { Formik } from 'formik';

import useResponse from 'services/api/hooks/useResponse';
import { useCreateOwnersMutation, useUpdateOwnersMutation } from 'services/api/owners';
import { BaseQueryError } from 'services/api/types/rtk-query';

import { BackButton } from 'components/back-button';
import { NotesControl } from 'components/notes';
import PageContainer from 'components/page-container';
import { SubmitBtn } from 'components/submit-button';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowScroll } from 'hooks/useWindowScroll';

import { populateDynamicField, renderFormError } from 'utils/functions';

import { ISinglePeopleOwner } from 'interfaces/IPeoples';

import BankAccountDetails from './bank-account-details';
import ContactDetails from './contact-details';
import formFields from './form-fields';
import formValidation from './form-validation';
import GeneralDetails from './general-details';
import TaxPayerDetails from './tax-payer-details';

interface IProps {
  owner?: ISinglePeopleOwner;
  owner_id?: number;
}

const OwnerForm = ({ owner, owner_id }: IProps) => {
  const { redirect } = useRedirect();
  const { notes } = formFields;

  // update Owners
  const [updateOwners, { isSuccess: isUpdateOwnersSuccess, isError: isUpdateOwnersError, error: updateOwnersError }] =
    useUpdateOwnersMutation();

  useResponse({
    isSuccess: isUpdateOwnersSuccess,
    successTitle: 'Owners Information has been successfully updated!',
    isError: isUpdateOwnersError,
    error: updateOwnersError,
  });

  const [createOwners, { isSuccess: isCreateOwnersSuccess, isError: isCreateOwnersError, error: createOwnersError }] =
    useCreateOwnersMutation();

  useResponse({
    isSuccess: isCreateOwnersSuccess,
    successTitle: 'New Owner has been successfully added!',
    isError: isCreateOwnersError,
    error: createOwnersError,
  });

  const { scrollY } = useWindowScroll();

  return (
    <Formik
      initialValues={{
        first_name: owner?.first_name ?? '',
        last_name: owner?.last_name ?? '',
        company_name: owner?.company_name ?? '',
        personal_contact_numbers: populateDynamicField('phone', owner?.personal_contact_numbers),
        personal_emails: populateDynamicField('email', owner?.personal_emails),
        company_contact_numbers: populateDynamicField('phone', owner?.company_contact_numbers),
        company_emails: populateDynamicField('email', owner?.company_emails),
        street_address: owner?.street_address ?? '',
        city: owner?.city ?? '',
        state: owner?.state ?? '',
        zip: owner?.zip ?? '',
        country: owner?.country ?? '',
        tax_payer: owner?.tax_payer ?? '',
        tax_payer_id: owner?.tax_payer_id ?? '',
        is_company_name_as_tax_payer: owner?.is_company_name_as_tax_payer ?? false,
        is_use_as_display_name: owner?.is_use_as_display_name ?? false,
        bank_name: owner?.bank_name ?? '',
        bank_account_number: owner?.bank_account_number ?? '',
        bank_routing_number: owner?.bank_routing_number ?? '',
        bank_account_title: owner?.bank_account_title ?? '',
        bank_branch: owner?.bank_branch ?? '',
        notes: owner?.notes ?? '',
      }}
      enableReinitialize={true}
      validationSchema={formValidation}
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        let data: ISinglePeopleOwner = {
          ...values,
          personal_contact_numbers: values.personal_contact_numbers.map(num => num['phone']).filter(f => f !== ''),
          personal_emails: values.personal_emails.map(mail => mail['email']).filter(f => f !== ''),
          company_contact_numbers: values.company_contact_numbers.map(num => num['phone']).filter(f => f !== ''),
          company_emails: values.company_emails.map(mail => mail['email']).filter(f => f !== ''),
        };

        const update = Boolean(Number(owner_id) > 0);
        if (update && owner && owner.id) {
          data = {
            ...data,
            id: owner.id,
          };
          updateOwners &&
            updateOwners(data)
              .then(result => {
                if (result.data) {
                  redirect(`/owners/${data.id}/details`, true, 'owners');
                } else {
                  const error = result.error as BaseQueryError;
                  if (error.status === 400 && error.data) {
                    renderFormError(error.data, setFieldError);
                  }
                }
              })
              .finally(() => setSubmitting(false));
        } else {
          createOwners &&
            createOwners(data)
              .then(result => {
                if (result.data) {
                  redirect(`/owners`, true, 'owners');
                } else {
                  const error = result.error as BaseQueryError;
                  if (error.status === 400 && error.data) {
                    renderFormError(error.data, setFieldError);
                  }
                }
              })
              .finally(() => setSubmitting(false));
        }
      }}
    >
      {({ values, handleBlur, handleChange, errors, touched, handleSubmit, isSubmitting }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <PageContainer>
            <div className={clsx('my-3', { 'px-3 sticky-top bg-white': scrollY > 150 })}>
              <Row className={clsx({ 'align-items-end': scrollY <= 150 }, { 'align-items-baseline': scrollY > 150 })}>
                <Col>
                  <div>
                    <BackButton className={clsx({ 'd-none': scrollY > 150 })} />
                    <h1 className="fw-bold h4 mt-1">
                      {Number(owner_id) > 0 ? 'Update Owner Information' : 'Create New Owner'}
                    </h1>
                  </div>
                </Col>
                <Col sm={'auto'}>
                  <div className="my-3">
                    <Stack gap={3} className="justify-content-end" direction="horizontal">
                      <Button
                        variant="light border-primary"
                        type="reset"
                        className="px-4 py-1"
                        onClick={() => redirect(-1)}
                      >
                        Cancel
                      </Button>
                      <SubmitBtn variant="primary" type="submit" className="px-4 py-1" loading={isSubmitting}>
                        Save
                      </SubmitBtn>
                    </Stack>
                  </div>
                </Col>
              </Row>
            </div>
            <GeneralDetails />
            <ContactDetails />
            <TaxPayerDetails />
            <BankAccountDetails />

            {/* Notes */}
            <Card className="border-0 p-4 page-section mb-3">
              <Card.Header className="border-0 p-0 bg-transparent text-start">
                <p className="fw-bold m-0 text-primary">Notes</p>
                <p className="small">Write down all relevant information and quick notes for your help over here</p>
              </Card.Header>

              <Card.Body className="p-0">
                <Form.Group className="mb-4" controlId="OtherInfoNotes">
                  <NotesControl
                    name={notes.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.notes}
                    isValid={touched.notes && !errors.notes}
                    isInvalid={touched.notes && !!errors.notes}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </PageContainer>
        </Form>
      )}
    </Formik>
  );
};

export default OwnerForm;
