import { FC, ReactElement, useCallback, useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { FilterMenu } from 'components/filter-menu';

import { WorkOrderStatus } from 'interfaces/IWorkOrders';

import '../maintenance.styles.css';

declare type StatusType = WorkOrderStatus | '';
interface IProps {
  children: (data: StatusType, FC: JSX.Element) => ReactElement;
}

const WorkOrderWrapper: FC<IProps> = ({ children }) => {
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
          id={`filter-open`}
          name="filter-table"
          label={`Open`}
          checked={filter === 'OPEN'}
          onChange={ev => {
            if (ev.target.checked) handleFilterData('OPEN');
          }}
        />
      </Dropdown.Item>
      <Dropdown.Item as={'div'}>
        <Form.Check
          type={'radio'}
          id={`filter-assigned`}
          name="filter-table"
          label={`Assigned`}
          checked={filter === 'ASSIGNED'}
          onChange={ev => {
            if (ev.target.checked) handleFilterData('ASSIGNED');
          }}
        />
      </Dropdown.Item>
      <Dropdown.Item as={'div'}>
        <Form.Check
          type={'radio'}
          id={`filter-unassigned`}
          name="filter-table"
          label={`Unassigned`}
          checked={filter === 'UNASSIGNED'}
          onChange={ev => {
            if (ev.target.checked) handleFilterData('UNASSIGNED');
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

export default WorkOrderWrapper;
