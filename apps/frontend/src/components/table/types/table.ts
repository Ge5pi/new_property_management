import { MouseEventHandler, ReactNode } from 'react';
import {
  Column,
  HeaderGroup,
  Row as ReactTableRow,
  TableBodyPropGetter,
  TableBodyProps,
  TablePropGetter,
  TableProps,
} from 'react-table';

import { useQueryWithPagination } from 'services/api/types/rtk-query';

import { IFilterOptions } from 'interfaces/IGeneral';

export interface ICommonHeaderProps {
  pageHeader?: ReactNode;
  handleCreateNewRecord?: MouseEventHandler<HTMLButtonElement> | undefined;
  newRecordButtonPermission?: string;
  newRecordButtonText?: string;
  setSearchState?: (value: string) => void;
  additionalActionButtons?: ReactNode;
  showTotal?: boolean;
  filterMenu?: ReactNode;
  total?: number;
}

export interface ICommonTableProps extends ICommonHeaderProps {
  onRowClick?: (row: ReactTableRow<object>) => void;
  enableMobileMode?: boolean;
  shadow?: boolean;
  clickable?: boolean;
  customHeader?: ReactNode;
  showHeaderInsideContainer?: boolean;
  hideMainHeaderComponent?: boolean;
  wrapperClass?: string;
  className?: string;
  classes?: {
    header?: string;
    body?: string;
    footer?: string;
  };
}

export interface GenericTableProps extends ICommonTableProps {
  data: ReactTableRow<object>[];
  error?: unknown;
  loading?: boolean;
  isError?: boolean;
  searchedValue?: string;
  tableProps: {
    getTableProps: (propGetter?: TablePropGetter<object> | undefined) => TableProps;
    headerGroups: HeaderGroup<object>[];
    getTableBodyProps: (propGetter?: TableBodyPropGetter<object> | undefined) => TableBodyProps;
    prepareRow: (row: ReactTableRow<object>) => void;
  };
  pagination?: ReactNode;
}

declare type ExtendedFilterValues<T> = T & IFilterOptions;
export interface IPropsWithPagination<T, F> extends ICommonTableProps {
  defaultPageSize?: number;
  columns: readonly Column<object>[];
  searchable?: boolean;
  saveValueInState?: boolean;
  filterValues?: ExtendedFilterValues<F>;
  useData: useQueryWithPagination<T, F>;
}

export interface ITableProps extends ICommonTableProps {
  error?: unknown;
  searchable?: boolean;
  columns: readonly Column<object>[];
  data: readonly object[];
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
}
