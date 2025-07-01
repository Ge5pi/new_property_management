import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetBankAccountsQuery } from 'services/api/bank-accounts';

import { TableWithPagination } from 'components/table';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

const BankAccounts = () => {
  const columns = [
    {
      Header: 'Account Name',
      accessor: 'account_title',
      minWidth: 300,
    },
    {
      Header: 'Bank',
      accessor: 'bank_name',
      minWidth: 200,
    },
    {
      Header: 'Account Number',
      accessor: 'account_number',
    },
  ];

  const { redirect } = useRedirect();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const pageNumber = searchParams.get('page');
    searchParams.set('page', pageNumber ?? '1');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return (
    <TableWithPagination
      clickable
      columns={columns}
      useData={useGetBankAccountsQuery}
      pageHeader={'Bank Accounts'}
      handleCreateNewRecord={() => redirect('create')}
      newRecordButtonPermission={PERMISSIONS.ACCOUNTS}
      onRowClick={row => {
        if (row.original) {
          const account_id = row.original;
          if ('id' in account_id) {
            redirect(`${account_id.id}/details`);
          }
        }
      }}
    />
  );
};

export default BankAccounts;
