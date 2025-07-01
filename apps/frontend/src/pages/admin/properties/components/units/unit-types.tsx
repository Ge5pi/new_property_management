import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { useGetUnitTypesQuery } from 'services/api/unit-types';

import { ListingWithPagination } from 'components/listing';

import { UnitTypesModal } from 'core-ui/popups/units';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { IListUnitTypes } from 'interfaces/IUnits';

import SingleUnitType from './single-unit-type';

interface ICellProp {
  value: IListUnitTypes;
}

const UnitType = () => {
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
          Cell: ({ value }: ICellProp) => <SingleUnitType unitType={value} />,
        },
      ]}
      pageHeader={<h6 className="fw-bold mt-1 mb-0 text-capitalize">List of all Unit Types</h6>}
      titleAndTotalInline={false}
      useData={useGetUnitTypesQuery}
      showHeaderInsideContainer
      filterValues={{ parent_property: Number(property_id) }}
      handleCreateNewRecord={() => {
        if (property_id) {
          SweetAlert({
            size: 'lg',
            html: <UnitTypesModal property={property_id} />,
          })
            .fire({
              allowOutsideClick: () => !SwalExtended.isLoading(),
            })
            .then(result => {
              if (result.isConfirmed && result.value) {
                redirect(`/admin/properties/${property_id}/unit-types/details/${result.value}`, false, 'admin');
              }
            });
        }
      }}
      onRowClick={row => {
        if (row.original) {
          const row1 = row.original as { original: IListUnitTypes };
          redirect(`/admin/properties/${property_id}/unit-types/details/${row1.original.id}`, false, 'admin');
        }
      }}
    />
  );
};

export default UnitType;
