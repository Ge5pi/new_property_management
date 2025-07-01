import { ReactNode } from 'react';
import { Col, Row } from 'react-bootstrap';

import clsx from 'clsx';

import { LazyImage } from 'core-ui/lazy-image';

interface IName {
  image?: string | undefined;
  title: string | ReactNode;
  subtitle: string | ReactNode;
}

interface IProps {
  value?: IName;
  preview?: boolean;
  isThisFor?: 'table' | 'page';
}

const ItemName = ({ value, preview = false, isThisFor = 'table' }: IProps) => {
  if (!value) return <span>-</span>;

  return (
    <Row
      className={clsx('align-items-start justify-content-start my-1 gx-2', {
        'custom-item-cell': isThisFor === 'table',
      })}
    >
      {value.image && (
        <Col xs="auto">
          <LazyImage src={value.image} border size="sm" preview={preview} />
        </Col>
      )}
      {
        <Col>
          <div className="item-content text-start">
            <p className="fw-bold m-0 cell-font-size" style={{ lineHeight: 1.25 }}>
              {value.title}
            </p>
            <p className="text-capitalize small text-muted m-0" style={{ lineHeight: 1.25 }}>
              {value.subtitle}
            </p>
          </div>
        </Col>
      }
    </Row>
  );
};

export default ItemName;
