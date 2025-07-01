import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilters, useGlobalFilter, useSortBy, useTable } from 'react-table';

import GenericListing from './generic-listing';
import { ITableProps } from './types/listing';

const ListingView = ({
  columns,
  data,
  isError,
  isLoading: loading,
  isFetching,
  error,
  searchable,
  ...rest
}: ITableProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listing, setListing] = useState<readonly object[]>([]);

  useEffect(() => {
    setListing(data ? data.map(d => ({ original: d })) : []);
  }, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    rows,
    setGlobalFilter,
    state: { globalFilter },
  } = useTable(
    {
      columns,
      data: listing,
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
    <GenericListing
      {...rest}
      data={rows}
      searchedValue={globalFilter}
      setSearchState={searchable ? setSearchState : undefined}
      tableProps={{
        getTableProps,
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

export default ListingView;
