import { useMemo } from 'react';
import { Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Row as ReactTableRow } from 'react-table';

import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateOwnersForPropertyMutation,
  useGetOwnersForPropertyQuery,
  useUpdatePropertyOwnerMutation,
} from 'services/api/properties';

import { ItemDate, ItemPercentage, ItemUserName } from 'components/custom-cell';
import { SimpleTable } from 'components/table';

import { EditBtn } from 'core-ui/edit-button';
import { OwnerFinancialModal } from 'core-ui/popups/owner-financial';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { PERMISSIONS } from 'constants/permissions';
import { getValidID } from 'utils/functions';

import { IPropertyOwner } from 'interfaces/IProperties';

const OwnersFinancial = () => {
  const { property: property_id } = useParams();
  const { data = [], ...rest } = useGetOwnersForPropertyQuery(getValidID(property_id));

  // create owner
  const [
    createOwnerProperty,
    { isSuccess: isCreateOwnerPropertySuccess, isError: isCreateOwnerPropertyError, error: createOwnerPropertyError },
  ] = useCreateOwnersForPropertyMutation();

  useResponse({
    isSuccess: isCreateOwnerPropertySuccess,
    successTitle: 'Owner has been successfully added',
    isError: isCreateOwnerPropertyError,
    error: createOwnerPropertyError,
  });

  const max_percentage = useMemo(() => {
    const total = data.reduce((total: number, obj: IPropertyOwner) => obj.percentage_owned + total, 0);
    return total <= 0 ? 100 : 100 - total;
  }, [data]);

  const columns = [
    {
      Header: 'Owner',
      accessor: 'owner_info',
      Cell: ItemUserName,
      minWidth: 200,
    },
    {
      Header: 'Percentage Owned',
      accessor: 'percentage_owned',
      Cell: ItemPercentage,
    },
    {
      Header: 'Contract Expiry',
      accessor: 'contract_expiry',
      Cell: ItemDate,
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: ({ row }: { row: ReactTableRow }) => <OwnerActions row={row} percentage={max_percentage} />,
      disableSortBy: true,
      sticky: 'right',
      minWidth: 0,
    },
  ];

  return (
    <div className="min-h-100 page-section">
      <SimpleTable
        {...rest}
        data={data}
        shadow={false}
        showTotal={false}
        wrapperClass="detail-section-table"
        newRecordButtonPermission={PERMISSIONS.PROPERTY}
        showHeaderInsideContainer
        pageHeader={<p className="fw-bold m-0 text-primary">Owners Financial</p>}
        columns={columns}
        handleCreateNewRecord={() => {
          if (max_percentage <= 0 || max_percentage > 100) {
            Notify.show({
              type: 'info',
              title: 'Operation not available',
              description: 'This property is already been owned 100% by its owners',
            });

            return;
          }

          SweetAlert({
            size: 'lg',
            html: (
              <OwnerFinancialModal
                createPropertyOwner={createOwnerProperty}
                property={Number(property_id)}
                maxPercentage={max_percentage}
              />
            ),
          }).fire({
            allowOutsideClick: () => !SwalExtended.isLoading(),
          });
        }}
      />
    </div>
  );
};

const OwnerActions = ({ row, percentage = 100 }: { row: ReactTableRow; percentage?: number }) => {
  const { property: property_id } = useParams();

  // update owner
  const [
    updateOwnerProperty,
    { isSuccess: isUpdateOwnerPropertySuccess, isError: isUpdateOwnerPropertyError, error: updateOwnerPropertyError },
  ] = useUpdatePropertyOwnerMutation();

  useResponse({
    isSuccess: isUpdateOwnerPropertySuccess,
    successTitle: 'Owner details has been successfully updated!',
    isError: isUpdateOwnerPropertyError,
    error: updateOwnerPropertyError,
  });

  if (row.original) {
    if ('id' in row.original) {
      return (
        <Stack direction="horizontal" className="action-btns justify-content-around" gap={1}>
          <EditBtn
            showText={false}
            permission={PERMISSIONS.PROPERTY}
            onClick={() => {
              const owner = row.original as IPropertyOwner;
              if (owner.id) {
                SweetAlert({
                  size: 'lg',
                  html: (
                    <OwnerFinancialModal
                      update={true}
                      owner={owner}
                      updatePropertyOwner={updateOwnerProperty}
                      property={Number(property_id)}
                      maxPercentage={percentage + (owner.percentage_owned ?? 0)}
                    />
                  ),
                }).fire({
                  allowOutsideClick: () => !SwalExtended.isLoading(),
                });
              }
            }}
          />
        </Stack>
      );
    }
  }

  return null;
};

export default OwnersFinancial;
