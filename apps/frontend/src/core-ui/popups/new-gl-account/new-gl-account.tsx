import { Col, Form, Row } from 'react-bootstrap';

import { Popup } from 'components/popup';

import { CustomSelect } from 'core-ui/custom-select';

interface IProps {
  update?: boolean;
}

const NewGLAccountModal = ({ update = false }: IProps) => {
  return (
    <Popup title={`${update ? 'Update' : 'Create'} new account`} subtitle="Add account information">
      <div className="mx-md-0 mx-sm-1 text-start">
        <Row className="gap-3 mb-4">
          <Col md={4}>
            <Form.Group controlId="NewGLAccountFormName">
              <Form.Label className="popup-form-labels">Account name</Form.Label>
              <Form.Control autoFocus type="text" placeholder="Add text here" />
            </Form.Group>
          </Col>
          <Col md={4}>
            <CustomSelect
              labelText="Type"
              name="type"
              controlId="NewGLAccountFormType"
              options={[{ value: '1', label: 'Option 1' }]}
              classNames={{
                labelClass: 'popup-form-labels',
                wrapperClass: 'mb-4',
              }}
            />
          </Col>

          <Col md={3}>
            <Row className="gx-0 mt-2">
              <Form.Label className="form-label-md small mb-2">Is parent account ?</Form.Label>
              <Form.Group as={Col} xs={'auto'} controlId="NewGLAccountFormIsParent">
                <Form.Check name="isParent" type="radio" label="Yes" className="small text-primary" value="yes" />
              </Form.Group>
              <Form.Group as={Col} xs={'auto'} className="ms-4" controlId="NewGLAccountFormIsParent">
                <Form.Check name="isParent" type="radio" label="No" value="no" className="small text-primary" />
              </Form.Group>
            </Row>
          </Col>
        </Row>

        <Row className="gap-3 mb-4">
          <Col md={6}>
            <Form.Group controlId="NewGLAccountFormName">
              <Form.Label className="popup-form-labels">Select child account</Form.Label>
              <Form.Control type="text" placeholder="Add text here" />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="NewGLAccountFormNotes" className="mb-4">
          <Form.Label className="popup-form-labels">Notes</Form.Label>
          <Form.Control placeholder="Some test here..." as="textarea" rows={3} name="notes" />
        </Form.Group>
      </div>
    </Popup>
  );
};

export default NewGLAccountModal;
