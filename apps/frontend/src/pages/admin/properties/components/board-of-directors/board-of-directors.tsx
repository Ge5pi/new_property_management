import { useState } from 'react';
import { Button, Card, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';

import { SearchInput } from 'components/search-input';

import { BoardOfDirectorModal } from 'core-ui/popups/board-of-director';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import SingleBoardOfDirector from './single-board-of-director';

const BoardOfDirectors = () => {
  const [selectedFilter, setFilterBy] = useState('Active Member');

  const handleItemClick = () => {
    SweetAlert({
      size: 'lg',
      html: <BoardOfDirectorModal />,
    }).fire({
      allowOutsideClick: () => !SwalExtended.isLoading(),
    });
  };

  const handleFilterDropdown = (eventKey: string | null) => {
    setFilterBy(eventKey ?? 'Active Member');
  };

  return (
    <div className="container-fluid px-xl-4 page-section py-4">
      <Row className="align-items-center gx-3 gy-4">
        <Col className="order-sm-0 order-1">
          <Card.Title className="fw-bold fs-6">List of all Board Members</Card.Title>
          <Card.Text className="fw-medium small">Total: 12</Card.Text>
        </Col>
        <Col lg={'auto'} md={8} sm={7} xs={12}>
          <Row className="gx-2 gy-1">
            <Col md={'auto'}>
              <DropdownButton
                variant="outline-primary"
                className="btn-search-adjacent-sm"
                size="sm"
                id={`filter-table-data-board-of-directors`}
                title={selectedFilter}
                onSelect={handleFilterDropdown}
              >
                <Dropdown.Item eventKey={'Active Member'}>Active Member</Dropdown.Item>
                <Dropdown.Item eventKey={'Past Member'}>Past Member</Dropdown.Item>
              </DropdownButton>
            </Col>
            <Col>
              <Row className="gx-1">
                <Col>
                  <SearchInput size="sm" />
                </Col>
                <Col xs={'auto'}>
                  <Button variant={'primary'} size="sm" className="btn-search-adjacent-sm" onClick={handleItemClick}>
                    Add New
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>

      <div className="my-3" onClick={handleItemClick}>
        <SingleBoardOfDirector />
      </div>
    </div>
  );
};

export default BoardOfDirectors;
