import { FocusEventHandler, ReactNode } from 'react';
import { TypeaheadComponentProps, UseAsyncProps } from 'react-bootstrap-typeahead';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { FormikErrors } from 'formik';

import { ISelectOption } from 'interfaces/IInputs';

interface CommonAsyncTypeaheadProps {
  labelText?: string | JSX.Element;
  onBlurChange?: FocusEventHandler<HTMLInputElement> | undefined;
  controlId: string;
  overflow?: boolean;
  classNames?: {
    labelClass?: string;
    wrapperClass?: string;
    backgroundClass?: string;
    menuItemClassName?: string;
    selectClass?: string;
  };
  name: string;
  error?: ReactNode | FormikErrors<unknown>[];
  searchIcon?: boolean;
}

declare type SelectProps = Omit<TypeaheadComponentProps, 'positionFixed' | 'minLength' | 'isLoading' | 'flip'>;
export interface SimpleSelectProps extends CommonAsyncTypeaheadProps, SelectProps {
  onSelectChange?: (selected: string) => void;
  options: Array<ISelectOption>;
  searchable?: boolean;
  value?: string | number;
  defaultValue?: string | number;
}

declare type AsyncFilterListProps = Omit<
  UseAsyncProps,
  'positionFixed' | 'minLength' | 'isLoading' | 'flip' | 'onChange' | 'onBlur'
>;
export interface FilterListProps extends CommonAsyncTypeaheadProps, AsyncFilterListProps {
  isFetching?: boolean;
  labelText?: string | JSX.Element;
  controlId: string;
  onSelectChange?: (selected: Option[]) => void;
  onBlurChange?: FocusEventHandler<HTMLInputElement> | undefined;
  options: Array<Option>;
}
