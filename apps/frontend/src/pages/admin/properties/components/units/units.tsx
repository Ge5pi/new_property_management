import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { useGetUnitsQuery } from 'services/api/units';

import { ListingWithPagination } from 'components/listing';

import { UnitsModal } from 'core-ui/popups/units';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { IListUnits } from 'interfaces/IUnits';

import { SingleUnit } from '../common/single-unit';

interface IProps {
  isMain?: boolean;
}

interface ICellProp {
  value: IListUnits;
}

const Units = ({ isMain = true }: IProps) => {
  const { property: property_id } = useParams();
  const { redirect } = useRedirect();

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (isMain) {
      const pageNumber = searchParams.get('page');
      searchParams.set('page', pageNumber ?? '1');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, isMain]);

  return (
    <ListingWithPagination
      clickable
      columns={[
        {
          Header: '',
          accessor: 'original',
          Cell: ({ value }: ICellProp) => <SingleUnit unit={value} />,
        },
      ]}
      pageHeader={
        isMain && <h6 className="fw-bold mt-1 mb-0 text-capitalize">{isMain ? 'List of all units' : 'Units'}</h6>
      }
      searchable={isMain}
      titleAndTotalInline={false}
      useData={useGetUnitsQuery}
      showHeaderInsideContainer={isMain}
      hideMainHeaderComponent={!isMain}
      saveValueInState={!isMain}
      showTotal={isMain}
      hidePagination={!isMain}
      classes={{ body: !isMain ? 'p-0' : '' }}
      defaultPageSize={isMain ? 10 : 3}
      filterValues={{ parent_property: Number(property_id) }}
      newRecordButtonPermission={PERMISSIONS.PROPERTY}
      handleCreateNewRecord={() => {
        if (property_id) {
          SweetAlert({
            size: 'xl',
            html: <UnitsModal property={property_id} />,
          })
            .fire({
              allowOutsideClick: () => !SwalExtended.isLoading(),
            })
            .then(result => {
              if (result.isConfirmed && result.value) {
                redirect(`/admin/properties/${property_id}/units/details/${result.value.unit}`, false, 'admin');
              }
            });
        }
      }}
      onRowClick={row => {
        if (row.original) {
          const unit = row.original as { original: IListUnits };
          redirect(`/admin/properties/${property_id}/units/details/${unit.original.id}`, false, 'admin');
        }
      }}
    />
  );
};

export default Units;
