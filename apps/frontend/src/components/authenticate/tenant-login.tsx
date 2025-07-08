import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { Formik } from 'formik';
import { authValidationSchema } from 'validations/base';

import { useLoginUserMutation } from 'services/api/auth';

import { SubmitBtn } from 'components/submit-button';

import { GoogleIcon } from 'core-ui/icons';
import { PasswordControl } from 'core-ui/password-control';
import { Notify } from 'core-ui/toast';

import { useAuthState } from 'hooks/useAuthState';

import { getReadableError } from 'utils/functions';

const TenantLogin = () => {
  const { handleLogin } = useAuthState();

  const [searchParam] = useSearchParams();
  const navigate = useNavigate();

  const [loginUser] = useLoginUserMutation();

  return (
    <div className="mx-auto" style={{ maxWidth: 300 }}>
      <div className="my-5">
        <div className="text-center">
          <h2 className="form-title mb-0">Tenant Portal</h2>
          <p className="form-subtitle px-3">Manage your Real Estate in a new way</p>
        </div>

        <Formik
          validationSchema={authValidationSchema}
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            loginUser({ ...values, loginFor: 'tenant' })
              .unwrap()
              .then(response => {
                if (response.access) {
                  handleLogin(true, response.access, response);

                  let path = `/tenant/dashboard`;
                  if (searchParam.has('fallback')) {
                    path = searchParam.get('fallback') ?? path;
                  }

                  navigate(path);
                  Notify.show({
                    title: 'Login Successful!',
                    type: 'success',
                  });
                }
              })
              .catch(error => {
                const err = getReadableError(error);
                let message = err.message;
                if (err.code && err.code >= 401 && err.code <= 403) {
                  message = 'The email or password is incorrect.';
                  setFieldError('email', 'Please check your email address');
                  setFieldError('password', 'Please check your password');
                }

                Notify.show({
                  title: 'Authentication Error',
                  description: message,
                  type: 'danger',
                });
              })
              .finally(() => {
                setSubmitting(false);
              });
          }}
          initialValues={{
            email: '',
            password: '',
          }}
        >
          {({ handleSubmit, handleChange, handleBlur, isSubmitting, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit} className="my-5">
              <Form.Group className="mb-4" controlId="loginFormEmail">
                <Form.Label className="form-labels">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="johndoe@example.com"
                  name="email"
                  autoFocus
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.email && !errors.email}
                  isInvalid={touched.email && !!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="loginFormPassword">
                <Form.Label className="form-labels">Password</Form.Label>
                <PasswordControl
                  placeholder="Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.password && !errors.password}
                  isInvalid={touched.password && !!errors.password}
                  error={errors.password}
                />
              </Form.Group>
              <Form.Group className="text-end">
                <Link to={'forgot-password'} className="text-decoration-none">
                  Forgot Password?
                </Link>
              </Form.Group>
              <Form.Group className="my-3" controlId="loginFormCheckbox">
                <Form.Check type="checkbox" label="Remember me" />
              </Form.Group>
              <SubmitBtn
                size="lg"
                variant="primary"
                className="btn-login w-100 mt-3 mb-4 shadow"
                type="submit"
                loading={isSubmitting}
              >
                Login
              </SubmitBtn>
              <Button variant="outline-secondary" className="btn-google">
                <GoogleIcon /> <span className="text-muted">Login with Google</span>
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default TenantLogin;
