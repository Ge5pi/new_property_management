import { isValidElement, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

import { clsx } from 'clsx';

import { displayDate, getDate } from 'utils/functions';

import { DateRangeChange, IRangeDateInput } from './date';
import DateWrapper from './date-wrapper';

const DateRangeInput = (props: IRangeDateInput) => {
  const {
    onDateRangeSelection,
    controlId,
    resetDate,
    placeholder = 'MM/DD/YYYY - MM/DD/YYYY',
    labelText,
    error,
    classNames = { labelClass: '', wrapperClass: '' },
    startDateValue,
    endDateValue,
    ...rest
  } = props;

  const [dateRange, setDateRange] = useState([initValue(startDateValue), initValue(endDateValue)]);
  const [startDate, endDate] = dateRange;

  const onChangeEvent = (date: DateRangeChange) => {
    const start = displayDate(date[0], 'YYYY-MM-DD');
    const end = displayDate(date[1], 'YYYY-MM-DD');

    const dateSelected = start !== '-' && end !== '-';
    if (onDateRangeSelection) {
      if (dateSelected) onDateRangeSelection(start, end);
      else onDateRangeSelection('', '');
    }

    setDateRange(date);
  };

  useEffect(() => {
    if (resetDate) {
      setDateRange([initValue(), initValue()]);
    }
  }, [resetDate]);

  return (
    <Form.Group className={classNames?.wrapperClass} controlId={controlId}>
      {labelText && <Form.Label className={clsx('text-primary', classNames?.labelClass)}>{labelText}</Form.Label>}
      <DateWrapper
        {...rest}
        controlId={controlId}
        placeholderText={placeholder}
        enableRangeSelection
        selected={startDate}
        dateFormat="MM/dd/YYYY"
        onDateSelection={date => onChangeEvent(date as DateRangeChange)}
        endDate={!endDate ? undefined : endDate}
        startDate={!startDate ? undefined : startDate}
        showTwoColumnMonthYearPicker
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

export default DateRangeInput;
