import { useCallback, useState } from 'react';
import { Row as ReactTableRow } from 'react-table';

import useResponse from 'services/api/hooks/useResponse';
import {
  useDeleteInspectionAreaItemMutation,
  useGetInspectionAreaItemsQuery,
  useUpdateInspectionAreaItemsMutation,
} from 'services/api/inspections';

import { Confirmation, PleaseWait } from 'components/alerts';
import { SimpleTable } from 'components/table';
import RowActions from 'components/table/row-actions';

import { AddNewItem } from 'core-ui/popups/inspections';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { PERMISSIONS } from 'constants/permissions';
import { getValidID } from 'utils/functions';

import { IInspectionAreaItem } from 'interfaces/IInspections';

interface IRowProp {
  row: ReactTableRow;
}

const AreaItems = ({ area_id }: { area_id: number | string }) => {
  const { data = [], ...area_items } = useGetInspectionAreaItemsQuery(getValidID(area_id));

  const [
    updateAreaItem,
    {
      isSuccess: isUpdateInspectionAreaItemSuccess,
      isError: isUpdateInspectionAreaItemError,
      error: updateInspectionAreaItemError,
    },
  ] = useUpdateInspectionAreaItemsMutation();

  useResponse({
    isSuccess: isUpdateInspectionAreaItemSuccess,
    successTitle: 'Record has been successfully updated!',
    isError: isUpdateInspectionAreaItemError,
    error: updateInspectionAreaItemError,
  });

  const [
    deleteAreaItem,
    { isSuccess: isDeleteAreaItemSuccess, isError: isDeleteAreaItemError, error: deleteAreaItemError },
  ] = useDeleteInspectionAreaItemMutation();

  useResponse({
    isSuccess: isDeleteAreaItemSuccess,
    successTitle: 'Area Item has been deleted',
    isError: isDeleteAreaItemError,
    error: deleteAreaItemError,
  });

  const openEditDialog = useCallback(
    (data: IInspectionAreaItem) => {
      SweetAlert({
        html: <AddNewItem update={true} area={Number(area_id)} item={data} updateInspectionAreaItem={updateAreaItem} />,
      }).fire({
        allowOutsideClick: () => !SwalExtended.isLoading(),
      });
    },
    [area_id, updateAreaItem]
  );

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = useCallback(
    (id: string | number) => {
      Confirmation({
        title: 'Delete',
        type: 'danger',
        description: 'Are you sure you want to delete this record?',
      }).then(result => {
        if (result.isConfirmed) {
          PleaseWait();
          setDisabled(true);
          deleteAreaItem({ id, area_id }).finally(() => {
            SwalExtended.close();
            setDisabled(false);
          });
        }
      });
    },
    [deleteAreaItem, area_id]
  );

  const columns = [
    {
      Header: 'Item Name',
      accessor: 'name',
      disableSortBy: true,
      minWidth: 200,
    },
    {
      Header: 'Condition',
      accessor: 'condition',
      disableSortBy: true,
      Cell: ({ value }: { value: string }) => (
        <span className="text-capitalize"> {value.toLowerCase().replace(/_/g, ' ')} </span>
      ),
    },
    {
      Header: '',
      accessor: 'actions',
      Cell: ({ row }: IRowProp) => {
        const data = row.original as IInspectionAreaItem;
        return (
          <RowActions
            className="action-btns justify-content-center"
            actions={[
              {
                disabled,
                icon: 'delete',
                permission: PERMISSIONS.MAINTENANCE,
                onClick: () => deleteRecord(Number(data.id)),
              },
              {
                disabled,
                icon: 'edit',
                permission: PERMISSIONS.MAINTENANCE,
                onClick: () => openEditDialog(data),
              },
            ]}
          />
        );
      },
      disableSortBy: true,
      sticky: 'right',
      width: 100,
    },
  ];

  return (
    <SimpleTable
      {...area_items}
      data={data}
      shadow={false}
      showTotal={false}
      wrapperClass="detail-section-table"
      newRecordButtonPermission={PERMISSIONS.MAINTENANCE}
      hideMainHeaderComponent
      columns={columns}
    />
  );
};

export default AreaItems;
