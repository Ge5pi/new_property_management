import { AdminLogin } from 'components/authenticate';
import { Header } from 'components/layouts/header';

import './login.styles.css';

const Login = () => {
  return (
    <div className="login-background position-relative">
      <div className="login-bg-gradient position-fixed top-0 start-0" />
      <div className="text-white position-relative login-content">
        <Header />
        <div className="py-5 login-wrapper">
          <div className="container-fluid">
            <AdminLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
