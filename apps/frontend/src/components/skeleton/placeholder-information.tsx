import { ReactNode } from 'react';
import { Col, ColProps, Placeholder, Row, Stack } from 'react-bootstrap';
import { PlaceholderSize } from 'react-bootstrap/esm/usePlaceholder';

import { clsx } from 'clsx';

import SingleSkeleton, { DescriptionSkeleton, InlineSkeleton } from './skeleton';

interface IProps extends Omit<ColProps, 'title'> {
  skeletonType?: 'user' | 'text-description' | 'column';
  lines?: 'multiple' | 'single';
  size?: PlaceholderSize;
  columnCount?: number;
  title?: boolean;
  children?: ReactNode;
  className?: string;
}

const SkeletonInformation = ({
  title,
  size,
  skeletonType = 'text-description',
  lines = 'multiple',
  columnCount = 1,
  className,
  children,
  ...col
}: IProps) => {
  switch (skeletonType) {
    case 'user':
      return (
        <Placeholder size={size} as="div" animation="wave">
          {title && <SingleSkeleton xs={6} className="mb-2" />}
          <Stack direction="horizontal" gap={2} className="align-items-center">
            <InlineSkeleton className="rounded-circle" style={{ width: 32, height: 32 }} />
            <InlineSkeleton xs={6} />
          </Stack>
        </Placeholder>
      );
    case 'column':
      return (
        <Row className={clsx('g-2', className)}>
          {title && (
            <Col xs={12}>
              <SingleSkeleton xs={6} className="mb-2" />
            </Col>
          )}
          {Array(columnCount)
            .fill(0)
            .map((_, i) => (
              <Col key={i} {...col}>
                {children}
              </Col>
            ))}
        </Row>
      );
    default:
      return (
        <Placeholder size={size} as="div" animation="wave">
          <SingleSkeleton xs={6} className="mb-2" />
          <DescriptionSkeleton single={lines === 'single'} />
        </Placeholder>
      );
  }
};

export default SkeletonInformation;
