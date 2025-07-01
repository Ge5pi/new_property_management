import { CSSProperties, Fragment } from 'react';
import { Button, OverlayTrigger, Popover, Stack } from 'react-bootstrap';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

import { clsx } from 'clsx';

import { PaperClipIcon } from 'core-ui/icons';

import { humanFileSize } from 'utils/functions';

import './dropzone.styles.css';

interface IProps extends DropzoneOptions {
  styles?: CSSProperties;
  variant?: 'primary' | 'secondary';
  className?: string;
  name?: string;
}

const Dropzone = ({ styles, onDrop, onError, className, variant = 'primary', name = '', accept, ...props }: IProps) => {
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    ...props,
    accept,
    noClick: true,
    noKeyboard: true,
    onDrop: (accepted, rejection, ev) => {
      if (rejection.length && onError) {
        rejection.forEach(file => {
          file.errors.forEach(error => {
            if (error.code === 'file-too-large') {
              const size = error.message.replace(/[^0-9]/g, '');
              onError({ message: `file is larger than: ${humanFileSize(Number(size))}`, name: error.code });
            } else {
              onError({ message: error.message, name: error.code });
            }
          });
        });
      }
      if (onDrop) onDrop(accepted, rejection, ev);
    },
  });

  return (
    <div
      {...getRootProps({
        style: styles,
        id: `dropzone-${name}`,
        className: clsx(className, variant === 'primary' ? 'dropzone' : ''),
      })}
    >
      <input className="input-zone" {...getInputProps({ disabled: props.disabled })} />
      <div className="text-center text-primary w-100">
        {isDragActive ? (
          <p className="dropzone-content m-0">Release to drop the files here</p>
        ) : (
          <div className="text-center">
            <Stack
              gap={1}
              direction="horizontal"
              className={clsx('dropzone-content flex-wrap', {
                'align-items-center justify-content-center': variant === 'primary',
              })}
            >
              <div>
                <Stack direction="horizontal" gap={1}>
                  <PaperClipIcon size={'18'} />
                  <div className="text-primary">Drag and drop file</div>
                </Stack>
              </div>
              <span className="text-muted">or</span>
              <Button size="sm" variant="link" className="link-primary p-0" onClick={open} disabled={props.disabled}>
                Browse
              </Button>
            </Stack>
            {accept && variant !== 'secondary' && (
              <div className="accepted-formats mt-2">
                {props.maxSize && (
                  <p className="lh-1 mb-0 small text-muted">Maximum File Size: {humanFileSize(props.maxSize)} </p>
                )}
                <OverlayTrigger
                  overlay={overlayProps => (
                    <Popover {...overlayProps} id={`viewAcceptedFormats-${name}-popover`}>
                      <Popover.Header as="h6">Accepted Formats</Popover.Header>
                      <Popover.Body>
                        <Stack
                          direction="horizontal"
                          gap={1}
                          className="flex-wrap align-items-center justify-content-center"
                        >
                          {Object.values(accept).map((value, indx) => (
                            <Fragment key={indx}>
                              {value.map((type, inx) => (
                                <span className="small" key={inx}>
                                  {type.toUpperCase()} {value.length < indx && ', '}
                                </span>
                              ))}
                            </Fragment>
                          ))}
                        </Stack>
                      </Popover.Body>
                    </Popover>
                  )}
                >
                  <Button size="sm" variant="link" className="p-0 text-decoration-none fw-bold text-muted x-small">
                    Accepted Formats
                  </Button>
                </OverlayTrigger>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropzone;
