import { Col, Row } from 'react-bootstrap';

import { SearchInput } from 'components/search-input';

export interface IManagementFeeTableProps {
  total: number;
  placeholder?: string;
  title?: string;
}

const ManagementFeeTable = ({ total, placeholder = 'Type Here..', title = '' }: IManagementFeeTableProps) => {
  return (
    <Row className="align-items-center">
      <Col md sm={5}>
        <h2 className="fs-6 fw-bold mb-sm-0 mb-3">
          {title} <span className="fw-medium">({total})</span>
        </h2>
      </Col>

      <Col lg={'auto'} md sm={7} xs={12}>
        <SearchInput size="sm" placeholder={placeholder} />
      </Col>
    </Row>
  );
};

export default ManagementFeeTable;
