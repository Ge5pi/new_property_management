import { Form } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { Formik } from 'formik';
import { authValidationSchema } from 'validations/base';

import { useLoginUserMutation } from 'services/api/auth';

import { SubmitBtn } from 'components/submit-button';

import { PasswordControl } from 'core-ui/password-control';
import { Notify } from 'core-ui/toast';

import { useAuthState } from 'hooks/useAuthState';

import { getReadableError } from 'utils/functions';

const AdminLogin = () => {
  const { handleLogin } = useAuthState();

  const [searchParam] = useSearchParams();
  const navigate = useNavigate();

  const [loginUser] = useLoginUserMutation();

  return (
    <div>
      <div className="text-center mb-5">
        <h2 className="form-title mb-0">Admin Portal</h2>
        <p className="form-subtitle text-light mt-1">Manage your Real Estate in a new way</p>
      </div>
      <Formik
        validationSchema={authValidationSchema}
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          loginUser({ ...values, loginFor: 'admin' })
            .unwrap()
            .then(response => {
              if (response.access) {
                handleLogin(true, response.access, response);

                let path = `/admin/dashboard`;
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
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="loginFormEmail">
              <Form.Label className="text-light form-labels">Email</Form.Label>
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
              <Form.Label className="text-light form-labels">Password</Form.Label>
              <PasswordControl
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.password && !errors.password}
                isInvalid={touched.password && !!errors.password}
                error={errors.password}
              />
            </Form.Group>
            <Form.Group className="text-end">
              <Link to={'/auth/forgot'} className="text-light text-decoration-none">
                Forgot Password?
              </Link>
            </Form.Group>
            <Form.Group className="my-3" controlId="loginFormCheckbox">
              <Form.Check type="checkbox" label="Remember me" />
            </Form.Group>
            <SubmitBtn className="btn btn-outline-secondary btn-lg w-100 mt-3" type="submit" loading={isSubmitting}>
              Sign In
            </SubmitBtn>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AdminLogin;
