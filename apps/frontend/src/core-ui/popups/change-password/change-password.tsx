import { Button, Form } from 'react-bootstrap';

import { Popup } from 'components/popup';

import { PasswordControl } from 'core-ui/password-control';

const ChangePassword = () => {
  return (
    <Popup title="Change password" subtitle="No worries, we got it all covered" actionBtn={false}>
      <div className="mx-3 mb-3">
        <Form.Group controlId="ChangePasswordFormNewPassword">
          <Form.Label className="popup-form-labels">Enter new password</Form.Label>
          <PasswordControl autoFocus />
        </Form.Group>

        <Form.Group controlId="ChangePasswordFormReEnterPassword" className="my-4">
          <Form.Label className="popup-form-labels">Re-enter password</Form.Label>
          <PasswordControl />
        </Form.Group>

        <Button className="w-100 mt-2" style={{ padding: '12px' }}>
          <span>Confirm & Save</span>
        </Button>
      </div>
    </Popup>
  );
};

export default ChangePassword;
