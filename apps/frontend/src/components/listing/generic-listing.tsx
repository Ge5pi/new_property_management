import { MouseEvent, ReactNode, useState } from 'react';
import { Button, Card, Col, Row, Stack, Table } from 'react-bootstrap';
import { Row as ReactTableRow } from 'react-table';

import { clsx } from 'clsx';

import { LoadingDots } from 'components/loading';
import { SearchInput } from 'components/search-input';

import { useAuthState } from 'hooks/useAuthState';

import { getReadableError } from 'utils/functions';

import { GenericTableProps, ICommonHeaderProps } from './types/listing';

const GenericListing = ({
  data,
  error,
  isError,
  loading,
  tableProps,
  onRowClick,
  shadow = true,
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
}: GenericTableProps) => {
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

  const { getTableProps, getTableBodyProps, prepareRow } = tableProps;
  return (
    <div className={clsx({ 'component-margin-y': !showHeaderInsideContainer && !hideMainHeaderComponent })}>
      {!hideMainHeaderComponent && !showHeaderInsideContainer && (
        <TableMainHeader {...rest} total={total} showTotal={false} />
      )}
      <Card border="light" className={clsx('border-0', { shadow: shadow }, wrapperClass)}>
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
        <Card.Body className={clsx('pt-0', classes?.body, 'list-responsive')}>
          <Table
            {...getTableProps({
              className: clsx(className, 'border-0'),
              style: { borderCollapse: 'separate', borderSpacing: '0 .125rem' },
            })}
          >
            <tbody {...getTableBodyProps()}>
              {data.map(row => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps({
                      className: clsx({ 'cursor-pointer': clickable }, 'border-0'),
                    })}
                    key={`${row.id}-${row.index}`}
                    onClick={ev => handleRowClick(ev, row)}
                  >
                    {row.cells.map((cell, ix) => {
                      return (
                        <td
                          {...cell.getCellProps({
                            className: 'border-0 align-middle p-0',
                          })}
                          colSpan={row.cells.length}
                          key={`${row.id}-${ix}`}
                        >
                          {cell.render('Cell')}
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
              'px-0 pt-4 border-0',
              { 'bg-white': !classes?.footer || !/bg-/.test(classes?.footer) },
              classes?.footer,
              classes?.footer
            )}
          >
            {pagination}
          </Card.Footer>
        )}
      </Card>
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
  return <div className={clsx('border-0 fw-medium align-middle text-center', paddingClass, textClass)}>{children}</div>;
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
  newRecordButtonPermission,
  titleAndTotalInline = true,
  newRecordButtonText = 'Add New',
  searchedValue,
  showTotal,
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
                <Stack
                  direction={titleAndTotalInline ? 'horizontal' : 'vertical'}
                  className={clsx({ 'align-items-center': titleAndTotalInline })}
                  gap={titleAndTotalInline ? 1 : 0}
                >
                  {pageHeader}
                  {showTotal && (
                    <span className={clsx({ 'mx-1 fw-medium': titleAndTotalInline }, { small: !titleAndTotalInline })}>
                      {!titleAndTotalInline ? `Total: ${total ?? 0}` : (total ?? 0)}
                    </span>
                  )}
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

export default GenericListing;
