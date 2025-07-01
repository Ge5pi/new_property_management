import { Button, Card } from 'react-bootstrap';

import { ChangePasswordModal } from 'core-ui/popups/change-password';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

const OwnerPortal = () => {
  return (
    <Card className="border-0 min-h-100 page-section">
      <Card.Header className="my-2 border-0 bg-transparent text-start">
        <p className="fw-bold m-0 text-primary">Owner Portal</p>
      </Card.Header>
      <Card.Body className="text-start">
        <RenderInformation title="Email" email="johndoe@example.com" />
        <RenderInformation title="Status" html={<span className="text-success">Active</span>} />

        <Button
          variant="outline-primary"
          onClick={() => {
            SweetAlert({
              size: 'md',
              html: <ChangePasswordModal />,
            }).fire({
              allowOutsideClick: () => !SwalExtended.isLoading(),
            });
          }}
        >
          Change Password
        </Button>
      </Card.Body>
    </Card>
  );
};

export default OwnerPortal;
