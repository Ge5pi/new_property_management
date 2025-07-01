import { Modal, ModalProps, Spinner, Stack } from 'react-bootstrap';

const PleaseWaitModal = (props: ModalProps) => {
  return (
    <Modal
      {...props}
      centered
      backdrop="static"
      keyboard={false}
      aria-labelledby="please-wait-modal-title"
      className="please-wait-zIndex"
      backdropClassName="please-wait-zIndex"
    >
      <Modal.Body>
        <Stack direction="horizontal" className="align-items-start" gap={3}>
          <Spinner animation="border" variant="primary" className="my-1" style={{ width: '2rem', height: '2rem' }} />
          <div>
            <h1 className="fs-4 text-primary mb-0 fw-bold" id="please-wait-modal-title">
              Please wait...
            </h1>
            <p className="text-muted">processing your request</p>
          </div>
        </Stack>
      </Modal.Body>
    </Modal>
  );
};

export default PleaseWaitModal;
