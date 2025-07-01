import { useState } from 'react';
import { Card, Col, Image, Row } from 'react-bootstrap';

import { clsx } from 'clsx';

import { FileIcon } from 'core-ui/icons';

import { humanFileSize } from 'utils/functions';

import { IFilePreview } from 'interfaces/IAttachments';

const FilePreview = ({ name, size, iconSize, className, preview, bg = 'light', fileType, onClick }: IFilePreview) => {
  const [previewError, handleError] = useState(false);
  const truncateText =
    name.length > 15
      ? name.substring(0, 15 / 2 - 1) + '...' + name.substring(name.length - 15 / 2 + 2, name.length)
      : name;

  return (
    <Card className="border-0">
      <div
        className={clsx(
          'small fw-medium text-info shadow-sm border-0',
          { 'bg-light': bg === 'light' },
          { 'card-header p-0': bg === 'secondary' }
        )}
      >
        {preview && !previewError && (
          <Image
            src={preview}
            className="w-100 pb-0"
            onError={() => handleError(true)}
            style={{ height: 80, objectFit: 'cover' }}
          />
        )}
        <Row className="g-0">
          {(!preview || previewError) && (
            <Col xs={12} className="px-3 pt-3">
              <FileIcon size={iconSize} />
            </Col>
          )}
          <Col xs={12} className="px-3 pt-1 pb-2">
            <p
              className={clsx('mb-0 text-wrap', { 'link link-info cursor-pointer': Boolean(onClick) }, className)}
              onClick={onClick}
            >{`${truncateText}.${fileType}`}</p>
            {size && <p className="text-muted m-0">{humanFileSize(size)}</p>}
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default FilePreview;
