import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetTenantContactsQuery } from 'services/api/tenants/contacts';

import { TableWithPagination } from 'components/table';

import { ViewContact } from 'core-ui/popups/view-contact';
import { SweetAlert } from 'core-ui/sweet-alert';

import { ISingleContact } from 'interfaces/ICommunication';

const Contacts = () => {
  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      minWidth: 200,
    },
    {
      Header: 'Category',
      accessor: 'category_name',
      minWidth: 200,
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Primary number',
      accessor: 'primary_contact',
    },
  ];

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
      useData={useGetTenantContactsQuery}
      pageHeader={'Contacts'}
      onRowClick={row => {
        if (row.original) {
          SweetAlert({
            size: 'xl',
            html: <ViewContact contact={row.original as ISingleContact} />,
          }).fire();
        }
      }}
    />
  );
};

export default Contacts;
