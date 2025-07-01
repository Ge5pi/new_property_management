import { useCallback } from 'react';
import { Button, Card, Col, Form, Row, Stack } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { clsx } from 'clsx';
import { FormikValues, useFormik } from 'formik';

import { useCreateContactMutation, useUpdateContactMutation } from 'services/api/contacts';
import useResponse from 'services/api/hooks/useResponse';
import { useCreateContactCategoryMutation, useGetContactCategoryByIdQuery } from 'services/api/system-preferences';
import { BaseQueryError } from 'services/api/types/rtk-query';

import { BackButton } from 'components/back-button';
import PageContainer from 'components/page-container';
import { SubmitBtn } from 'components/submit-button';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { InputPhone } from 'core-ui/input-phone';
import { Notify } from 'core-ui/toast';

import { useRedirect } from 'hooks/useRedirect';

import { getIDFromObject, getReadableError, renderFormError } from 'utils/functions';

import { IContactAPI, ISingleContact } from 'interfaces/ICommunication';
import { CustomOptionType } from 'interfaces/IInputs';
import { ContactCategory } from 'interfaces/ISettings';

import formFields from './components/contacts-form/form-fields';
import formValidation from './components/contacts-form/form-validation';

interface IProps {
  contact?: ISingleContact;
  update?: boolean;
}

