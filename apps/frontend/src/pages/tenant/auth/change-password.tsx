import { Col, Container, Form, Row } from 'react-bootstrap';

import { Formik } from 'formik';
import * as yup from 'yup';

import { Header } from 'components/layouts/header';
import { SubmitBtn } from 'components/submit-button';

import { PasswordControl } from 'core-ui/password-control';

import './auth.styles.css';

function ChangePassword() {
  const validateSchema = yup.object().shape({
    new_password: yup
      .string()
      .required('this field is required!')
      .min(8, 'password is too short - should be 8 chars minimum.')
      .matches(
        /^(?=(?:[^a-z]*[a-z]){1})(?=(?:[^0-9]*[0-9]){1})(?=.*[!-/:-@[-`{-~]).{8,}$/i,
        'password must contain at least 8 characters, 1 uppercase letter, 1 numerical character and 1 special character'
      ),
    confirm_password: yup
      .string()
      .required('this field is required!')
      .min(8, 'password is too short - should be 8 chars minimum.')
      .matches(
        /^(?=(?:[^a-z]*[a-z]){1})(?=(?:[^0-9]*[0-9]){1})(?=.*[!-/:-@[-`{-~]).{8,}$/i,
        'password must contain at least 8 characters, 1 uppercase letter, 1 numerical character and 1 special character'
      )
      .oneOf([yup.ref('new_password')], 'Passwords must match'),
  });

  return (
    <Container fluid>
      <Row className="gx-0 justify-content-between flex-column min-vh-100">
        <Col xs={'auto'}>
          <Header />
        </Col>
        <Col xs={'auto'}>
          <div className="mx-auto" style={{ maxWidth: 500 }}>
            <div className="my-5 page-section px-5 py-4">
              <div className="text-center mb-5">
                <h2 className="form-title mb-1 px-3">Change Password</h2>
                <p className="form-subtitle">no worries we got it all covered</p>
              </div>

              <Formik
                validationSchema={validateSchema}
                onSubmit={values => {
                  console.log('::: values', values);
                }}
                initialValues={{
                  new_password: '',
                  confirm_password: '',
                }}
              >
                {({ handleSubmit, handleChange, handleBlur, isSubmitting, values, touched, errors }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="changePasswordFormNewPassword">
                      <Form.Label className="form-labels">Enter new password</Form.Label>
                      <PasswordControl
                        autoFocus
                        name="new_password"
                        value={values.new_password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched.new_password && !errors.new_password}
                        isInvalid={touched.new_password && !!errors.new_password}
                        error={errors.new_password}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="changePasswordFormConfirmPassword">
                      <Form.Label className="form-labels">Re-enter password</Form.Label>
                      <PasswordControl
                        name="confirm_password"
                        value={values.confirm_password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched.confirm_password && !errors.confirm_password}
                        isInvalid={touched.confirm_password && !!errors.confirm_password}
                        error={errors.confirm_password}
                      />
                    </Form.Group>

                    <SubmitBtn
                      type="submit"
                      size="lg"
                      variant="primary"
                      className="btn-login w-100 mt-3 mb-4 shadow"
                      loading={isSubmitting}
                    >
                      Save and go to login
                    </SubmitBtn>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Col>
        <Col xs={'auto'}>
          <p className="text-muted">www.website.com</p>
        </Col>
      </Row>
    </Container>
  );
}

export default ChangePassword;
