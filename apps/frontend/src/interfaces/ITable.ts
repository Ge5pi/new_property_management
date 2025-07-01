import { ReactNode } from 'react';
import { Column, Row } from 'react-table';

export enum ColumnSortOrder {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

export interface IColumns {
  label: string;
  accessor: string;
  sortable?: boolean;
  sortbyOrder?: ColumnSortOrder;
}

export interface ITable {
  total?: number;
  columns: ReadonlyArray<Column<object>>;
  data: readonly object[];
  onRowClick?: (row: Row<object>) => void;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  enableMobileMode?: boolean;
  showTotal?: boolean;
  shadow?: boolean;
  wrapperClass?: string;
  className?: string;
  pagination?: ReactNode;
  clickable?: boolean;
  customHeader?: ReactNode;
}
