import { Button, Col, Container, Form, Row, Stack } from 'react-bootstrap';

import { ErrorMessage, Field, Formik } from 'formik';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { BaseQueryError } from 'services/api/types/rtk-query';
import { useCreateRoleMutation, useGetGroupsQuery, useUpdateRoleMutation } from 'services/api/users';

import { BackButton } from 'components/back-button';
import PageContainer from 'components/page-container';
import { SubmitBtn } from 'components/submit-button';

import { Notify } from 'core-ui/toast';

import { useRedirect } from 'hooks/useRedirect';

import { getReadableError, isPositiveNumber, renderFormError } from 'utils/functions';

import { IRoles } from 'interfaces/IAvatar';

import AccessManagement from './access-management';
import formFields from './form-fields';
import formValidation from './form-validation';

interface IProps {
  update?: boolean;
  role?: IRoles;
}

const RoleCRUD = ({ role, update }: IProps) => {
  const { name, groups: current_groups, description } = formFields;
  const { redirect } = useRedirect();

  const groups = useGetGroupsQuery();

  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();

  const handleFormSubmission = async (values: IRoles) => {
    const record_id = role && role.id ? Number(role.id) : -1;
    const response =
      update && record_id > 0
        ? await updateRole({ ...values, id: record_id }).unwrap()
        : await createRole(values).unwrap();

    return {
      data: response,
      feedback: `Record has been successfully ${update ? 'updated!' : 'created!'}`,
      status: 'success' as 'success' | 'warning',
    };
  };

  return (
    <div className="my-4">
      <BackButton />
      <h1 className="fw-bold h4 mt-1">Manage Roles</h1>
      <PageContainer className="page-section my-4">
        <ApiResponseWrapper
          {...groups}
          renderResults={data => {
            const allGroups = data.filter(d => d.name.toUpperCase() !== 'ADMIN' && d.name.toUpperCase() !== 'TENANT');
            let initGroups: Array<number> = [];
            if (role && role.groups && role.groups.length > 0) {
              initGroups = initGroups.concat(
                role.groups.filter(element => allGroups.find(d => Number(d.id) === element))
              );
            } else {
              initGroups = initGroups.concat(allGroups.map(d => d.id as number));
            }

            return (
              <Container fluid>
                <Formik
                  initialValues={{
                    name: role?.name ?? '',
                    description: role?.description ?? '',
                    groups: allGroups && allGroups.length > 0 ? initGroups : [],
                  }}
                  enableReinitialize
                  validationSchema={formValidation}
                  onSubmit={(values, { setSubmitting, setFieldError }) => {
                    handleFormSubmission(values)
                      .then(result => {
                        Notify.show({ type: result.status, title: result.feedback });
                        redirect(`/users-and-roles/roles`, true, 'users-and-roles');
                      })
                      .catch(err => {
                        Notify.show({
                          type: 'danger',
                          title: 'Something went wrong!',
                          description: getReadableError(err),
                        });
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
                    isSubmitting,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                    values,
                    handleSubmit,
                  }) => (
                    <Form className="text-start" onSubmit={handleSubmit}>
                      <Row className="gy-3 mb-3">
                        <Col xxl={4} md={6} sm={8}>
                          <Form.Group className="mb-4 px-4" controlId="RoleFormName">
                            <Form.Label className="form-label-md">Role Name</Form.Label>
                            <Field
                              autoFocus
                              type="text"
                              as={Form.Control}
                              name={name.name}
                              isValid={touched.name && !errors.name}
                              isInvalid={touched.name && !!errors.name}
                              placeholder="Type here"
                            />
                            <ErrorMessage className="text-danger" name={name.name} component={Form.Text} />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="gy-3 gx-0 mb-3">
                        <Col xxl={4} lg={6} sm={8}>
                          <Form.Group controlId="RoleFormDescription" className="mb-4 px-4">
                            <Form.Label className="form-label-md">Description</Form.Label>
                            <Form.Control
                              placeholder="Some test here..."
                              as="textarea"
                              rows={4}
                              name={description.name}
                              value={values.description}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isValid={touched.description && !errors.description}
                              isInvalid={touched.description && !!errors.description}
                            />
                            <ErrorMessage className="text-danger" name={description.name} component={Form.Text} />
                          </Form.Group>
                        </Col>
                        <Col xl xs={12}>
                          <Container fluid>
                            <Row className="gy-3">
                              <Col xs={12}>
                                <div className="px-xl-0 px-4 mb-2">
                                  <p className="fw-bold m-0 text-primary">Access Management</p>
                                  <ErrorMessage
                                    className="text-danger"
                                    name={current_groups.name}
                                    component={Form.Text}
                                  />
                                </div>
                              </Col>
                              <Col xs={12}>
                                <div className="px-xl-0 px-4">
                                  <AccessManagement
                                    allGroups={allGroups}
                                    currentGroups={values.groups}
                                    onGroupSelect={selected => setFieldValue('groups', selected)}
                                  />
                                </div>
                              </Col>
                            </Row>
                          </Container>
                        </Col>
                      </Row>

                      <Stack className="justify-content-end sticky-bottom bg-white px-4 py-4" direction="horizontal">
                        <Button
                          type="reset"
                          variant="light border-primary"
                          onClick={() => redirect(-1)}
                          className="px-4 py-1 me-3"
                        >
                          Cancel
                        </Button>
                        <SubmitBtn variant="primary" type="submit" loading={isSubmitting} className="px-4 py-1">
                          {update && isPositiveNumber(role?.id) ? 'Update' : 'Add'}
                        </SubmitBtn>
                      </Stack>
                    </Form>
                  )}
                </Formik>
              </Container>
            );
          }}
        />
      </PageContainer>
    </div>
  );
};

export default RoleCRUD;
