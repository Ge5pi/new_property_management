import { Fragment } from 'react';
import { Button, Col, Container, Form, Row, Stack } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { skipToken } from '@reduxjs/toolkit/query';
import { ErrorMessage, Field, Formik } from 'formik';

import { BaseQueryError } from 'services/api/types/rtk-query';
import { useCreateUserMutation, useGetListOfRolesQuery, useUpdateUserMutation } from 'services/api/users';

import { BackButton } from 'components/back-button';
import PageContainer from 'components/page-container';
import { SubmitBtn } from 'components/submit-button';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { InputPhone } from 'core-ui/input-phone';
import { Notify } from 'core-ui/toast';

import { useRedirect } from 'hooks/useRedirect';

import { getReadableError, getUserAccountType, isPositiveNumber, renderFormError } from 'utils/functions';

import { IUser } from 'interfaces/IAvatar';
import { IIDName } from 'interfaces/IGeneral';

import formFields from './form-fields';
import formValidation from './form-validation';

interface IProps {
  update?: boolean;
  user?: IUser;
}

const UsersCRUD = ({ update, user }: IProps) => {
  const {
    first_name,
    last_name,
    company_name,
    mobile_number,
    other_info,
    primary_email,
    role,
    username,
    secondary_email,
    telephone_number,
  } = formFields;

  const { redirect } = useRedirect();

  const {
    data: role_data,
    isLoading: roleLoading,
    isFetching: roleFetching,
  } = useGetListOfRolesQuery(user && user.roles && user.roles.length > 0 ? user.roles : skipToken);

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const handleFormSubmission = async (values: IUser) => {
    const record_id = user && user.id ? Number(user.id) : -1;
    const response =
      update && record_id > 0
        ? await updateUser({ ...values, id: record_id }).unwrap()
        : await createUser(values).unwrap();

    return {
      data: response,
      feedback: `Record has been successfully ${update ? 'updated!' : 'created!'}`,
      status: 'success' as 'success' | 'warning',
    };
  };

  return (
    <div className="my-4">
      <BackButton />
      <h1 className="fw-bold h4 mt-1">Manage User</h1>
      <PageContainer className="page-section my-4">
        <Container fluid>
          <Formik
            initialValues={{
              first_name: user?.first_name ?? '',
              last_name: user?.last_name ?? '',
              username: user?.username ?? '',
              company_name: user?.company_name ?? '',
              telephone_number: user?.telephone_number ?? '',
              mobile_number: user?.mobile_number ?? '',
              email: user?.email ?? '',
              secondary_email: user?.secondary_email ?? '',
              other_information: user?.other_information ?? '',
              roles: role_data ? role_data : ([] as Option[]),
              is_tenant: user && getUserAccountType(user) === 'TENANT' ? true : false,
              is_superuser: user && getUserAccountType(user) === 'SUPER_ADMIN' ? true : false,
            }}
            enableReinitialize
            validationSchema={formValidation}
            onSubmit={(values, { setSubmitting, setFieldError }) => {
              let roles: Array<number> = [];
              if (values.roles && values.roles.length > 0) {
                roles = roles.concat((values.roles as IIDName[]).map(r => r.id as number));
              }

              handleFormSubmission({ ...values, is_active: true, roles })
                .then(result => {
                  Notify.show({ type: result.status, title: result.feedback });
                  redirect(`/users-and-roles/details/${result.data.id}`, true, 'users-and-roles');
                })
                .catch(err => {
                  Notify.show({ type: 'danger', title: 'Something went wrong!', description: getReadableError(err) });
                  const error = err as BaseQueryError;
                  if (error.status === 400 && error.data) {
                    renderFormError(error.data, setFieldError);
                  }
                })
                .finally(() => setSubmitting(false));
            }}
          >
            {({
              errors,
              touched,
              setFieldValue,
              handleBlur,
              handleChange,
              setFieldTouched,
              isSubmitting,
              values,
              handleSubmit,
            }) => (
              <Form className="text-start" onSubmit={handleSubmit}>
                <Row className="gy-3 mb-3">
                  <Col xs={12}>
                    <div className="pt-4 px-4 mb-2">
                      <p className="fw-bold m-0 text-primary">Personal Information</p>
                    </div>
                  </Col>
                  <Col xxl={4} md={6} sm={8}>
                    <Form.Group className="mb-4 px-4" controlId="UserFormFirstName">
                      <Form.Label className="form-label-md">First Name</Form.Label>
                      <Field
                        autoFocus
                        type="text"
                        as={Form.Control}
                        name={first_name.name}
                        isValid={touched.first_name && !errors.first_name}
                        isInvalid={touched.first_name && !!errors.first_name}
                        placeholder="Type here"
                      />
                      <ErrorMessage className="text-danger" name={first_name.name} component={Form.Text} />
                    </Form.Group>
                  </Col>
                  <Col xxl={4} md={6} sm={8}>
                    <Form.Group className="mb-4 px-4" controlId="UserFormLastName">
                      <Form.Label className="form-label-md">Last Name</Form.Label>
                      <Field
                        type="text"
                        as={Form.Control}
                        name={last_name.name}
                        isValid={touched.last_name && !errors.last_name}
                        isInvalid={touched.last_name && !!errors.last_name}
                        placeholder="Type here"
                      />
                      <ErrorMessage className="text-danger" name={last_name.name} component={Form.Text} />
                    </Form.Group>
                  </Col>
                  <Col xxl={4} md={6} sm={8}>
                    <Form.Group className="mb-4 px-4" controlId="UserFormUserName">
                      <Form.Label className="form-label-md">Username</Form.Label>
                      <Field
                        type="text"
                        as={Form.Control}
                        name={username.name}
                        isValid={touched.username && !errors.username}
                        isInvalid={touched.username && !!errors.username}
                        placeholder="Type here"
                      />
                      <ErrorMessage className="text-danger" name={username.name} component={Form.Text} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="gy-3 mb-3">
                  <Col xxl={4} md={6} sm={8}>
                    <Form.Group className="mb-4 px-4" controlId="UserFormCompanyName">
                      <Form.Label className="form-label-md">Company Name</Form.Label>
                      <Field
                        type="text"
                        as={Form.Control}
                        name={company_name.name}
                        isValid={touched.company_name && !errors.company_name}
                        isInvalid={touched.company_name && !!errors.company_name}
                        placeholder="Type here"
                      />
                      <ErrorMessage className="text-danger" name={company_name.name} component={Form.Text} />
                    </Form.Group>
                  </Col>
                </Row>
                <hr />
                <Row className="gy-3 mb-3">
                  <Col xs={12}>
                    <div className="pt-4 px-4 mb-2">
                      <p className="fw-bold m-0 text-primary">Contact Details</p>
                    </div>
                  </Col>
                  <Col xxl={4} md={6} sm={8}>
                    <Form.Group className="mb-4 px-4" controlId="UserFormTelephoneNumber">
                      <Form.Label className="form-label-md">Telephone Number</Form.Label>
                      <InputPhone
                        onBlur={handleBlur}
                        name={telephone_number.name}
                        value={values.telephone_number}
                        onPhoneNumberChange={phone => setFieldValue(telephone_number.name, phone)}
                        isValid={touched.telephone_number && !errors.telephone_number}
                        isInvalid={touched.telephone_number && !!errors.telephone_number}
                      />
                      <ErrorMessage className="text-danger" name={telephone_number.name} component={Form.Text} />
                    </Form.Group>
                  </Col>
                  <Col xxl={4} md={6} sm={8}>
                    <Form.Group className="mb-4 px-4" controlId="UserFormMobileNumber">
                      <Form.Label className="form-label-md">Mobile Number</Form.Label>
                      <InputPhone
                        onBlur={handleBlur}
                        name={mobile_number.name}
                        value={values.mobile_number}
                        onPhoneNumberChange={phone => setFieldValue(mobile_number.name, phone)}
                        isValid={touched.mobile_number && !errors.mobile_number}
                        isInvalid={touched.mobile_number && !!errors.mobile_number}
                      />
                      <ErrorMessage className="text-danger" name={mobile_number.name} component={Form.Text} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="gy-3 mb-3">
                  <Col xxl={4} md={6} sm={8}>
                    <Form.Group className="mb-4 px-4" controlId="UserFormPrimaryEmail">
                      <Form.Label className="form-label-md">Primary Email</Form.Label>
                      <Field
                        type="email"
                        as={Form.Control}
                        name={primary_email.name}
                        isValid={touched.email && !errors.email}
                        isInvalid={touched.email && !!errors.email}
                        placeholder="Type here"
                      />
                      <ErrorMessage className="text-danger" name={primary_email.name} component={Form.Text} />
                    </Form.Group>
                  </Col>
                  <Col xxl={4} md={6} sm={8}>
                    <Form.Group className="mb-4 px-4" controlId="UserFormSecondaryEmail">
                      <Form.Label className="form-label-md">Secondary Email</Form.Label>
                      <Field
                        type="email"
                        as={Form.Control}
                        name={secondary_email.name}
                        isValid={touched.secondary_email && !errors.secondary_email}
                        isInvalid={touched.secondary_email && !!errors.secondary_email}
                        placeholder="Type here"
                      />
                      <ErrorMessage className="text-danger" name={secondary_email.name} component={Form.Text} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="gy-3 mb-3">
                  <Col md={6} sm={8}>
                    <Form.Group className="mb-4 px-4" controlId="UserFormOtherInfo">
                      <Form.Label className="form-label-md">Other Info</Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="Some description here"
                        rows={3}
                        name={other_info.name}
                        value={values.other_information}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched.other_information && !errors.other_information}
                        isInvalid={touched.other_information && !!errors.other_information}
                      />
                      <ErrorMessage className="text-danger" name={other_info.name} component={Form.Text} />
                    </Form.Group>
                  </Col>
                </Row>

                {!(values.is_tenant || values.is_superuser) && (
                  <Fragment>
                    <hr />
                    <Row className="gy-3 my-3">
                      <Col md={6} sm={8}>
                        <FilterPaginateInput
                          multiple
                          name={role.name}
                          model_label="authentication.Role"
                          labelText="Select Role"
                          placeholder="Type Here..."
                          controlId="UsersFormSelectRole"
                          classNames={{
                            labelClass: 'popup-form-labels',
                            wrapperClass: 'mb-4 px-4',
                          }}
                          selected={values.roles}
                          onSelectChange={selected => {
                            if (selected.length) {
                              setFieldValue(role.name, selected);
                            } else {
                              setFieldValue(role.name, []);
                            }
                          }}
                          labelKey={`name`}
                          onBlurChange={() => setFieldTouched('roles', true)}
                          isValid={touched.roles && !errors.roles}
                          isInvalid={touched.roles && !!errors.roles}
                          searchIcon={false}
                          disabled={roleLoading || roleFetching}
                          error={errors.roles}
                        />
                      </Col>
                    </Row>
                  </Fragment>
                )}

                <Stack className="justify-content-end px-4 py-4 sticky-bottom bg-white" direction="horizontal">
                  <Button variant="light border-primary" className="px-4 py-1 me-3" onClick={() => redirect(-1)}>
                    Cancel
                  </Button>
                  <SubmitBtn variant="primary" type="submit" loading={isSubmitting} className="px-4 py-1">
                    {update && isPositiveNumber(user?.id) ? 'Update' : 'Create'}
                  </SubmitBtn>
                </Stack>
              </Form>
            )}
          </Formik>
        </Container>
      </PageContainer>
    </div>
  );
};

export default UsersCRUD;
