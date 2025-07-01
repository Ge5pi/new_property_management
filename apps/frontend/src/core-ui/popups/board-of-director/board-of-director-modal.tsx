import { Col, Form, Row } from 'react-bootstrap';

import { Popup } from 'components/popup';

import { Avatar } from 'core-ui/user-avatar';

const BoardOfDirectorModal = () => {
  return (
    <Popup title={'Board Member'} subtitle={'Update or add board member information'}>
      <Row className="gx-md-4 g-sm-3 gx-0 align-items-center">
        <Col md={4} sm={'auto'}>
          <div className="text-center">
            <Avatar size={200} name={'profile picture'} />
            <button className="btn btn-sm link btn-link" type="button">
              Upload picture
            </button>
          </div>
        </Col>
        <Col md={8} sm>
          <Form.Group className="mb-3" controlId="DirectorsFormName">
            <Form.Label className="popup-form-labels">Full Name</Form.Label>
            <Form.Control autoFocus type="text" placeholder="Enter Full Name" />
          </Form.Group>

          <Form.Group controlId="DirectorsFormRole">
            <Form.Label className="popup-form-labels">Role</Form.Label>
            <Form.Control type="text" placeholder="Define person role" />
          </Form.Group>
        </Col>
      </Row>
      <div className="border-top my-4"></div>
      <Row className="g-sm-3 gx-0">
        <Col sm={6}>
          <Form.Group className="mb-3" controlId="DirectorsFormPhone">
            <Form.Label className="popup-form-labels">Phone number</Form.Label>
            <Form.Control type="number" placeholder="+00 000 0000 000" />
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group className="mb-3" controlId="DirectorsFormEmail">
            <Form.Label className="popup-form-labels">Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter Email address" />
          </Form.Group>
        </Col>

        <Col sm={6}>
          <Form.Group className="mb-3" controlId="DirectorsFormStartDate">
            <Form.Label className="popup-form-labels">Start date</Form.Label>
            <Form.Control type="date" defaultValue={new Date().toISOString().substring(0, 10)} />
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group className="mb-3" controlId="DirectorsFormEndDate">
            <Form.Label className="popup-form-labels">End date</Form.Label>
            <Form.Control type="date" defaultValue={new Date().toISOString().substring(0, 10)} />
          </Form.Group>
        </Col>
      </Row>
    </Popup>
  );
};

export default BoardOfDirectorModal;
