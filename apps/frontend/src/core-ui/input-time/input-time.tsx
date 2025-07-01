import {
  FocusEventHandler,
  ReactNode,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Form, Stack } from 'react-bootstrap';
import { Typeahead, TypeaheadRef } from 'react-bootstrap-typeahead';
import { Option, TypeaheadProps } from 'react-bootstrap-typeahead/types/types';

import { clsx } from 'clsx';
import { FormikErrors } from 'formik';

import './input-time.styles.css';

interface IProps {
  classNames?: {
    labelClass?: string;
    wrapperClass?: string;
    inputClass?: string;
  };
  name?: string;
  value?: string;
  error?: ReactNode | FormikErrors<unknown>[];
  isValid?: boolean;
  isInvalid?: boolean;
  labelText?: string | JSX.Element;
  onTimeSelection?: (time: string) => void;
  onBlurChange?: FocusEventHandler<HTMLElement> | undefined;
  disabled?: boolean;
  className?: string;
  controlId: string;
}

const pattern = /^(\d+):(\d+) (AM|PM)$/;
const hourOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(numberToOption);
const minuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(numberToOption);

declare type MeridiemType = 'AM' | 'PM';
interface ITimeObject {
  hour: string;
  minute: string;
  meridiem: MeridiemType;
}

const InputTime = ({ classNames, error, labelText, controlId, onBlurChange, onTimeSelection, ...props }: IProps) => {
  const [time, setTime] = useState<ITimeObject>(getTimePartsFromPicker(props.value));
  const updateTimeSelection = useCallback(
    (value: MeridiemType | string | null, name: keyof ITimeObject) => {
      if (value) {
        let timeString = '';
        setTime(prev => {
          const obj = { ...prev, [name]: value };
          timeString = getTimeStringFromPicker(obj);
          return obj;
        });

        if (timeString && timeString.match(pattern)) {
          if (onTimeSelection) onTimeSelection(timeString);
        }
      }
    },
    [onTimeSelection]
  );

  return (
    <Form.Group className={classNames?.wrapperClass} controlId={controlId}>
      {labelText && <Form.Label className={clsx(`text-primary`, classNames?.labelClass)}>{labelText}</Form.Label>}

      <Form.Control
        {...props}
        type="hidden"
        className={clsx(`d-none text-uppercase position-relative w-100 text-transparent`, props.className)}
        value={getTimeStringFromPicker(time)}
      />

      <Stack
        direction="horizontal"
        onBlur={event => {
          if (onBlurChange && !event.currentTarget.contains(event.relatedTarget)) {
            onBlurChange(event);
          }
        }}
        gap={1}
        tabIndex={-1}
        className={clsx(
          props.className,
          'text-capitalize',
          'form-control time_picker_focus position-relative',
          { 'is-valid': props.isValid && !props.disabled },
          { 'is-invalid': props.isInvalid && !props.disabled }
        )}
      >
        <TimePickerDropdown
          id={`hour-${props.name}`}
          name={`hour-${props.name}-input`}
          options={hourOptions}
          onSelect={value => updateTimeSelection(value as string, 'hour')}
          value={time.hour}
        />
        <span>:</span>
        <TimePickerDropdown
          id={`minute-${props.name}`}
          name={`minute-${props.name}-input`}
          options={minuteOptions}
          onSelect={value => updateTimeSelection(value as string, 'minute')}
          value={time.minute}
        />
        <TimePickerDropdown
          options={['AM', 'PM']}
          id={`meridiem-${props.name}`}
          name={`meridiem-${props.name}-input`}
          onSelect={value => updateTimeSelection(value as string, 'meridiem')}
          value={time.meridiem}
          readOnly
        />
      </Stack>
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

export default InputTime;

interface IPickerProps extends Partial<TypeaheadProps> {
  id: string;
  name: string;
  value?: MeridiemType | string;
  onSelect?: (value: string) => void;
  readOnly?: boolean;
  disabled?: boolean;
  options: string[];
}

const TimePickerDropdown = ({ id, value, options, name, disabled, readOnly, onSelect, onBlur }: IPickerProps) => {
  const timePickerRef = useRef<TypeaheadRef | null>(null);
  const [selected, setSelection] = useState<string[]>(() => handleInitialValue(options, value));
  const handleSelection = (selected: Option[]) => {
    if (selected.length > 0) {
      if (onSelect && options.length > 0) {
        onSelect(selected[0] as string);
      }
    }
    setSelection(selected as string[]);
  };

  const handleBlurState: FocusEventHandler<HTMLInputElement> = ev => {
    if (!selected || selected.length <= 0) {
      setSelection(() => handleInitialValue(options, value));
      timePickerRef.current?.clear();
    }

    if (onBlur) onBlur(ev);
  };

  useLayoutEffect(() => {
    const current = timePickerRef.current;
    if (current && current.inputNode) {
      const inputHint = current.inputNode.nextElementSibling;
      if (inputHint) inputHint.setAttribute('name', `Typeahead_${id}_HintInput`);
    }
  }, [id]);

  useEffect(() => {
    setSelection(() => handleInitialValue(options, value));
  }, [options, value]);

  return (
    <Typeahead
      flip
      placeholder="--"
      ref={timePickerRef}
      highlightOnlyResult
      id={`dropdown-${id}`}
      onChange={handleSelection}
      onBlur={handleBlurState}
      options={options}
      disabled={disabled}
      className="no-dropdown-arrow border-0 time-picker"
      inputProps={{
        name,
        style: { width: 25 },
        className: 'p-0 text-center text-uppercase shadow-none border-0',
        id: `input-${id}`,
        pattern: '[0-9]',
        maxLength: 2,
        readOnly,
        disabled,
      }}
      emptyLabel=""
      filterBy={(option, { text, selected }) => {
        if (selected.length) return true;
        return option.toLowerCase().indexOf(text.toLowerCase()) !== -1;
      }}
      renderMenuItemChildren={option => {
        const isActive = selected.length > 0 && option.toLowerCase() === selected[0].toLowerCase();
        return <span className={clsx({ active: isActive })}>{option as string}</span>;
      }}
      onFocus={event => (event.target as HTMLInputElement).select()}
      selected={selected}
      size="sm"
    />
  );
};

function getTimePartsFromPicker(value?: string): ITimeObject {
  if (value) {
    const inputValue = value.match(pattern);
    if (inputValue) {
      const [hour, minute, meridiem] = Array.from(inputValue).splice(1);
      return {
        hour,
        minute,
        meridiem: meridiem as MeridiemType,
      };
    }
  }

  return { hour: '-', minute: '-', meridiem: 'AM' };
}

function getTimeStringFromPicker({ hour, minute, meridiem }: ITimeObject) {
  return `${hour}:${minute} ${meridiem}`;
}

function numberToOption(number: number) {
  const padded = number.toString().padStart(2, '0');
  return padded;
}

const handleInitialValue = (options: string[], initValue = '', defaultValue = '') => {
  if (!initValue && defaultValue) initValue = defaultValue.toString();
  const selection = options.find(opt => opt.toString() === initValue);
  if (selection) return [selection];
  return [];
};
