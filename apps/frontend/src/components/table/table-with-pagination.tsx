import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';

import { CustomizePagination } from 'components/customize-pagination';

import { IFilterOptions } from 'interfaces/IGeneral';

import GenericTable from './generic-table';
import { IPropsWithPagination } from './types/table';

import './table.styles.css';

const TableWithPagination = <T, F extends IFilterOptions>({
  columns,
  useData,
  defaultPageSize = 10,
  filterValues,
  searchable = true,
  saveValueInState = false,
  ...rest
}: IPropsWithPagination<T, F>) => {
  const [searchParams, setSearchParams] = useSearchParams({ page: '1' });
  const [localFilters, setLocalFilters] = useState<IFilterOptions>({ page: 1 });

  const [data, setData] = useState<readonly object[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableFilters, setTableFilters] = useState<F | object>(() => {
    if (filterValues) {
      let filters: F = filterValues;
      if (!saveValueInState) {
        Object.keys(searchParams).forEach(s => {
          if (s in filterValues) {
            if (filters[s as keyof F]) {
              filters = { ...filters, [s]: searchParams.get(s) };
            }
          }
        });
      }

      return filters;
    }
  });

  const [controlledPageCount, setPageCount] = useState(0);
  const [recordsPerPage] = useState(defaultPageSize);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: (saveValueInState ? (localFilters.page ?? 1) : Number(searchParams.get('page') ?? 1)) - 1,
        globalFilter: saveValueInState ? (localFilters.search ?? '') : (searchParams.get('search') ?? ''),
        pageSize: recordsPerPage,
      },
      defaultColumn: {
        width: 'auto',
        minWidth: 125,
      },
      manualFilters: true,
      manualPagination: true,
      manualGlobalFilter: true,
      pageCount: controlledPageCount,
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    if (filterValues) {
      setTableFilters(prev => {
        if (
          Object.entries(prev).some(([key, value]) => key in filterValues && value !== filterValues[key as keyof F])
        ) {
          gotoPage(0);
          return filterValues;
        }
        return prev;
      });
    }
  }, [filterValues, gotoPage]);

  const {
    data: record,
    isFetching,
    isLoading,
    error,
    isError,
  } = useData({ page: pageIndex + 1, size: pageSize, search: globalFilter, ...tableFilters } as F);

  useEffect(() => {
    setLoading(isLoading || isFetching);

    setData(() => {
      if (!(isLoading || isFetching)) {
        return record && record.results ? (record.results as object[]) : [];
      }
      return [];
    });

    setPageCount(() => {
      if (!(isLoading || isFetching)) {
        return record ? record.pages_count : 0;
      }
      return 0;
    });
  }, [record, isFetching, isLoading]);

  const [initPage, setInitPage] = useState(1);
  const setSearchState = useCallback(
    (value: string) => {
      let page = '1';

      setInitPage(prev => {
        if (value && pageIndex > 0) {
          if (!saveValueInState) {
            page = searchParams.get('page') ?? '1';
            searchParams.set('page', '1');
          }

          gotoPage(0);
          return Number(page) > 0 ? Number(page) : prev;
        }

        searchParams.set('page', prev.toString());
        return prev;
      });

      setGlobalFilter(value);
      if (!saveValueInState) {
        value && value !== '' ? searchParams.set('search', value) : searchParams.delete('search');
        setSearchParams(searchParams, { replace: true });
      } else {
        setLocalFilters(prev => ({ ...prev, page: 1, search: value }));
      }
    },
    [pageIndex, gotoPage, searchParams, saveValueInState, setGlobalFilter, setSearchParams]
  );

  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, page: initPage }));
  }, [initPage]);

  return (
    <GenericTable
      {...rest}
      pagination={
        pageCount > 1 && (
          <CustomizePagination
            size="sm"
            handlePagination={page => {
              gotoPage(page - 1);
              if (saveValueInState) {
                setLocalFilters(prev => ({ ...prev, page }));
              } else {
                searchParams.set('page', page.toString());
                setSearchParams(searchParams);
              }
            }}
            totalPageCount={pageCount}
            current={pageIndex + 1}
          />
        )
      }
      data={page}
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
      loading={loading}
      total={record ? record.count : 0}
    />
  );
};

export default TableWithPagination;
