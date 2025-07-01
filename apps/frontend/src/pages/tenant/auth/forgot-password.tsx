import { Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Formik } from 'formik';
import * as yup from 'yup';

import { Header } from 'components/layouts/header';
import { SubmitBtn } from 'components/submit-button';

import './auth.styles.css';

function ForgotPassword() {
  const validateSchema = yup.object().shape({
    email_or_phone: yup.string().required('this field is required!'),
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
                <h2 className="form-title mb-1">Forgot Password</h2>
                <p className="form-subtitle">no worries we got it all covered</p>
              </div>

              <Formik
                validationSchema={validateSchema}
                onSubmit={values => {
                  console.log('::: values', values);
                }}
                initialValues={{
                  email_or_phone: '',
                }}
              >
                {({ handleSubmit, handleChange, handleBlur, isSubmitting, values, touched, errors }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="forgotEmailPhoneForm">
                      <Form.Label className="form-labels">Enter email or phone</Form.Label>
                      <Form.Control
                        autoFocus
                        type="email"
                        placeholder="johndoe@example.com"
                        name="email_or_phone"
                        value={values.email_or_phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched.email_or_phone && !errors.email_or_phone}
                        isInvalid={touched.email_or_phone && !!errors.email_or_phone}
                      />
                      <Form.Control.Feedback type="invalid">{errors.email_or_phone}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={'p'} className="fs-6 mb-4">
                      We will be sending you a verification code, just to know that its really you.
                    </Form.Group>

                    <SubmitBtn
                      type="submit"
                      size="lg"
                      variant="primary"
                      className="btn-login w-100 mt-3 mb-4 shadow"
                      loading={isSubmitting}
                    >
                      Send Code
                    </SubmitBtn>

                    <Form.Group className="text-center">
                      <Link to="/tenant" className="text-decoration-none">
                        Go back to login screen
                      </Link>
                    </Form.Group>
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

export default ForgotPassword;
