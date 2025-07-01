import { useEffect } from 'react';
import { Badge, Card } from 'react-bootstrap';
import { useParams, useSearchParams } from 'react-router-dom';

import { useGetGeneralLedgerTransactionsQuery } from 'services/api/general-ledger';

import { TableWithPagination } from 'components/table';

import { GeneralLedgerAccountType } from 'interfaces/IAccounting';

import JournalHeader from './components/journal-navigation';

const JournalEntries = () => {
  const { account: account_type } = useParams();
  const columns = [
    {
      Header: 'Account',
      accessor: 'description',
      minWidth: 300,
    },
    {
      Header: 'Type',
      accessor: 'get_transaction_type_display',
      minWidth: 200,
    },
    {
      Header: 'Amount',
      accessor: 'amount',
    },
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const pageNumber = searchParams.get('page');
    searchParams.set('page', pageNumber ?? '1');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  if (!account_type || !entryExist(account_type)) {
    return (
      <Card className="bg-transparent component-margin-y border-0" style={{ minHeight: '50vh' }}>
        <Card.Header className="border-0 bg-transparent">
          <JournalHeader />
        </Card.Header>
        <Card.Body className="text-center d-flex align-items-center justify-content-between flex-column">
          <div className="my-auto">
            <Card.Title className="fw-bold text-black">
              <span>Invalid account type found!</span>
              <Badge pill bg="grayish" className="text-primary text-opacity-50 small fw-normal mx-2 py-2 px-3">
                Error code 404
              </Badge>
            </Card.Title>
            <Card.Text style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              The server can't find the requested resource.
            </Card.Text>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <TableWithPagination
      columns={columns}
      useData={useGetGeneralLedgerTransactionsQuery}
      filterValues={{ gl_account__account_type: account_type.toUpperCase() as GeneralLedgerAccountType }}
      pageHeader={<JournalHeader />}
    />
  );
};

export default JournalEntries;

const entryExist = (account_type: string) =>
  ['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE'].some(a => a === account_type.toUpperCase());
