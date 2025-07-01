import { ForwardedRef, Fragment, MouseEvent, ReactNode, forwardRef, useState } from 'react';
import { Button, Card, Col, Row, Stack, Table } from 'react-bootstrap';
import { ColumnInstance, Row as ReactTableRow } from 'react-table';

import { clsx } from 'clsx';

import { LoadingDots } from 'components/loading';
import { SearchInput } from 'components/search-input';

import { ChevronDownIcon, ChevronUpIcon } from 'core-ui/icons';

import { useAuthState } from 'hooks/useAuthState';

import { getReadableError } from 'utils/functions';

import StickyColumn from './sticky-column';
import { GenericTableProps, ICommonHeaderProps } from './types/table';

import './table.styles.css';

const GenericTable = forwardRef(
  (
    {
      data,
      error,
      isError,
      loading,
      tableProps,
      onRowClick,
      shadow = true,
      enableMobileMode = true,
      clickable = false,
      showHeaderInsideContainer = false,
      hideMainHeaderComponent = false,
      wrapperClass,
      className,
      pagination,
      customHeader,
      total,
      showTotal = true,
      classes,
      ...rest
    }: GenericTableProps,
    ref: ForwardedRef<HTMLTableElement>
  ) => {
    const handleRowClick = (event: MouseEvent<HTMLTableRowElement>, row: ReactTableRow) => {
      const target = event.target as HTMLElement;
      if (
        target instanceof HTMLButtonElement ||
        target.closest('button') instanceof HTMLButtonElement ||
        target.classList.contains('dropdown-menu')
      ) {
        event.preventDefault();
        return;
      }

      onRowClick && onRowClick(row);
    };

    const { getTableProps, headerGroups, getTableBodyProps, prepareRow } = tableProps;
    return (
      <div className={clsx({ 'component-margin-y': !showHeaderInsideContainer && !hideMainHeaderComponent })}>
        {!hideMainHeaderComponent && !showHeaderInsideContainer && (
          <TableMainHeader {...rest} total={total} showTotal={false} />
        )}
        <Card border="light" className={clsx('table-wrapper', { shadow: shadow }, wrapperClass)}>
          {showHeaderInsideContainer ? (
            <Card.Header
              className={clsx(
                'pt-3 pb-0 border-0',
                { 'bg-white': !classes?.header || !/bg-/.test(classes?.header) },
                classes?.header
              )}
            >
              <TableMainHeader {...rest} total={total} showTotal={showTotal} />
            </Card.Header>
          ) : (
            (showTotal || customHeader) && (
              <Card.Header
                className={clsx(
                  'py-3 border-0',
                  { 'bg-white': !classes?.header || !/bg-/.test(classes?.header) },
                  classes?.header
                )}
              >
                {showTotal && <h2 className="fs-6 fw-bold mb-0">Total: {total ?? 0} </h2>}
                {customHeader && customHeader}
              </Card.Header>
            )
          )}
          <Card.Body className={clsx('p-0', classes?.body)}>
            <Table
              {...getTableProps({
                className: clsx({ 'table-fit my-0': enableMobileMode }, 'border', className),
              })}
              ref={ref}
              responsive
              hover
            >
              <thead className="table-header sticky-top border border-1 shadow-sm">
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={`${headerGroup.groupedIndex}-${headerGroup.id}`}>
                    {headerGroup.headers.map(column => (
                      <th
                        {...column.getHeaderProps({
                          ...column.getSortByToggleProps(),
                          style: {
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                            width: column.width,
                          },
                          className: clsx(
                            'px-3 py-2 fw-bold text-nowrap',
                            {
                              'fixed-col fixed-col-left': 'sticky' in column && column['sticky'] === 'left',
                            },
                            {
                              'fixed-col fixed-col-right': 'sticky' in column && column['sticky'] === 'right',
                            }
                          ),
                        })}
                        key={`${headerGroup.id}-${column.id}`}
                      >
                        <StickyColumn sticky={Boolean('sticky' in column && column['sticky'])} />
                        {!column.disableSortBy ? (
                          <Stack direction="horizontal" gap={1} className="align-items-center">
                            <span>{column.render('Header')}</span>
                            {!column.disableSortBy && (
                              <Stack gap={0} className="small table-column-sorting-btn mx-1">
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
                              </Stack>
                            )}
                          </Stack>
                        ) : (
                          <div>{column.render('Header')}</div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="table-body" {...getTableBodyProps()}>
                {data.map(row => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps({
                        className: clsx({ 'table-row-clickable': clickable }),
                      })}
                      key={`${row.id}-${row.index}`}
                      onClick={ev => handleRowClick(ev, row)}
                    >
                      {row.cells.map((cell, ix) => {
                        return (
                          <td
                            {...cell.getCellProps({
                              className: clsx(
                                'px-3 py-2 align-middle fw-normal',
                                {
                                  'fixed-col fixed-col-left':
                                    'sticky' in cell.column && cell.column['sticky'] === 'left',
                                },
                                {
                                  'fixed-col fixed-col-right':
                                    'sticky' in cell.column && cell.column['sticky'] === 'right',
                                }
                              ),
                            })}
                            data-label={dataLabel(cell.column)}
                            key={`${row.id}-${ix}`}
                          >
                            <StickyColumn sticky={Boolean('sticky' in cell.column && cell.column['sticky'])} />
                            <div className="cell-font-size">{cell.render('Cell')}</div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {data.length <= 0 &&
              (loading ? (
                <TableEmptyState paddingClass="px-sm-3 px-2 py-1">
                  <LoadingDots />
                </TableEmptyState>
              ) : isError && error ? (
                <TableEmptyState textClass="text-danger">{getReadableError(error, true)}</TableEmptyState>
              ) : (
                <TableEmptyState>No Data</TableEmptyState>
              ))}
          </Card.Body>
          {pagination && (
            <Card.Footer
              className={clsx(
                'border-0',
                { 'bg-white': !classes?.footer || !/bg-/.test(classes?.footer) },
                classes?.footer
              )}
            >
              {pagination}
            </Card.Footer>
          )}
        </Card>
      </div>
    );
  }
);

GenericTable.displayName = 'GenericTable';
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
  return <div className={clsx('border-0 fw-medium align-middle text-center', paddingClass, textClass)}>{children}</div>;
};

const dataLabel = (column: ColumnInstance) => {
  if ('mobileHeader' in column) {
    return column.render('mobileHeader');
  }

  const element = column.render('Header');
  return typeof element === 'string' ? element : '';
};

interface ITableMainHeaderProps extends ICommonHeaderProps {
  searchedValue?: string;
}

const TableMainHeader = ({
  pageHeader,
  filterMenu,
  setSearchState,
  additionalActionButtons,
  handleCreateNewRecord,
  searchedValue,
  showTotal,
  newRecordButtonText = 'Add New',
  newRecordButtonPermission,
  total,
}: ITableMainHeaderProps) => {
  const [searched, setSearched] = useState(false);
  const onSearch = async (value: string) => {
    setSearched(true);
    setSearchState && setSearchState(value);
  };

  const onReset = () => {
    setSearched(false);
    setSearchState && setSearchState('');
  };

  const { isAccessible } = useAuthState();

  return (
    <div className="mb-3">
      <Row
        className={clsx('gx-2 align-items-center justify-content-between', {
          'gy-md-0 gy-2': Boolean(filterMenu || setSearchState || additionalActionButtons || handleCreateNewRecord),
        })}
      >
        {pageHeader && (
          <Col xs={'auto'}>
            {typeof pageHeader === 'string' ? (
              <h1 className="fw-bold h4 mt-1 text-capitalize">
                {pageHeader} {showTotal && <span className="fw-medium mx-1">({total ?? 0})</span>}
              </h1>
            ) : (
              <div>
                <Stack direction="horizontal" className="align-items-center" gap={1}>
                  {pageHeader} {showTotal && <span className="fw-medium mx-1">({total ?? 0})</span>}
                </Stack>
              </div>
            )}
          </Col>
        )}
        <Col md={{ span: true, offset: 1 }} sm>
          <Row
            className={clsx('gx-2 justify-content-end align-items-center', {
              'gy-md-0 gy-2': Boolean(filterMenu || setSearchState || additionalActionButtons || handleCreateNewRecord),
            })}
          >
            {filterMenu && <Col xs={'auto'}>{filterMenu}</Col>}
            {setSearchState && (
              <Col lg={'auto'} xs>
                <SearchInput
                  size="sm"
                  handleSearch={onSearch}
                  defaultValue={searchedValue}
                  onReset={onReset}
                  isSearched={searched}
                />
              </Col>
            )}
            {additionalActionButtons && <Col xs={'auto'}>{additionalActionButtons}</Col>}
            {newRecordButtonPermission && !isAccessible(newRecordButtonPermission)
              ? null
              : handleCreateNewRecord && (
                  <Col xs={'auto'}>
                    <Button
                      variant={'primary'}
                      size="sm"
                      className={clsx({ 'btn-search-adjacent-sm': setSearchState }, 'px-4')}
                      onClick={handleCreateNewRecord}
                    >
                      {newRecordButtonText}
                    </Button>
                  </Col>
                )}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default GenericTable;
