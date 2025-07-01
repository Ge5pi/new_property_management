import { Col, Row } from 'react-bootstrap';

import LineChart from './line-chart';

function RevenueStatistics() {
  const statsData = [
    {
      id: 'total-revenue',
      title: 'Total revenue',
      value: '865,000',
      subtitle: 'inc since last month',
      percentage: 10,
    },
    {
      id: 'pending-receivables',
      title: 'Pending receivables',
      value: '65,000',
      subtitle: 'inc since last month',
      percentage: 5,
    },
    {
      id: 'received-amount',
      title: 'Received amount',
      value: '80,000,000',
      subtitle: 'inc since last month',
      percentage: -3,
    },
    {
      id: 'late-fee-amount',
      title: 'Late Fee amount',
      value: '500',
      subtitle: 'inc since last month',
      percentage: 10,
    },
  ];

  return (
    <Row className="mb-4 g-4">
      {statsData.map(({ id, subtitle, title, value, percentage }) => (
        <Col lg={3} key={id}>
          <div className="page-section">
            <div className="px-4 py-3">
              <p className="fw-medium mb-1">{title}</p>
              <p className="fw-bold fs-5 m-0">${value}</p>
            </div>
            <hr className="m-0" />
            <div className="px-4 border d-flex">
              <LineChart stroke={percentage >= 0 ? '#189915' : '#E12323'} />
              <p className="x-small m-0">
                <span className="fw-medium"> {Math.abs(percentage)}%</span>
                <span className="mx-1 text-black-50">{subtitle}</span>
              </p>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
}

export default RevenueStatistics;
