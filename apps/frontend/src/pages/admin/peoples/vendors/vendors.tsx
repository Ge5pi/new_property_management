import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row as ReactTableRow } from 'react-table';

import { useGetVendorsQuery } from 'services/api/vendors';

import { ItemUserName } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';
import MoreOptions from 'components/table/more-options';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { IVendor } from 'interfaces/IPeoples';

import VendorHeader from './vendor-navigation';

const Vendors = () => {
  const { redirect } = useRedirect();
  const columns = [
    {
      Header: 'Vendor Name',
      accessor: 'vendor',
      Cell: ItemUserName,
      minWidth: 200,
    },
    {
      Header: 'Type',
      accessor: 'v_type',
      minWidth: 200,
    },
    {
      Header: 'Phone',
      accessor: 'phone_number',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Website',
      accessor: 'website',
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
                const row1 = row.original as IVendor;
                if (row1.id) {
                  const vendor_id = row1.id;
                  redirect(`${vendor_id}/modify`);
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
      useData={useGetVendorsQuery}
      pageHeader={<VendorHeader />}
      handleCreateNewRecord={() => redirect('create')}
      newRecordButtonPermission={PERMISSIONS.PEOPLE}
      onRowClick={row => {
        const row1 = row.original as IVendor;
        if (row1.id) {
          const vendor_id = row1.id;
          redirect(`${vendor_id}/general-details`);
        }
      }}
    />
  );
};

export default Vendors;
