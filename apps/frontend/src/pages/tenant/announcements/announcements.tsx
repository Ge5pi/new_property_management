import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetTenantsAnnouncementsQuery } from 'services/api/tenants/announcements';

import { ItemDate } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';

import { useRedirect } from 'hooks/useRedirect';

const Announcements = () => {
  const columns = [
    {
      Header: 'Announcement Title',
      accessor: 'title',
      minWidth: 200,
    },
    {
      Header: 'Date',
      accessor: 'display_date',
      Cell: ItemDate,
    },
    {
      Header: 'Expiry',
      accessor: 'expiry_date',
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
      useData={useGetTenantsAnnouncementsQuery}
      pageHeader={'Announcements'}
      onRowClick={row => {
        if (row.original) {
          if ('id' in row.original) {
            const announcement_id = row.original['id'];
            redirect(`details/${announcement_id}`);
          }
        }
      }}
    />
  );
};

export default Announcements;
