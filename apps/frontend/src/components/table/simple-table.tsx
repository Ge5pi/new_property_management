import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilters, useGlobalFilter, useSortBy, useTable } from 'react-table';

import GenericTable from './generic-table';
import { ITableProps } from './types/table';

import './table.styles.css';

const Table = ({ columns, data, isError, isLoading: loading, isFetching, error, searchable, ...rest }: ITableProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const dataTable = useRef<HTMLTableElement | null>(null);
  const [list, setList] = useState({
    itemsDisplayed: 20,
    data: [] as readonly object[],
  });

  const onScroll = useCallback(() => {
    setList(prev => {
      if (prev.itemsDisplayed + 10 <= data.length) {
        return {
          itemsDisplayed: prev.itemsDisplayed + 10,
          data: data.slice(0, prev.itemsDisplayed + 10),
        };
      }

      return prev;
    });
  }, [data]);

  useEffect(() => {
    const tableEl = dataTable.current;
    const handleScroll = (ev: Event) => {
      const { scrollHeight, scrollTop, clientHeight } = ev.target as HTMLDivElement;
      if (scrollHeight - scrollTop - clientHeight < 300) {
        onScroll();
      }
    };

    if (tableEl) {
      const tableWrapper = tableEl.parentElement;
      if (tableWrapper && tableWrapper.classList.contains('table-responsive')) {
        tableWrapper.addEventListener('scroll', handleScroll);
      }
    }

    return () => {
      if (tableEl) {
        const tableWrapper = tableEl.parentElement;
        if (tableWrapper && tableWrapper.classList.contains('table-responsive')) {
          tableWrapper.removeEventListener('scroll', handleScroll);
        }
      }
    };
  }, [onScroll]);

  useEffect(() => {
    const tableEl = dataTable.current;
    if (tableEl) {
      const tableWrapper = tableEl.parentElement;
      if (tableWrapper && tableWrapper.classList.contains('table-responsive')) {
        const { scrollHeight, scrollTop, clientHeight } = tableWrapper as HTMLDivElement;
        if (scrollHeight - scrollTop - clientHeight < 300) {
          setList({
            itemsDisplayed: 20,
            data: data.length > 20 ? data.slice(0, 20) : data,
          });
        }
      }
    }
  }, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    setGlobalFilter,
    state: { globalFilter },
  } = useTable(
    {
      columns,
      data: list.data,
      defaultColumn: {
        width: 'auto',
        minWidth: 125,
      },
      initialState: {
        globalFilter: searchParams.get('search') ?? '',
      },
      manualFilters: true,
      manualGlobalFilter: true,
    },
    useGlobalFilter,
    useFilters,
    useSortBy
  );

  const setSearchState = useCallback(
    (value: string) => {
      setGlobalFilter(value);
      value && value !== '' ? searchParams.set('search', value) : searchParams.delete('search');
      setSearchParams(searchParams, { replace: true });
    },
    [searchParams, setGlobalFilter, setSearchParams]
  );

  return (
    <GenericTable
      {...rest}
      data={rows}
      ref={dataTable}
      searchedValue={globalFilter}
      setSearchState={searchable ? setSearchState : undefined}
      tableProps={{
        getTableProps,
        headerGroups,
        getTableBodyProps,
        prepareRow,
      }}
      error={error}
      isError={isError}
      loading={loading || isFetching}
      total={data.length ?? 0}
    />
  );
};

export default Table;
