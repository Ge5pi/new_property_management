import { Container, Modal, Spinner, Stack } from 'react-bootstrap';

import { SweetAlert } from 'core-ui/sweet-alert';

import { IPleaseWait } from './types';

import './alerts.styles.css';

const PleaseWaitWrapper = ({ description = 'processing your request' }: IPleaseWait) => {
  return (
    <div className="modal-content">
      <Modal.Header>
        <Container fluid className="popup-title pe-5">
          <Stack direction="horizontal" className="align-items-start" gap={3}>
            <Spinner animation="border" variant="primary" className="my-1" style={{ width: '2rem', height: '2rem' }} />
            <div>
              <h3 className="text-capitalize">Please wait...</h3>
              {description && <p className="alert-waiting-reason">{description}</p>}
            </div>
          </Stack>
        </Container>
      </Modal.Header>
    </div>
  );
};

export default PleaseWaitWrapper;
export const PleaseWait = (options?: IPleaseWait) => {
  return SweetAlert({
    html: <PleaseWaitWrapper {...options} />,
    showCloseButton: false,
  }).fire({
    allowOutsideClick: false,
  });
};
