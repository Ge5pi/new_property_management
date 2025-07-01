import { Fragment, MouseEvent, ReactNode } from 'react';
import { Table as BootstrapTable } from 'react-bootstrap';
import { ColumnInstance, Row, useSortBy, useTable } from 'react-table';

import { clsx } from 'clsx';

import { LoadingDots } from 'components/loading';

import { ChevronDownIcon, ChevronUpIcon } from 'core-ui/icons';

import { getReadableError } from 'utils/functions';

import { ITable } from 'interfaces/ITable';

import './table.styles.css';

const Table = ({
  columns = [],
  data = [],
  total,
  shadow = true,
  showTotal = true,
  wrapperClass = '',
  onRowClick,
  enableMobileMode = true,
  clickable = false,
  pagination,
  customHeader,
  className = '',
  isError,
  isLoading,
  error: errorText,
}: ITable) => {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data }, useSortBy);

  const handleRowClick = (event: MouseEvent<HTMLTableRowElement>, row: Row) => {
    const target = event.target as HTMLElement;

    if (target instanceof HTMLButtonElement || target.closest('button') instanceof HTMLButtonElement) {
      event.preventDefault();
      return;
    }

    onRowClick && onRowClick(row);
  };

  // Render the UI for your table
  return (
    <div className={clsx('table-wrapper', { shadow: shadow }, { 'shadow-none': !shadow }, wrapperClass)}>
      {(showTotal || customHeader) && (
        <div className="p-3 bg-white">
          {showTotal && <h2 className="fs-6 fw-bold mb-0">Total: {total ?? data.length} </h2>}
          {customHeader && customHeader}
        </div>
      )}
      <BootstrapTable
        hover={rows.length > 0}
        responsive
        {...getTableProps({ className: clsx(`${enableMobileMode ? 'table-fit my-0' : ''}`, className) })}
      >
        <thead className="table-header sticky-top shadow-sm">
          {headerGroups.map((headerGroup, idx) => (
            <Fragment key={idx}>
              <tr {...headerGroup.getHeaderGroupProps({ className: 'bg-transparent' })}>
                {headerGroup.headers.map((column, k) => (
                  <Fragment key={k}>
                    <th
                      {...column.getHeaderProps({
                        ...column.getSortByToggleProps(),
                        style: { minWidth: column.render('width')?.toString() },
                        className: 'px-3 py-2',
                      })}
                    >
                      <span className="d-flex align-items-center">
                        <span>{column.render('Header')}</span>
                        {/* Add a sort direction indicator */}
                        {!column.disableSortBy ? (
                          <span className={'table-column-sorting-btn mx-1'}>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <ChevronDownIcon />
                              ) : (
                                <ChevronUpIcon />
                              )
                            ) : (
                              <Fragment>
                                <ChevronUpIcon />
                                <ChevronDownIcon />
                              </Fragment>
                            )}
                          </span>
                        ) : null}
                      </span>
                    </th>
                  </Fragment>
                ))}
              </tr>
            </Fragment>
          ))}
        </thead>
        <tbody {...getTableBodyProps({ className: 'table-body' })}>
          {rows.length > 0 &&
            rows.map((row, inx) => {
              prepareRow(row);
              return (
                <Fragment key={inx}>
                  <tr
                    {...row.getRowProps({ className: clsx({ 'table-row-clickable': clickable }) })}
                    onClick={ev => handleRowClick(ev, row)}
                  >
                    {row.cells.map((cell, inx2) => {
                      return (
                        <Fragment key={inx2}>
                          <td
                            data-label={dataLabel(cell.column)}
                            {...cell.getCellProps({ className: 'px-sm-3 px-2 py-2 fw-medium align-middle' })}
                          >
                            {cell.render('Cell')}
                          </td>
                        </Fragment>
                      );
                    })}
                  </tr>
                </Fragment>
              );
            })}
        </tbody>
      </BootstrapTable>
      {!errorText && !isError && pagination && !isLoading && rows.length > 0 && (
        <div className="bg-white">
          <div className="text-center py-3">{pagination}</div>
        </div>
      )}
      {rows.length <= 0 &&
        (isLoading ? (
          <TableEmptyState paddingClass="px-sm-3 px-2 py-1">
            <LoadingDots />
          </TableEmptyState>
        ) : isError && errorText ? (
          <TableEmptyState textClass="text-danger">{getReadableError(errorText, true)}</TableEmptyState>
        ) : (
          <TableEmptyState>No Data</TableEmptyState>
        ))}
    </div>
  );
};

interface ITableEmptyStateProp {
  paddingClass?: string;
  textClass?: string;
  children: ReactNode;
}
const TableEmptyState = ({
  paddingClass = 'px-sm-3 px-2 py-4',
  textClass = 'text-muted',
  children,
}: ITableEmptyStateProp) => {
  return (
    <div className={clsx('bg-white border-0 fw-medium align-middle text-center', paddingClass, textClass)}>
      {children}
    </div>
  );
};

const dataLabel = (column: ColumnInstance) => {
  if ('mobileHeader' in column) {
    return column.render('mobileHeader');
  }

  return column.render('Header');
};

export default Table;
