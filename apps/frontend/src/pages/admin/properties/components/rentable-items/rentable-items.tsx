import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { useGetRentableItemsQuery } from 'services/api/rentable';

import { ListingWithPagination } from 'components/listing';

import { RentalItemModal } from 'core-ui/popups/rentable-items';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { IRentableItems } from 'interfaces/IRentableItems';

import SingleRentableItem from './single-rentable-item';

interface ICellProp {
  value: IRentableItems;
}

const RentableItems = () => {
  const { property: property_id } = useParams();
  const { redirect } = useRedirect();

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const pageNumber = searchParams.get('page');
    searchParams.set('page', pageNumber ?? '1');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return (
    <ListingWithPagination
      clickable
      newRecordButtonPermission={PERMISSIONS.PROPERTY}
      columns={[
        {
          Header: '',
          accessor: 'original',
          Cell: ({ value }: ICellProp) => <SingleRentableItem item={value} />,
        },
      ]}
      pageHeader={<h6 className="fw-bold mt-1 mb-0 text-capitalize">List of all Rentable items</h6>}
      titleAndTotalInline={false}
      useData={useGetRentableItemsQuery}
      showHeaderInsideContainer
      filterValues={{ parent_property: Number(property_id) }}
      handleCreateNewRecord={() => {
        if (property_id) {
          SweetAlert({
            size: 'lg',
            html: <RentalItemModal property_id={property_id} />,
          }).fire({
            allowOutsideClick: () => !SwalExtended.isLoading(),
          });
        }
      }}
      onRowClick={row => {
        if (row.original) {
          const row1 = row.original as { original: IRentableItems };
          redirect(`/rentable-items/details/${row1.original.id}`, false, 'rentable-items');
        }
      }}
    />
  );
};

export default RentableItems;
