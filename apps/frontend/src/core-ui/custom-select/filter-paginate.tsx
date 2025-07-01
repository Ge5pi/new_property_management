import { useCallback, useEffect, useRef, useState } from 'react';
import { Option, SelectEvent } from 'react-bootstrap-typeahead/types/types';

import { searchAPI } from 'api/core';

import { Notify } from 'core-ui/toast';

import { getReadableError } from 'utils/functions';

import { ModelName } from 'interfaces/IGeneral';

import FilterInput from './filter-input';
import { FilterListProps } from './types/select';

declare type API_CACHE = {
  [key: string]: {
    options: Option[];
    total_count: number;
    page: number;
  };
};

interface PaginatedDropdownProps
  extends Omit<FilterListProps, 'onInputChange' | 'onSearch' | 'paginate' | 'maxResults' | 'options'> {
  filter?: { key: string; id: number | string };
  model_label: ModelName;
  preload?: boolean;
}

const FilterPaginateInput = ({ model_label, filter, preload, ...rest }: PaginatedDropdownProps) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [visibleResults, updateVisibleResults] = useState(9);
  const CACHE = useRef<API_CACHE>({});

  const handleInputChange = (q: string) => {
    setQuery(q);
  };

  const handlePagination = (e: SelectEvent<HTMLElement>, shownResults: number) => {
    const cachedQuery = CACHE.current[query];
    updateVisibleResults(shownResults);

    if (cachedQuery.options.length > shownResults || cachedQuery.options.length === cachedQuery.total_count) {
      return;
    }

    setIsLoading(true);
    const page = cachedQuery.page + 1;

    searchAPI(model_label, query, page, 10, filter)
      .then(response => {
        const data = response.data;
        const options = cachedQuery.options.concat(data.results);
        CACHE.current[query] = { ...cachedQuery, options, page };
        setOptions(prev => mergeOptions(prev, options));
      })
      .catch(error => {
        Notify.show({
          type: 'danger',
          title: 'Unable to fetch more records. Something went wrong',
          description: getReadableError(error),
        });
      })
      .finally(() => setIsLoading(false));
  };

  const handleSearch = useCallback(
    (q: string) => {
      if (typeof preload !== 'undefined' && !preload) {
        if (CACHE.current[q]) delete CACHE.current[q];
        setOptions([]);
        return;
      }

      if (CACHE.current[q]) {
        setOptions(prev => mergeOptions(prev, CACHE.current[q].options));
        return;
      }

      setIsLoading(true);
      searchAPI(model_label, q, 1, 10, filter)
        .then(resp => {
          const data = resp.data;
          CACHE.current[q] = { options: data.results, total_count: data.count, page: 1 };
          setOptions(prev => mergeOptions(prev, data.results));
        })
        .catch(error => {
          Notify.show({
            type: 'danger',
            title: 'Unable to fetch more records. Something went wrong',
            description: getReadableError(error),
          });
        })
        .finally(() => setIsLoading(false));
    },
    [model_label, filter, preload]
  );

  useEffect(() => handleSearch(''), [handleSearch]);

  return (
    <FilterInput
      {...rest}
      paginate
      options={options}
      onSearch={handleSearch}
      isFetching={isLoading}
      paginationText={
        <div className="small text-center">
          <div className="fw-bold">Load more</div>
          <div className="fw-medium text-muted">search to filter</div>
        </div>
      }
      maxResults={visibleResults}
      onInputChange={handleInputChange}
      onPaginate={handlePagination}
      useCache={false}
    />
  );
};

const mergeOptions = (arr1: Option[], arr2: Option[]) => {
  return [...arr1, ...arr2].reduce((accumulator: Option[], current) => {
    const duplicate = accumulator.find(item => {
      return JSON.stringify(item) === JSON.stringify(current);
    });
    if (!duplicate) {
      return accumulator.concat([current]);
    } else {
      return accumulator;
    }
  }, []);
};

export default FilterPaginateInput;
