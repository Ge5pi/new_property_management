import { Button, Col, Row } from 'react-bootstrap';

import { SearchInput } from 'components/search-input';

export interface ICustomTableHeaderProps {
  total: number;
  handleCreateNewRecord: () => void;
  placeholder?: string;
  title?: string;
}

const CustomTableHeader = ({
  total,
  handleCreateNewRecord,
  placeholder = 'Type Here..',
  title = '',
}: ICustomTableHeaderProps) => {
  return (
    <Row className="align-items-center">
      <Col md sm={5}>
        <h2 className="fs-6 fw-bold mb-sm-0 mb-3">
          {title} <span className="fw-medium">({total})</span>
        </h2>
      </Col>

      <Col lg={'auto'} md sm={7} xs={12}>
        <Row className="gx-2 gy-1">
          <Col>
            <SearchInput size="sm" placeholder={placeholder} />
          </Col>
          <Col xs={'auto'}>
            <Button variant={'primary'} size="sm" className="btn-search-adjacent-sm" onClick={handleCreateNewRecord}>
              Add new
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default CustomTableHeader;
