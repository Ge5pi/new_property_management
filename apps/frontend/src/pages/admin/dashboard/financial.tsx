import { Col, Row } from 'react-bootstrap';

import IncomeExpenseComparison from './components/financial/income-expense-comparison';
import OutstandingInvoices from './components/financial/outstanding-invoices';
import RecentPayments from './components/financial/recent-payments';
import RevenueStatistics from './components/financial/revenue-statistics';

const Financial = () => {
  return (
    <div className="mt-4">
      <RevenueStatistics />
      <IncomeExpenseComparison />
      <Row>
        <Col md={6}>
          <OutstandingInvoices />
        </Col>
        <Col md={6}>
          <RecentPayments />
        </Col>
      </Row>
    </div>
  );
};

export default Financial;
