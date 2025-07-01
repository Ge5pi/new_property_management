import { MouseEventHandler, ReactNode } from 'react';
import {
  Column,
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
  newRecordButtonText?: string;
  handleCreateNewRecord?: MouseEventHandler<HTMLButtonElement> | undefined;
  newRecordButtonPermission?: string;
  setSearchState?: (value: string) => void;
  additionalActionButtons?: ReactNode;
  titleAndTotalInline?: boolean;
  showTotal?: boolean;
  filterMenu?: ReactNode;
  total?: number;
}

export interface ICommonTableProps extends ICommonHeaderProps {
  onRowClick?: (row: ReactTableRow<object>) => void;
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
    getTableBodyProps: (propGetter?: TableBodyPropGetter<object> | undefined) => TableBodyProps;
    prepareRow: (row: ReactTableRow<object>) => void;
  };
  pagination?: ReactNode;
}

export interface IPropsWithPagination<T, F extends IFilterOptions> extends ICommonTableProps {
  defaultPageSize?: number;
  columns: readonly Column<object>[];
  searchable?: boolean;
  filterValues?: F;
  saveValueInState?: boolean;
  hidePagination?: boolean;
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
