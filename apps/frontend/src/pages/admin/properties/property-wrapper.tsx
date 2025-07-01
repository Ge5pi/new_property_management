import { FC, ReactElement, useCallback, useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { FilterMenu } from 'components/filter-menu';

import { PropertyStatus } from 'interfaces/IProperties';

declare type StatusType = PropertyStatus | '';
declare type OccupiedStatusType = 'true' | 'false' | '';
interface IProps {
  children: (data: OccupiedStatusType, FC: JSX.Element) => ReactElement;
}

const PropertyWrapper: FC<IProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterBy, setFilterStatus] = useState<StatusType>(() => {
    const currentStatus = searchParams.get('status') as StatusType;
    if (currentStatus && typeof currentStatus === 'string') {
      return currentStatus;
    }

    return '';
  });

  const handleFilterData = useCallback(
    (value: StatusType) => {
      searchParams.set('page', '1');
      searchParams.set('status', value);
      setSearchParams(searchParams, { replace: true });
      setFilterStatus(value);
    },
    [searchParams, setSearchParams]
  );

  const is_occupied =
    filterBy === 'OCCUPIED' || filterBy === 'VACANT' ? Boolean(filterBy === 'OCCUPIED').toString() : '';
  return children(
    is_occupied as OccupiedStatusType,
    <FilterMenuComponent filter={filterBy} handleFilterData={handleFilterData} />
  );
};

interface IFCProps {
  filter: StatusType;
  handleFilterData: (value: StatusType) => void;
}

const FilterMenuComponent = ({ filter, handleFilterData }: IFCProps) => {
  return (
    <FilterMenu isEnabled={filter !== ''}>
      <Dropdown.Item as={'div'}>
        <Form.Check
          type={'radio'}
          id={`filter-all`}
          name="filter-table"
          label={`All`}
          checked={filter === ''}
          onChange={ev => {
            if (ev.target.checked) handleFilterData('');
          }}
        />
      </Dropdown.Item>
      <Dropdown.Item as={'div'}>
        <Form.Check
          type={'radio'}
          id={`filter-occupied`}
          name="filter-table"
          label={`Occupied`}
          checked={filter === 'OCCUPIED'}
          onChange={ev => {
            if (ev.target.checked) handleFilterData('OCCUPIED');
          }}
        />
      </Dropdown.Item>
      <Dropdown.Item as={'div'}>
        <Form.Check
          type={'radio'}
          id={`filter-vacant`}
          name="filter-table"
          label={`Vacant`}
          checked={filter === 'VACANT'}
          onChange={ev => {
            if (ev.target.checked) handleFilterData('VACANT');
          }}
        />
      </Dropdown.Item>
    </FilterMenu>
  );
};

export default PropertyWrapper;
