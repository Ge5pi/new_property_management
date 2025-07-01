import { FormEvent, ReactNode } from 'react';
import { Dropdown, Form } from 'react-bootstrap';

import { clsx } from 'clsx';

import { FilterIcon } from 'core-ui/icons';

import './filter-menu.styles.css';

interface IProps {
  children: ReactNode;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  handleReset?: (e: FormEvent<HTMLFormElement>) => void;
  dropdownMenuClassName?: string;
  isEnabled?: boolean;
}

const FilterMenu = ({ children, onSubmit, handleReset, dropdownMenuClassName, isEnabled = false }: IProps) => {
  return (
    <Dropdown>
      <Form className="text-start" noValidate onSubmit={onSubmit} onReset={handleReset}>
        <Dropdown.Toggle variant="outline-primary" className="btn-search-adjacent-sm no-dropdown-arrow" size="sm">
          <span className="position-relative">
            <FilterIcon />
            {isEnabled && (
              <span
                title="Showing filter record"
                className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
              >
                <span className="visually-hidden">Filter Enabled</span>
              </span>
            )}
          </span>
          <span className="d-sm-block d-none mx-1">Filter</span>
        </Dropdown.Toggle>

        <Dropdown.Menu className={clsx('stay-on-top', dropdownMenuClassName)}>{children}</Dropdown.Menu>
      </Form>
    </Dropdown>
  );
};

export default FilterMenu;
