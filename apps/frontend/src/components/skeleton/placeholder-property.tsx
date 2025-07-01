import { CSSProperties, ReactNode } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import { clsx } from 'clsx';

import SingleSkeleton, { DescriptionSkeleton, ImageSkeleton, InlineSkeleton } from './skeleton';

interface IProps {
  inverse?: boolean;
  description?: boolean;
}

const SkeletonProperty = ({ inverse, description }: IProps) => {
  return (
    <Card className={clsx('bg-transparent border-0 my-1', { 'flex-column-reverse': inverse })}>
      <Card.Body>
        <SingleSkeleton xs={6} />
        <SingleSkeleton xs={4} />
        {description && <DescriptionSkeleton />}
      </Card.Body>
      <ImageSkeleton as={Card.Header} />
    </Card>
  );
};

interface IInlineProps extends IProps {
  className?: string;
  cardBodyClass?: string;
  aspect?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
}

export const SkeletonInlineProperty = ({
  inverse,
  description,
  children,
  aspect = true,
  cardBodyClass,
  className,
  style,
}: IInlineProps) => {
  return (
    <Card className={clsx('bg-transparent border-0 my-1', { 'flex-row-reverse': inverse, 'flex-row': !inverse })}>
      <Card.Body className={cardBodyClass}>
        <Row className="gx-2 gy-1">
          <Col md={aspect ? 3 : 'auto'} xs={aspect ? 12 : undefined}>
            <InlineSkeleton className={clsx({ 'ratio ratio-1x1': aspect }, className)} style={style} />
          </Col>
          <Col>
            <SingleSkeleton xs={6} />
            <SingleSkeleton xs={4} />
            {description && (
              <div className="mt-2 mb-3">
                <DescriptionSkeleton />
              </div>
            )}
            {children && <div className="my-2">{children}</div>}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SkeletonProperty;
