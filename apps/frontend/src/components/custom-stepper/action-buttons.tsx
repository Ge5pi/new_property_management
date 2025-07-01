import { MouseEventHandler } from 'react';
import { Button, Col, Row } from 'react-bootstrap';

import { clsx } from 'clsx';

interface IStepActions {
  prevButton?: MouseEventHandler<HTMLButtonElement>;
  nextButton?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  currentItem: number;
  totalItems: number;
  className?: string;
}

const ActionButtons = ({
  currentItem = 0,
  totalItems = 0,
  prevButton,
  nextButton,
  disabled,
  className,
}: IStepActions) => {
  return (
    <Row className={clsx('gx-0 justify-content-sm-end justify-content-center', className)}>
      {Number(currentItem) > 1 && (
        <Col xs={'auto'}>
          <Button variant="light border-primary" disabled={disabled} className="px-4 py-1 me-3" onClick={prevButton}>
            Prev
          </Button>
        </Col>
      )}
      <Col xs={'auto'}>
        <Button variant="primary" disabled={disabled} type="submit" className="px-4 py-1" onClick={nextButton}>
          {Number(currentItem) < Number(totalItems) && 'Next'}
          {Number(currentItem) === Number(totalItems) && 'Finish'}
        </Button>
      </Col>
    </Row>
  );
};

export default ActionButtons;
