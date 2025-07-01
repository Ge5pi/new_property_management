import { useState } from 'react';
import { Row as ReactTableRow } from 'react-table';

import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateVendorTypesMutation,
  useDeleteVendorTypeMutation,
  useGetVendorTypesQuery,
  useUpdateVendorTypesMutation,
} from 'services/api/vendor-types';

import { Confirmation, PleaseWait } from 'components/alerts';
import { ItemSlug } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';
import MoreOptions from 'components/table/more-options';

import { NewVendorTypeModal } from 'core-ui/popups/new-type';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { PERMISSIONS } from 'constants/permissions';

import { IVendorType } from 'interfaces/IPeoples';

import VendorHeader from './vendor-navigation';

const VendorTypes = () => {
  // create VendorTypes
  const [
    createVendorType,
    { isSuccess: isCreateVendorTypesSuccess, isError: isCreateVendorTypesError, error: createVendorTypeError },
  ] = useCreateVendorTypesMutation();

  useResponse({
    isSuccess: isCreateVendorTypesSuccess,
    successTitle: 'New vendor type added!',
    isError: isCreateVendorTypesError,
    error: createVendorTypeError,
  });

  const columns = [
    {
      Header: 'ID',
      accessor: 'slug',
      Cell: ItemSlug,
    },
    {
      Header: 'Title',
      accessor: 'name',
      minWidth: 200,
    },
    {
      Header: 'Description',
      accessor: 'description',
      minWidth: 300,
    },
    {
      Header: 'No. of vendors',
      accessor: 'vendor_count',
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: VendorTypeActions,
      disableSortBy: true,
      sticky: 'right',
      minWidth: 0,
    },
  ];

  return (
    <TableWithPagination
      columns={columns}
      useData={useGetVendorTypesQuery}
      pageHeader={<VendorHeader />}
      newRecordButtonPermission={PERMISSIONS.PEOPLE}
      handleCreateNewRecord={() => {
        SweetAlert({
          html: <NewVendorTypeModal createVendorType={createVendorType} />,
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
    />
  );
};

const VendorTypeActions = ({ row }: { row: ReactTableRow }) => {
  // update VendorTypes
  const [
    updateVendorType,
    { isSuccess: isUpdateVendorTypesSuccess, isError: isUpdateVendorTypesError, error: updateVendorTypeError },
  ] = useUpdateVendorTypesMutation();

  useResponse({
    isSuccess: isUpdateVendorTypesSuccess,
    successTitle: 'Vendor Type has been successfully updated!',
    isError: isUpdateVendorTypesError,
    error: updateVendorTypeError,
  });

  const [
    deleteVendorTypeByID,
    { isSuccess: isDeleteVendorTypeSuccess, isError: isDeleteVendorTypeError, error: deleteVendorTypeError },
  ] = useDeleteVendorTypeMutation();

  useResponse({
    isSuccess: isDeleteVendorTypeSuccess,
    successTitle: 'Vendor Type has been deleted',
    isError: isDeleteVendorTypeError,
    error: deleteVendorTypeError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      title: 'Delete',
      type: 'danger',
      description: 'Are you sure you want to delete this record?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deleteVendorTypeByID(id).finally(() => {
          SwalExtended.close();
          setDisabled(false);
        });
      }
    });
  };

  return (
    <MoreOptions
      className="text-center"
      actions={[
        {
          disabled,
          text: 'Edit',
          permission: PERMISSIONS.PEOPLE,
          onClick: () => {
            const row1 = row.original as IVendorType;
            if (row1.id) {
              SweetAlert({
                html: <NewVendorTypeModal vendorType={row1} updateVendorType={updateVendorType} update />,
              }).fire({
                allowOutsideClick: () => !SwalExtended.isLoading(),
              });
            }
          },
        },
        {
          disabled,
          text: 'Delete',
          permission: PERMISSIONS.PEOPLE,
          onClick: () => {
            const row1 = row.original as IVendorType;
            if (row1.id) {
              deleteRecord(row1.id);
            }
          },
        },
      ]}
    />
  );
};

export default VendorTypes;
