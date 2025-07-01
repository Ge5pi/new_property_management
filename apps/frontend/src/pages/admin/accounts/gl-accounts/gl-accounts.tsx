import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetGeneralLedgerAccountsQuery } from 'services/api/general-ledger';

import { TableWithPagination } from 'components/table';

const GlAccounts = () => {
  const columns = [
    {
      Header: 'Account',
      accessor: 'account_holder_content_type_name',
      minWidth: 300,
    },
    {
      Header: 'Type',
      accessor: 'get_account_type_display',
      minWidth: 200,
    },
    {
      Header: 'Sub Account',
      accessor: 'get_sub_account_type_display',
    },
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const pageNumber = searchParams.get('page');
    searchParams.set('page', pageNumber ?? '1');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return (
    <TableWithPagination columns={columns} useData={useGetGeneralLedgerAccountsQuery} pageHeader={'GL Accounts'} />
  );
};

export default GlAccounts;
