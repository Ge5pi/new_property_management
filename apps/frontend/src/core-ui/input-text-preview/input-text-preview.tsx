import { ReactElement, useState } from 'react';

import { clsx } from 'clsx';

interface IProps {
  field: ReactElement;
  value?: string | number;
  fieldName: string;
}

const InputWithTextPreview = ({ field, fieldName, value }: IProps) => {
  const [fieldTouched, setTouchedStatus] = useState<Record<string, boolean>>();

  const element = document.querySelector(`input[name="${fieldName}"]`) as null | HTMLInputElement;
  const isActive = document.activeElement === element || !value || (value && fieldTouched && fieldTouched[fieldName]);

  return (
    <div
      className={clsx({ 'text-start w-100 fw-normal text-primary btn btn-light': !isActive })}
      onClick={() => {
        setTouchedStatus({ [fieldName]: true });
        const timer = setTimeout(() => {
          if (element) element.focus();
          clearTimeout(timer);
        }, 0);
      }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setTouchedStatus({ [fieldName]: false });
        }
      }}
    >
      <div className={clsx({ 'd-none': !isActive })}>{field}</div>
      <div className={clsx({ 'd-none': isActive })}>{value}</div>
    </div>
  );
};

export default InputWithTextPreview;
