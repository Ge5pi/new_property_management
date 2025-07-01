import { Col, Container, Row } from 'react-bootstrap';

import { TenantLogin } from 'components/authenticate';
import { Header } from 'components/layouts/header';

import './auth.styles.css';

function Login() {
  return (
    <Row className="gx-0 min-vh-100">
      <Col xl={5} lg={6}>
        <Container fluid="xl">
          <Row className="gx-0 justify-content-between flex-column min-vh-100">
            <Col xs="auto">
              <Header />
            </Col>
            <Col xs="auto">
              <TenantLogin />
            </Col>
            <Col xs="auto">
              <Container fluid="xl">
                <Row className="gx-0 align-items-center justify-content-between">
                  <Col xs="auto">
                    <p className="text-muted">www.website.com</p>
                  </Col>
                  <Col xs="auto" className="d-lg-none d-block">
                    <p className="text-muted text-end">All Rights Reserved by PL-M</p>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </Col>

      <Col xl={7} lg={6} className="d-lg-block d-none">
        <div className="login-bg h-100 position-relative">
          <Container fluid className="position-absolute bottom-0">
            <Row className="gx-0 flex-column justify-content-end min-vh-100">
              <Col xs="auto">
                <div className="mx-5 pb-5 content">
                  <h2>Get your property</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc viverra placerat risus maecenas urna
                    blandit sed donec. Diam nisl odio velit sapien elit et.
                  </p>
                </div>
              </Col>
              <Col xs="auto">
                <p className="text-muted text-end">All Rights Reserved by PL-M</p>
              </Col>
            </Row>
          </Container>
        </div>
      </Col>
    </Row>
  );
}

export default Login;
