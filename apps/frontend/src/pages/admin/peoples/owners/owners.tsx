import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row as ReactTableRow } from 'react-table';

import { useGetOwnersQuery } from 'services/api/owners';

import { ItemUserName } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';
import MoreOptions from 'components/table/more-options';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { ISinglePeopleOwner } from 'interfaces/IPeoples';

const Owners = () => {
  const { redirect } = useRedirect();

  // TODO : Update any to object shape type in column custom cell components.
  const columns = [
    {
      Header: 'Owner Name',
      accessor: 'owner',
      Cell: ItemUserName,
      minWidth: 200,
    },
    {
      Header: 'Phone number',
      accessor: 'phone_number',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Company',
      accessor: 'company_name',
      minWidth: 200,
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: ({ row }: { row: ReactTableRow }) => (
        <MoreOptions
          className="text-center"
          actions={[
            {
              text: 'Edit',
              permission: PERMISSIONS.PEOPLE,
              onClick: () => {
                const row1 = row.original as ISinglePeopleOwner;
                if (row1.id) {
                  const owner_id = row1.id;
                  redirect(`${owner_id}/modify`);
                }
              },
            },
          ]}
        />
      ),
      disableSortBy: true,
      sticky: 'right',
      minWidth: 0,
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
      useData={useGetOwnersQuery}
      pageHeader={'Owner'}
      newRecordButtonPermission={PERMISSIONS.PEOPLE}
      handleCreateNewRecord={() => redirect(`create`)}
      onRowClick={row => {
        const row1 = row.original as ISinglePeopleOwner;
        if (row1.id) {
          const owner_id = row1.id;
          redirect(`${owner_id}/details`);
        }
      }}
    />
  );
};

export default Owners;
