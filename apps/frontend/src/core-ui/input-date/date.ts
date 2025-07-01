import { ComponentProps, ReactNode } from 'react';
import DatePickerProps from 'react-datepicker';

import { FormikErrors } from 'formik';

export declare type DateChange = Date | null;
export declare type DateRangeChange = [Date | null, Date | null];

export interface IGenericDateTypes {
  classNames?: {
    labelClass?: string;
    wrapperClass?: string;
  };
  name?: string;
  resetDate?: boolean;
  error?: ReactNode | FormikErrors<unknown>[];
  labelText?: string | JSX.Element;
  controlId: string;
  isValid?: boolean;
  isInvalid?: boolean;
  placeholder?: string;
}

type DefaultDatePickerProps = ComponentProps<typeof DatePickerProps>;
export interface ISingleDateInput extends Omit<DefaultDatePickerProps, 'selected' | 'onChange'>, IGenericDateTypes {
  value?: string;
  onDateSelection?: (date: string) => void;
}

export interface IRangeDateInput extends Omit<DefaultDatePickerProps, 'selected' | 'onChange'>, IGenericDateTypes {
  endDateValue?: string;
  onDateRangeSelection?: (start: string, end: string) => void;
  startDateValue?: string;
}

export interface IDateContainer extends Omit<DefaultDatePickerProps, 'onChange'> {
  enableRangeSelection?: true | undefined;
  onDateSelection?: (date: DateChange | DateRangeChange, event: React.SyntheticEvent<unknown> | undefined) => void;
  isInvalid?: boolean;
  isValid?: boolean;
  controlId: string;
}
