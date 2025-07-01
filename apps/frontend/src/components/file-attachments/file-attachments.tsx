import { Button, Col, ProgressBar, Row } from 'react-bootstrap';

import { clsx } from 'clsx';

import { FileIcon, TrashIcon } from 'core-ui/icons';

import { humanFileSize } from 'utils/functions';

import { IFileAttachment } from 'interfaces/IAttachments';

const smartTrim = (value: string, maxLength: number) => {
  if (!value) return value;
  if (maxLength < 1) return value;
  if (value.length <= maxLength) return value;
  if (maxLength === 1) return value.substring(0, 1) + '...';

  const midpoint = Math.ceil(value.length / 2);
  const textToRemove = value.length - maxLength;
  const leftStrip = Math.ceil(textToRemove / 2);
  const rightStrip = textToRemove - leftStrip;
  return value.substring(0, midpoint - leftStrip) + '...' + value.substring(midpoint + rightStrip);
};

const FileAttachments = ({ onRemove, file, progress, children, minified, backgroundClass }: IFileAttachment) => {
  const truncateText = smartTrim(file.name, 12);

  if (minified) {
    return (
      <Row className={clsx('border-bottom g-0 py-1 align-items-center', backgroundClass)}>
        <Col xs={'auto'}>
          <FileIcon color="#3360D4" size="18" />
        </Col>
        <Col>
          <span title={file.name} className="small mx-1">
            {truncateText}
          </span>
        </Col>
        {!progress || Number(progress) < 0 ? (
          <Col xs={'auto'}>
            {onRemove && (
              <Button
                size="sm"
                variant="outline-danger"
                className="remove-file border-0 bg-transparent"
                onClick={onRemove}
              >
                <TrashIcon />
              </Button>
            )}
          </Col>
        ) : (
          <Col xs={12}>
            <ProgressBar variant="info" now={Number(progress)} />
          </Col>
        )}
      </Row>
    );
  }
  return (
    <div className="my-3 ms-lg-1 ms-md-0 ms-sm-1 ms-0 bg-light p-3 small">
      <p className="fw-medium text-info mb-0 text-wrap">{truncateText}</p>
      <Row className="g-0">
        <Col>
          {'size' in file ? (
            <p className="text-muted">{humanFileSize(file.size)}</p>
          ) : (
            <p className="text-muted">{file.file_type}</p>
          )}
        </Col>
        {!progress || Number(progress) < 0 ? (
          <Col xs={'auto'}>
            {onRemove && (
              <Button
                size="sm"
                variant="outline-danger"
                className="remove-file border-0 bg-transparent"
                onClick={onRemove}
              >
                <TrashIcon />
              </Button>
            )}
          </Col>
        ) : (
          <Col xs={12}>
            <ProgressBar variant="info" now={Number(progress)} />
          </Col>
        )}
      </Row>
      {children}
    </div>
  );
};

export default FileAttachments;
