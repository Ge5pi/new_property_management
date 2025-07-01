import { isValidElement, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-bootstrap';

import { clsx } from 'clsx';

import { displayDate, getDate, isValidDate } from 'utils/functions';

import { DateChange, ISingleDateInput } from './date';
import DateWrapper from './date-wrapper';

const InputDate = (props: ISingleDateInput) => {
  const {
    resetDate,
    onDateSelection,
    controlId,
    placeholder = 'MM/DD/YYYY',
    labelText,
    error,
    value,
    minDate,
    maxDate,
    classNames = { labelClass: '', wrapperClass: '' },
    ...rest
  } = props;

  const [startDate, setStartDate] = useState<DateChange>(initValue(value));
  const onChangeEvent = (date: DateChange) => {
    const d = displayDate(date, 'YYYY-MM-DD');
    if (onDateSelection) {
      onDateSelection(d === '-' ? '' : d);
    }
    setStartDate(date);
  };

  useEffect(() => {
    if (resetDate) {
      setStartDate(initValue());
    }
  }, [resetDate]);

  const validMinDate = useMemo(() => {
    if (!isValidDate(minDate)) return undefined;
    return minDate;
  }, [minDate]);

  const validMaxDate = useMemo(() => {
    if (!isValidDate(maxDate)) return undefined;
    return maxDate;
  }, [maxDate]);

  return (
    <Form.Group className={classNames.wrapperClass} controlId={controlId}>
      {labelText && <Form.Label className={clsx('text-primary', classNames.labelClass)}>{labelText}</Form.Label>}
      <DateWrapper
        {...rest}
        controlId={controlId}
        minDate={validMinDate}
        maxDate={validMaxDate}
        placeholderText={placeholder}
        dateFormat="MM/dd/YYYY"
        onDateSelection={date => onChangeEvent(date as DateChange)}
        selected={startDate}
      />
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

const initValue = (value?: string | number | string[]) => {
  const date = value && getDate(value.toString());
  if (!date || date === '-') return null;
  return new Date(value.toString());
};

export default InputDate;
