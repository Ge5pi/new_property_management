import { FC, ReactElement, useCallback, useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { FilterMenu } from 'components/filter-menu';

import { ProjectStatusType } from 'interfaces/IMaintenance';

import './../maintenance.styles.css';

declare type StatusType = ProjectStatusType | '';
interface IProps {
  children: (data: StatusType, FC: JSX.Element) => ReactElement;
}

const ProjectWrapper: FC<IProps> = ({ children }) => {
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

  return children(filterBy, <FilterMenuComponent filter={filterBy} handleFilterData={handleFilterData} />);
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
          id={`filter-in-progress`}
          name="filter-table"
          label={`In Progress`}
          checked={filter === 'IN_PROGRESS'}
          onChange={ev => {
            if (ev.target.checked) handleFilterData('IN_PROGRESS');
          }}
        />
      </Dropdown.Item>
      <Dropdown.Item as={'div'}>
        <Form.Check
          type={'radio'}
          id={`filter-completed`}
          name="filter-table"
          label={`Completed`}
          checked={filter === 'COMPLETED'}
          onChange={ev => {
            if (ev.target.checked) handleFilterData('COMPLETED');
          }}
        />
      </Dropdown.Item>
    </FilterMenu>
  );
};

export default ProjectWrapper;
