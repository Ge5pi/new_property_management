import { CSSProperties, InputHTMLAttributes, ReactNode, isValidElement } from 'react';
import { Form, FormControlProps, InputGroup } from 'react-bootstrap';

import { clsx } from 'clsx';
import { FormikErrors } from 'formik';

declare type IType = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & FormControlProps;
interface IProps extends IType {
  icon: ReactNode | string;
  position: 'start' | 'end';
  wrapperStyle?: CSSProperties;
  wrapperClass?: string;
  labelClass?: string;
  error?: ReactNode | FormikErrors<unknown>[];
  size?: 'sm' | 'lg';
  label?: string;
  controlId?: string;
}

const GroupedField = ({
  icon,
  position,
  wrapperStyle,
  error,
  label = '',
  wrapperClass = 'mb-3',
  labelClass = 'popup-form-labels',
  controlId = '',
  ...props
}: IProps) => {
  const InputIcon = (
    <InputGroup.Text
      className={clsx(
        'text-primary position-absolute bg-transparent border-0 top-50 translate-middle-y',
        `${position}-0`,
        { 'input-with-icon-size-sm': props.size === 'sm' }
      )}
    >
      {icon}
    </InputGroup.Text>
  );

  return (
    <Form.Group className={wrapperClass} controlId={controlId}>
      {label && <Form.Label className={labelClass}>{label}</Form.Label>}
      <InputGroup style={wrapperStyle} className={clsx('input-with-icon position-relative', `input-icon-${position}`)}>
        {position === 'start' && InputIcon}
        <Form.Control {...props} />
        {position === 'end' && InputIcon}
      </InputGroup>
      {error &&
        (isValidElement(error) ? (
          error
        ) : (
          <Form.Control.Feedback type="invalid" className={clsx({ 'd-block': props.isInvalid && error })}>
            {Array.isArray(error) ? error.join(' \u2022 ') : error.toString()}
          </Form.Control.Feedback>
        ))}
    </Form.Group>
  );
};

export default GroupedField;
