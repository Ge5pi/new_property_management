import { useParams } from 'react-router-dom';

import { useGetFixedAssetsQuery } from 'services/api/fixed-assets';

import { ItemDate, ItemName, ItemStatus } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';

import { FixedAssetsModal } from 'core-ui/popups/fixed-assets';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { PERMISSIONS } from 'constants/permissions';

const FixedAssets = () => {
  const { property: property_id } = useParams();
  const columns = [
    {
      Header: 'Asset ID',
      accessor: 'asset',
      Cell: ItemName,
    },
    {
      Header: 'Place In Service',
      accessor: 'placed_in_service_date',
      Cell: ItemDate,
    },
    {
      Header: 'Warranty',
      accessor: 'warranty_expiration_date',
      Cell: ItemDate,
    },
    {
      Header: 'Status',
      accessor: 'status_with_obj',
      Cell: ItemStatus,
    },
  ];

  return (
    <TableWithPagination
      saveValueInState
      columns={columns}
      useData={useGetFixedAssetsQuery}
      shadow={false}
      showTotal={false}
      defaultPageSize={5}
      wrapperClass="detail-section-table page-section"
      filterValues={{ unit__parent_property: property_id }}
      showHeaderInsideContainer
      searchable={false}
      pageHeader={<p className="fw-bold m-0 text-primary">Fixed Assets</p>}
      newRecordButtonPermission={PERMISSIONS.MAINTENANCE}
      handleCreateNewRecord={() => {
        SweetAlert({
          html: <FixedAssetsModal parent_property__id={Number(property_id)} />,
          size: 'lg',
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
    />
  );
};

export default FixedAssets;
