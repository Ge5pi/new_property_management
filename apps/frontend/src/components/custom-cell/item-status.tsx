import { ProgressBar, Stack } from 'react-bootstrap';

import { clsx } from 'clsx';

import { DotIcon } from 'core-ui/icons';

import { IIcons } from 'interfaces/IIcons';

interface IStatus {
  value?: {
    status: string;
    className: Record<string, string>;
    wrapperClassName?: string;
    textClassName?: string;
    iconPosition?: 'start' | 'end';
    Icon?: (props: IIcons) => JSX.Element;
    statusFor?: 'table' | 'page';
    valueType?: 'default' | 'progress';
    displayValue: string | number;
  };
}

const ItemStatus = ({ value }: IStatus) => {
  if (!value || typeof value !== 'object') return <span>-</span>;
  const {
    Icon = DotIcon,
    className,
    displayValue,
    iconPosition = 'start',
    status,
    statusFor = 'table',
    wrapperClassName,
    textClassName,
    valueType = 'default',
  } = value;

  if (valueType === 'progress' && typeof displayValue === 'number') {
    return (
      <div className={clsx('d-inline-block', { 'cell-font-size': statusFor === 'table' }, wrapperClassName)}>
        {status}
        <ProgressBar now={Number(displayValue)} variant="success" />
      </div>
    );
  }

  return (
    <Stack
      direction="horizontal"
      className={clsx(
        { 'cell-font-size align-items-center justify-content-md-start justify-content-end': statusFor === 'table' },
        { 'flex-row-reverse': iconPosition === 'end' },
        wrapperClassName,
        className[status]
      )}
      gap={2}
    >
      <Icon />
      <span className={clsx('text-capitalize fw-medium', textClassName)}>{displayValue}</span>
    </Stack>
  );
};

export default ItemStatus;
