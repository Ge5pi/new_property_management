import { CSSProperties, FormEvent, MouseEvent, MouseEventHandler, ReactNode } from 'react';
import { Button, Col, Container, Form, Modal, ProgressBar, Row, Spinner } from 'react-bootstrap';

import { clsx } from 'clsx';

import { SubmitBtn } from 'components/submit-button';

import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';

import AuthProvider from 'context/auth-context';

import { isEmpty } from 'utils/functions';

import './popup.styles.css';

export interface IProgressReport {
  show?: boolean;
  uploaded: number;
  progress: number;
  totalProgress: number;
  total: number;
}
interface Props {
  formId?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  actionBtn?: boolean;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  onReset?: MouseEventHandler<HTMLButtonElement> | undefined;
  isSubmitting?: boolean;
  disabled?: boolean;
  progress?: IProgressReport;
  successButton?: string;
  bodyClassName?: string;
  openForPreview?: boolean;
}

const Popup = ({
  title,
  subtitle,
  children,
  actionBtn = true,
  isSubmitting,
  disabled = false,
  onSubmit,
  onReset,
  progress,
  bodyClassName = 'mt-5',
  successButton = 'Save',
  openForPreview,
  formId,
}: Props) => {
  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    onReset && onReset(event);
    SwalExtended.close();
  };

  return (
    <AuthProvider>
      <div className="modal-content p-0">
        <Modal.Header>
          <Container fluid className="popup-title pe-5">
            <h3 className="text-capitalize">{title}</h3>
            {subtitle && <p className="mt-1">{subtitle}</p>}
          </Container>
        </Modal.Header>
        <Modal.Body className={bodyClassName}>
          {openForPreview ? (
            <div className="popup-wrapper">
              <Row className="gx-0 gy-3 align-items-stretch">
                <Col xs={12} className="text-start">
                  <div className="container-fluid">{children}</div>
                </Col>
              </Row>
            </div>
          ) : (
            <Form id={formId} className="text-start" noValidate onSubmit={onSubmit}>
              <div className="popup-wrapper">
                <Row className="gx-0 gy-3 align-items-stretch">
                  <Col xs={12}>
                    <div className="container-fluid">{children}</div>
                  </Col>
                  {actionBtn && !openForPreview && (
                    <Col xs={12}>
                      <div className="container-fluid">
                        <div className="my-2 d-flex align-items-center justify-content-end">
                          <Button
                            onClick={handleClose}
                            variant="light border-primary"
                            className="px-4 py-1 me-3"
                            disabled={isSubmitting}
                          >
                            Cancel
                          </Button>

                          <SubmitBtn
                            variant="primary"
                            type="submit"
                            disabled={disabled}
                            loading={isSubmitting}
                            className="px-4 py-1 text-capitalize"
                          >
                            {successButton}
                          </SubmitBtn>
                        </div>
                      </div>
                    </Col>
                  )}
                </Row>
              </div>
            </Form>
          )}
          {SwalExtended.isVisible() && SwalExtended.isLoading() && isSubmitting ? (
            <div className="sweet-loading-wrapper please-wait-progress-overlay">
              {progress && !isEmpty(progress) ? (
                <div className="text-center mx-auto">
                  <div className={clsx({ 'mb-4': !progress.show })}>
                    <Spinner animation="border" role="status" variant="info">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                  {progress.show && <ProgressOverlay progress={progress} />}
                </div>
              ) : (
                <Spinner animation="border" role="status" variant="info">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
            </div>
          ) : null}
        </Modal.Body>
      </div>
    </AuthProvider>
  );
};

interface IProgressOverlayProps {
  wrapperStyle?: CSSProperties;
  progress: IProgressReport;
}

export const ProgressOverlay = ({ progress, wrapperStyle }: IProgressOverlayProps) => {
  return (
    <div style={wrapperStyle}>
      <div className="small d-flex align-items-center mt-1">
        <span className="fw-bold me-1">{`Uploading files: ${progress.uploaded} of ${progress.total}`}</span>
        <span className="mx-1"> | </span>
        <span className="ms-1">Current:</span>
        <span className="fw-bold percentage-symbol me-1">{`${progress.progress}`}</span>
        <span className="mx-1"> | </span>
        <span className="ms-1">Total:</span>
        <span className="fw-bold percentage-symbol me-1">{progress.totalProgress}</span>
      </div>
      <ProgressBar variant="info" now={Number(progress.totalProgress)} />
    </div>
  );
};

export default ProviderHOC(Popup);
