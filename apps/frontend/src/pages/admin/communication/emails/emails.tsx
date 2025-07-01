import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetEmailQuery } from 'services/api/emails';

import { ItemDate, ItemRecipients } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import EmailHeader from './email-navigation';

const Email = () => {
  const columns = [
    {
      Header: 'From',
      accessor: 'from',
      minWidth: 200,
    },
    {
      Header: 'Subject',
      accessor: 'subject',
      minWidth: 300,
    },
    {
      Header: 'To',
      accessor: 'recipient_emails',
      Cell: ItemRecipients,
    },
    {
      Header: 'Date',
      accessor: 'created_at',
      Cell: ItemDate,
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
      useData={useGetEmailQuery}
      pageHeader={<EmailHeader />}
      newRecordButtonPermission={PERMISSIONS.COMMUNICATION}
      handleCreateNewRecord={() => redirect(`create`)}
      newRecordButtonText="Compose"
      onRowClick={row => {
        if (row.original) {
          if ('id' in row.original) {
            const email_id = row.original['id'];
            redirect(`details/${email_id}`);
          }
        }
      }}
    />
  );
};

export default Email;