const ContactsCRUD = ({ contact, update }: IProps) => {
  const { redirect } = useRedirect();
  const {
    contact_name,
    address,
    category,
    email,
    primary_contact,
    secondary_contact,
    website,
    is_display_to_tenant,
    is_selective,
  } = formFields;

  const {
    data: category_data,
    isLoading: categoryLoading,
    isFetching: categoryFetching,
  } = useGetContactCategoryByIdQuery(getIDFromObject('category', contact));

  const [
    createContact,
    { isSuccess: isCreateContactSuccess, isError: isCreateContactError, error: createContactError },
  ] = useCreateContactMutation();

  useResponse({
    isSuccess: isCreateContactSuccess,
    successTitle: 'New Contact has been added',
    isError: isCreateContactError,
    error: createContactError,
  });

  const [createContactCategory, { isError: isCreateContactCategoryError, error: createContactCategoryError }] =
    useCreateContactCategoryMutation();

  useResponse({
    isError: isCreateContactCategoryError,
    error: createContactCategoryError,
  });

  const [
    updateContact,
    { isSuccess: isUpdateContactSuccess, isError: isUpdateContactError, error: updateContactError },
  ] = useUpdateContactMutation();

  useResponse({
    isSuccess: isUpdateContactSuccess,
    successTitle: 'Contact has been updated successfully!',
    isError: isUpdateContactError,
    error: updateContactError,
  });

  const handleFormSubmission = async (values: FormikValues) => {
    const { category, ...rest } = values;

    const selection = category[0];
    let category_id = Number((category as Array<ContactCategory>)[0].id);
    if (typeof selection !== 'string' && 'customOption' in selection) {
      await createContactCategory({ name: (selection as CustomOptionType).name }).then(result => {
        if (result.data) {
          category_id = Number(result.data.id);
        } else {
          return result;
        }
      });
    }

    const api_data = {
      ...rest,
      category: Number(category_id),
    };

    if (contact && contact.id && update) {
      return await updateContact({ ...api_data, id: contact.id });
    }
    return await createContact(api_data as IContactAPI);
  };

  const {
    touched,
    errors,
    handleSubmit,
    isSubmitting,
    values,
    setFieldValue,
    handleChange,
    setFieldTouched,
    handleBlur,
  } = useFormik({
    initialValues: {
      name: contact?.name ?? '',
      category: category_data ? [category_data] : ([] as Option[]),
      primary_contact: contact?.primary_contact ?? '',
      secondary_contact: contact?.secondary_contact ?? '',
      email: contact?.email ?? '',
      street_address: contact?.street_address ?? '',
      website: contact?.website ?? '',
      selective: contact?.selective ?? false,
      display_to_tenants: contact?.display_to_tenants ?? false,
    },
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      handleFormSubmission(values)
        .then(result => {
          if (result.data) {
            redirect(`/contacts/details/${result.data.id}`, true, 'contacts');
          } else if (result.error) {
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
        .finally(() => setSubmitting(false));
    },
    validationSchema: formValidation,
  });

  const onCategorySelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('category', selected);
      } else {
        setFieldValue('category', []);
      }
    },
    [setFieldValue]
  );

  return (
    <PageContainer>
      <div>
        <BackButton />
        <h1 className="fw-bold h4 mt-1">{contact && update ? 'Update' : 'Create'} Contact</h1>
      </div>
      <Card className="border-0 p-0 page-section mb-3">
        <Card.Header className="border-0 p-4 pb-0 bg-transparent text-start">
          <div>
            <p className="fw-bold m-0 text-primary">Contact {contact && update ? 'update form' : 'creation form'}</p>
            <p className="small m-0">Fill out the form to {contact && update ? 'update' : 'add'} contact</p>
          </div>
        </Card.Header>

        <Card.Body className="p-4 text-start announcements-steps-card">
          <Form className="text-start" noValidate onSubmit={handleSubmit}>
            <Row>
              <Form.Group as={Col} md={6} lg={5} className="mb-4" controlId="ContactsFormName">
                <Form.Label className="form-label-md">Contact name</Form.Label>
                <Form.Control
                  autoFocus
                  type="text"
                  value={values.name}
                  name={contact_name.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.name && !errors.name}
                  isInvalid={touched.name && !!errors.name}
                  placeholder="Type here"
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-4">
              <Col md={6} lg={5}>
                <FilterPaginateInput
                  allowNew
                  name={category.name}
                  labelText="Select Category"
                  placeholder="Type Here..."
                  controlId={`ContactFormCategory`}
                  classNames={{
                    labelClass: 'popup-form-labels',
                    wrapperClass: 'mb-3',
                  }}
                  selected={values.category}
                  onSelectChange={onCategorySelected}
                  onBlurChange={() => setFieldTouched(category.name, true)}
                  isValid={touched.category && !errors.category}
                  isInvalid={touched.category && !!errors.category}
                  labelKey={`name`}
                  searchIcon={false}
                  error={errors.category}
                  model_label="system_preferences.ContactCategory"
                  disabled={categoryLoading || categoryFetching}
                />
              </Col>
            </Row>
            <Row>
              <Col md={5}>
                <Row className="justify-content-between">
                  <Col md={6} lg={5}>
                    <Form.Group className="mb-4" controlId="ContactsFormPrimaryContact">
                      <Form.Label className="form-label-md">Primary contact</Form.Label>
                      <InputPhone
                        onBlur={handleBlur}
                        value={values.primary_contact}
                        name={primary_contact.name}
                        onPhoneNumberChange={phone => setFieldValue(primary_contact.name, phone)}
                        isValid={touched.primary_contact && !errors.primary_contact}
                        isInvalid={touched.primary_contact && !!errors.primary_contact}
                      />
                      <Form.Control.Feedback type="invalid">{errors.primary_contact}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={5}>
                    <Form.Group className="mb-4" controlId="ContactsFormSecondaryContact">
                      <Form.Label className="form-label-md">Secondary contact</Form.Label>
                      <InputPhone
                        required={false}
                        onBlur={handleBlur}
                        value={values.secondary_contact}
                        name={secondary_contact.name}
                        onPhoneNumberChange={phone => setFieldValue(secondary_contact.name, phone)}
                        isValid={touched.secondary_contact && !errors.secondary_contact}
                        isInvalid={touched.secondary_contact && !!errors.secondary_contact}
                      />
                      <Form.Control.Feedback type="invalid">{errors.secondary_contact}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Form.Group as={Col} md={6} lg={5} className="mb-4" controlId="ContactsFormEmail">
                <Form.Label className="form-label-md">Email</Form.Label>
                <Form.Control
                  type="email"
                  name={email.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  isValid={touched.email && !errors.email}
                  isInvalid={touched.email && !!errors.email}
                  placeholder="johndoe@example.com"
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} md={6} lg={5} className="mb-4" controlId="ContactsFormWebsite">
                <Form.Label className="form-label-md">Website</Form.Label>
                <Form.Control
                  type="text"
                  name={website.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.website}
                  isValid={touched.website && !errors.website}
                  isInvalid={touched.website && !!errors.website}
                  placeholder="https://"
                />
                <Form.Control.Feedback type="invalid">{errors.website}</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-2">
              <Form.Group as={Col} md={12} className="mb-4" controlId="ContactsFormAddress">
                <Form.Label className="form-label-md">Street address</Form.Label>
                <Form.Control
                  as="textarea"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name={address.name}
                  isValid={touched.street_address && !errors.street_address}
                  isInvalid={touched.street_address && !!errors.street_address}
                  value={values.street_address}
                  placeholder="Type here"
                />
                <Form.Control.Feedback type="invalid">{errors.street_address}</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <div>
              <Stack direction="horizontal" gap={5}>
                <Form.Group controlId="ContactFormShareWithAll" className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Display to tenants"
                    className="small text-primary"
                    name={is_display_to_tenant.name}
                    checked={values.display_to_tenants}
                    isInvalid={touched.display_to_tenants && !!errors.display_to_tenants}
                    onChange={handleChange}
                    onClick={ev => {
                      if (ev.currentTarget.checked) {
                        setFieldValue(is_selective.name, false);
                      }
                    }}
                    onBlur={handleBlur}
                  />
                </Form.Group>
                <Form.Group controlId="ContactFormShareWithSelective" className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Selective"
                    className="small text-primary"
                    name={is_selective.name}
                    onChange={handleChange}
                    onClick={ev => {
                      if (ev.currentTarget.checked) {
                        setFieldValue(is_display_to_tenant.name, false);
                      }
                    }}
                    checked={values.selective}
                    isInvalid={touched.selective && !!errors.selective}
                    onBlur={handleBlur}
                  />
                </Form.Group>
              </Stack>
              <Form.Control.Feedback
                type="invalid"
                className={clsx({
                  'd-block':
                    (touched.selective && !!errors.selective) ||
                    (touched.display_to_tenants && !!errors.display_to_tenants),
                })}
              >
                {errors.selective || errors.display_to_tenants}
              </Form.Control.Feedback>
            </div>

            <div className="d-flex justify-content-end mt-5">
              <Button variant="light border-primary" className="px-4 py-1 me-3">
                Cancel
              </Button>
              <SubmitBtn
                loading={isSubmitting}
                disabled={isSubmitting}
                variant="primary"
                type="submit"
                className="px-4 py-1"
              >
                {contact && update ? 'Update Contact' : 'Create'}
              </SubmitBtn>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </PageContainer>
  );
};

export default ContactsCRUD;
