import { MouseEventHandler, Ref, SyntheticEvent, forwardRef, useMemo } from 'react';
import { Button, FormControl, FormControlProps, FormSelect, Stack } from 'react-bootstrap';
import DatePicker, { ReactDatePickerCustomHeaderProps } from 'react-datepicker';

import { clsx } from 'clsx';

import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'core-ui/icons';

import { IDateContainer } from './date';

import 'react-datepicker/dist/react-datepicker.css';

import './input-date.styles.css';

interface CustomInputProps extends Partial<FormControlProps> {
  onClick?: MouseEventHandler<HTMLElement>;
}

const ExampleCustomInput = forwardRef(
  ({ value, onClick, onChange, ...rest }: CustomInputProps, ref: Ref<HTMLInputElement>) => (
    <div className="position-relative">
      <FormControl
        {...rest}
        value={value}
        autoComplete="off"
        className="example-custom-input"
        style={{ ...rest.style, paddingRight: 30 }}
        onClick={onClick}
        onChange={onChange}
        ref={ref}
      />
      <Button
        size="sm"
        tabIndex={-1}
        variant="link"
        onClick={onClick}
        disabled={rest.disabled || rest.readOnly}
        className="p-1 position-absolute mx-2 d-inline-flex align-items-center justify-content-center end-0 top-50 translate-middle-y"
      >
        <CalendarIcon size="18px" />
      </Button>
    </div>
  )
);
ExampleCustomInput.displayName = 'ExampleCustomInput';
const DateWrapper = (props: IDateContainer) => {
  const {
    portalId = 'datepicker-portal',
    controlId,
    onDateSelection,
    enableRangeSelection,
    isInvalid,
    isValid,
    ...rest
  } = props;

  const pickerProps = useMemo(() => {
    return {
      portalId,
      todayButton: 'Today',
      showPopperArrow: false,
      customInput: <ExampleCustomInput isInvalid={isInvalid} isValid={isValid} />,
      popperClassName: 'datepicker-popup-zIndex',
      className: clsx('form-control', { 'is-invalid': isInvalid, 'is-valid': isValid }),
      renderCustomHeader: (props: ReactDatePickerCustomHeaderProps) => <CustomizeHeader {...props} id={controlId} />,
    };
  }, [controlId, isInvalid, portalId, isValid]);

  if (enableRangeSelection) {
    return (
      <DatePicker
        {...rest}
        {...pickerProps}
        selectsMultiple={undefined}
        selectsRange={enableRangeSelection}
        onChange={(date, ev) => {
          if (onDateSelection) onDateSelection(date, ev);
        }}
      />
    );
  }

  return (
    <DatePicker
      {...rest}
      {...pickerProps}
      selectsRange={undefined}
      selectsMultiple={undefined}
      onChange={(date, ev) => {
        if (onDateSelection) onDateSelection(date, ev);
      }}
    />
  );
};

export default DateWrapper;

const years = (() => {
  const curr = new Date().getFullYear();
  const max = curr + 100;
  const min = curr - 100;
  return Array.from({ length: (max - min) / 1 + 1 }, (v, i) => min + 1 * i);
})();

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface ICustomizeHeaderProps extends ReactDatePickerCustomHeaderProps {
  id: string;
}

const CustomizeHeader = ({
  id,
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: ICustomizeHeaderProps) => (
  <Stack direction="horizontal" gap={1} className="justify-content-between m-1">
    <Button
      size="sm"
      variant="light"
      className="btn-next-prev d-inline-flex align-items-center justify-content-center"
      onClick={decreaseMonth}
      disabled={prevMonthButtonDisabled}
    >
      <ChevronLeftIcon size="11" />
    </Button>

    <DateFilterDropdown
      options={years}
      idx={`${id}-year`}
      onSelect={key => key && changeYear(Number(key))}
      value={date.getFullYear().toString()}
    />

    <DateFilterDropdown
      options={months}
      idx={`${id}-month`}
      onSelect={key => key && changeMonth(months.indexOf(key))}
      value={months[date.getMonth()]}
    />

    <Button
      size="sm"
      variant="light"
      className="btn-next-prev d-inline-flex align-items-center justify-content-center"
      onClick={increaseMonth}
      disabled={nextMonthButtonDisabled}
    >
      <ChevronRightIcon size="11" />
    </Button>
  </Stack>
);

interface IDateFilterDropdownProps {
  onSelect: (eventKey: string | null, e: SyntheticEvent<unknown>) => void;
  options: string[] | number[];
  value: string;
  idx: string;
}

const DateFilterDropdown = ({ onSelect, options, value, idx }: IDateFilterDropdownProps) => {
  return (
    <FormSelect
      size="sm"
      id={`dropdown-button-drop-${idx}`}
      onChange={ev => onSelect(ev.target.value, ev)}
      className="bg-transparent"
      style={{ fontSize: 'smaller', width: 'fit-content' }}
      value={value}
    >
      {options.map(option => (
        <option key={option} value={option} data-option={option} style={{ fontSize: 'small' }}>
          {option}
        </option>
      ))}
    </FormSelect>
  );
};
