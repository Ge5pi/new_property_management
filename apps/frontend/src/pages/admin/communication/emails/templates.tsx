import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetEmailTemplatesQuery } from 'services/api/email-template';

import { ItemDate } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import EmailHeader from './email-navigation';

const EmailTemplates = () => {
  const columns = [
    {
      Header: 'Category',
      accessor: 'recipient_type',
      minWidth: 200,
    },
    {
      Header: 'Subject',
      accessor: 'subject',
      minWidth: 300,
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
      pageHeader={<EmailHeader />}
      newRecordButtonPermission={PERMISSIONS.COMMUNICATION}
      useData={useGetEmailTemplatesQuery}
      handleCreateNewRecord={() => redirect(`create`)}
      onRowClick={row => {
        if (row.original) {
          if ('id' in row.original) {
            const template_id = row.original['id'];
            redirect(`details/${template_id}`);
          }
        }
      }}
    />
  );
};

export default EmailTemplates;
