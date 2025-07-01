import { Col, Row } from 'react-bootstrap';

import { clsx } from 'clsx';

import { SearchInput } from 'components/search-input';
import { Table } from 'components/table';

import { CustomSelect } from 'core-ui/custom-select';

const Budget = () => {
  const columns = [
    {
      Header: <AccountNameDetail title="GL Account" subtitle="XXXX_XXXX_XXXXX" />,
      mobileHeader: `GL Account - XXXX_XXXX_XXXXX`,
      accessor: 'account',
      disableSortBy: true,
      width: '400px',
    },
    {
      Header: <AccountNameDetail title="Total Amount" subtitle="$5,000" alignRight={true} />,
      mobileHeader: 'Total Amount - $5,000',
      accessor: 'amount',
      disableSortBy: true,
      width: '120px',
    },
  ];

  const data = [
    {
      account: 'January',
      amount: '$100',
    },
    {
      account: 'February',
      amount: '$100',
    },
    {
      account: 'March',
      amount: '$100',
    },
    {
      account: 'April',
      amount: '$100',
    },
  ];
  return (
    <div className="container-fluid px-xl-4 page-section py-4">
      <Row className="align-items-center justify-content-between gx-3 gy-4">
        <Col xxl={2} lg={3} sm={4} xs={12} className="order-sm-0 order-1">
          <CustomSelect
            name="search_by_fiscal_year"
            labelText="Search by Fiscal Year"
            controlId={`BudgetFormFiscalYear`}
            options={[
              { label: '2022', value: '2022' },
              { label: '2021', value: '2021' },
              { label: '2020', value: '2020' },
            ]}
            classNames={{
              labelClass: 'text-muted small mb-0',
            }}
          />
        </Col>
        <Col lg={'auto'} md={5} sm={6} xs={12}>
          <div className="mt-4">
            <SearchInput size="sm" />
          </div>
        </Col>
      </Row>

      <div className="my-3">
        <Table
          data={data}
          columns={columns}
          shadow={false}
          enableMobileMode={false}
          showTotal={false}
          wrapperClass={'big-list-table'}
        />
      </div>
    </div>
  );
};

interface IAccountProps {
  title: string;
  subtitle: string;
  alignRight?: boolean;
}

const AccountNameDetail = ({ title = '', subtitle = '', alignRight = false }: IAccountProps) => {
  return (
    <div className={clsx({ 'text-end': alignRight })}>
      <p className="mb-1 text-capitalize fw-bold">{title}</p>
      <p className="text-primary fw-normal mb-0">{subtitle}</p>
    </div>
  );
};

export default Budget;
