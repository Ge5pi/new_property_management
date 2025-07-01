import { FormEvent, ReactNode } from 'react';
import { Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';

import { SubmitBtn } from 'components/submit-button';

import { FilterIcon } from 'core-ui/icons';

import './filter-menu.styles.css';

interface IFilterMenu {
  children: ReactNode;
  placement?: 'left' | 'right';
  onSubmit?: (e?: FormEvent<HTMLFormElement> | undefined) => void;
  isSubmitting?: boolean;
}

const FilterMenu = ({ isSubmitting, onSubmit, children }: IFilterMenu) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-primary" className="btn-search-adjacent-sm no-dropdown-arrow" size="sm">
        <FilterIcon />
        <span className="d-sm-block d-none mx-1">Filter</span>
      </Dropdown.Toggle>

      <Dropdown.Menu className="filter-menu-container">
        <Form
          className="text-start"
          noValidate
          onSubmit={e => {
            e.preventDefault();
            onSubmit && onSubmit(e);
          }}
        >
          <Container fluid className="popup-wrapper">
            <Row className="g-sm-3 gx-0 gy-3 align-items-stretch">
              <Col xs={12}>{children}</Col>

              <Col xs={12}>
                <div className="my-2 d-flex align-items-center justify-content-end">
                  <Button
                    variant="light border-primary"
                    disabled={isSubmitting}
                    className="px-4 py-1 me-3"
                    type="reset"
                  >
                    Clear
                  </Button>

                  <SubmitBtn variant="primary" type="submit" loading={isSubmitting} className="px-4 py-1">
                    Apply
                  </SubmitBtn>
                </div>
              </Col>
            </Row>
          </Container>
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FilterMenu;
