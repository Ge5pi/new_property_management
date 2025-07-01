import { Col, Container, Form, Row } from 'react-bootstrap';
import OTPInput from 'react-otp-input';

import { clsx } from 'clsx';
import { Formik } from 'formik';
import * as yup from 'yup';

import { Header } from 'components/layouts/header';
import { SubmitBtn } from 'components/submit-button';

import './auth.styles.css';

const validateSchema = yup.object().shape({
  otp: yup.string().required('this field is required!').length(4),
});

function OTPConfirmation() {
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
                <h2 className="form-title mb-1 px-3">Enter OTP</h2>
                <p className="form-subtitle">We have sent a 4 digit code to your provided email</p>
              </div>

              <Formik
                validationSchema={validateSchema}
                onSubmit={values => {
                  console.log('::: values', values);
                }}
                initialValues={{
                  otp: '',
                }}
              >
                {({ handleSubmit, setFieldValue, handleBlur, isSubmitting, values, touched, errors }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="OTPFormPinInput">
                      <Form.Label className="form-labels visually-hidden">Enter OTP</Form.Label>
                      <OTPInput
                        shouldAutoFocus
                        value={values.otp}
                        inputType="number"
                        inputStyle={{
                          width: 68,
                          height: 85,
                          background: '#FBFBFB',
                          borderColor: errors.otp ? '#FF0000' : '#000',
                          fontSize: 18,
                          fontWeight: 600,
                        }}
                        containerStyle={{ display: 'flex', justifyContent: 'space-between' }}
                        onChange={value => setFieldValue('otp', value)}
                        renderInput={({ value, ...props }) => (
                          <Form.Control
                            {...props}
                            name="otp"
                            onBlur={handleBlur}
                            value={value.toString()}
                            isValid={touched.otp && !errors.otp}
                            isInvalid={touched.otp && !!errors.otp}
                          />
                        )}
                        numInputs={4}
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        className={clsx({
                          'd-block': touched.otp && !!errors.otp,
                          'd-none': touched.otp && !errors.otp,
                        })}
                      >
                        {errors.otp}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={'p'} className="fs-6 mt-3 mb-1">
                      Incase you have not received any code from us
                    </Form.Group>

                    <SubmitBtn
                      type="submit"
                      variant="link"
                      className="text-decoration-none link-info mb-4 px-0"
                      loading={isSubmitting}
                    >
                      Resend code
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

export default OTPConfirmation;
