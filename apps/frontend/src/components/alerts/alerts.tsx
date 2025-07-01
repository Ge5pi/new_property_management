import { ReactNode } from 'react';
import { Button, Container, Modal } from 'react-bootstrap';

import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { IConfirmation } from './types';

import './alerts.styles.css';

interface IProps extends IConfirmation {
  children?: ReactNode;
}

const AlertWrapper = ({ title, description, type, children }: IProps) => {
  return (
    <div className="modal-content">
      <Modal.Header>
        <Container fluid className="popup-title pe-5">
          <h3 className="text-capitalize">{title ?? 'Confirmation'}</h3>
          {description && <p className="mt-2 small line-break">{description}</p>}
        </Container>
      </Modal.Header>
      {children && (
        <Modal.Body className="mt-5">
          <Container fluid className="text-start popup-wrapper">
            {children}
          </Container>
        </Modal.Body>
      )}
      <Modal.Footer className="mt-5">
        <Button className="border border-muted bg-transparent mx-2" variant="light" onClick={SwalExtended.clickCancel}>
          No, Cancel
        </Button>
        <Button className="mx-2" variant={`outline-${type}`} onClick={SwalExtended.clickConfirm}>
          Yes, confirm
        </Button>
      </Modal.Footer>
    </div>
  );
};

export default AlertWrapper;

export const Confirmation = (options: IConfirmation) => {
  return SweetAlert({
    size: 'md',
    html: <AlertWrapper {...options} />,
  }).fire({
    allowOutsideClick: false,
  });
};
