import { memo, useEffect, useMemo, useState } from 'react';
import { Card, CloseButton, Stack, Toast } from 'react-bootstrap';

import { clsx } from 'clsx';

import { IIcons } from 'interfaces/IIcons';
import { IErrorResponse, IToastProps } from 'interfaces/IToast';

import { usePageVisibility } from './hooks/usePageVisibility';

import './toast-extended.scss';

interface IterableErrorType extends Omit<IErrorResponse, 'message'> {
  message: string | string[];
}

const ToastExtended = (props: IToastProps) => {
  const { id, destroy, title, description, duration = 4000, type = 'success', autoHide = true } = props;

  const [hide, setHide] = useState(autoHide);
  const pageVisibility = usePageVisibility();

  const handleClose = () => {
    if (destroy && id) {
      destroy(id);
    }
  };

  const handleMouseHover = () => {
    if (pageVisibility) {
      setHide(false);
    }
  };

  const handleMouseLeave = () => {
    if (pageVisibility && autoHide !== false) {
      setHide(true);
    }
  };

  useEffect(() => {
    if (autoHide) {
      setHide(pageVisibility);
    }
  }, [pageVisibility, autoHide]);

  const errorDetails = useMemo(() => {
    let iterableError: IterableErrorType = { message: '' };
    if (description) {
      if (typeof description === 'string') {
        iterableError.message = description.trim().includes('\n') ? description.trim().split('\n') : description.trim();
      } else {
        iterableError = {
          ...description,
          message: description.message.trim().includes('\n')
            ? description.message.trim().split('\n')
            : description.message.trim(),
        };
      }
    }

    return iterableError;
  }, [description]);

  return (
    <Toast
      delay={duration}
      autohide={hide}
      onClose={handleClose}
      onMouseEnter={handleMouseHover}
      onMouseLeave={handleMouseLeave}
    >
      <Card className={clsx(`border-0 border-start border-4 border-${type} shadow`)}>
        <Card.Body>
          <div className="css-laiely" role="alert">
            <div className={clsx(`css-1l54tgj text-${type}`)}>
              {type === 'success' && <SuccessIcon />}
              {type === 'info' && <InfoIcon />}
              {type === 'warning' && <WarningIcon />}
              {type === 'danger' && <DangerIcon />}
            </div>
            <div className="css-1xsto0d">
              <div className={clsx(`fw-bold css-1jvvlz4 text-${type}`)}>
                {errorDetails.response ? (
                  <Stack direction="horizontal" className="align-items-center mb-2" gap={1}>
                    <p className="fw-bold m-0">{errorDetails.response}</p>
                    {errorDetails.code && (
                      <span className="text-primary text-opacity-75 py-1 small fw-normal mx-1 px-3 badge rounded-pill bg-grayish">
                        Status Code: {errorDetails.code}
                      </span>
                    )}
                  </Stack>
                ) : (
                  title
                )}
              </div>
              {errorDetails.message &&
                (typeof errorDetails.message === 'string' ? (
                  <p className="t-description mb-0">{errorDetails.message}</p>
                ) : (
                  <ul className="t-description mb-0">
                    {errorDetails.message.map((msg, ix) => (
                      <li key={ix}>
                        {msg.includes(':') && msg.split(':', 2).length === 2 ? (
                          <Stack direction="horizontal" gap={1}>
                            <span className="fw-medium text-capitalize">{msg.split(':', 2)[0]}</span>
                            <span>{msg.split(':', 2)[1].trim()}</span>
                          </Stack>
                        ) : (
                          msg
                        )}
                      </li>
                    ))}
                  </ul>
                ))}
            </div>
            <div className="css-1mzcepu">
              <CloseButton onClick={handleClose} className={'css-q28n79'} />
            </div>
          </div>
        </Card.Body>
      </Card>
    </Toast>
  );
};

const InfoIcon = ({ size = '22' }: IIcons) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="css-1cw4hi4"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
    </svg>
  );
};

const SuccessIcon = ({ size = '22' }: IIcons) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="css-1cw4hi4"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
    </svg>
  );
};

const WarningIcon = ({ size = '22' }: IIcons) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="css-1cw4hi4"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
    </svg>
  );
};

const DangerIcon = ({ size = '22' }: IIcons) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="css-1cw4hi4"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708z" />
    </svg>
  );
};

const shouldRerender = (prevProps: Readonly<IToastProps>, nextProps: Readonly<IToastProps>) => {
  return prevProps.id === nextProps.id;
};

export default memo(ToastExtended, shouldRerender);
