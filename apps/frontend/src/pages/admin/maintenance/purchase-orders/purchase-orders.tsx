import { useState } from 'react';
import { Row as ReactTableRow } from 'react-table';

import useResponse from 'services/api/hooks/useResponse';
import { useDeletePurchaseOrderMutation, useGetPurchaseOrdersQuery } from 'services/api/purchase-orders';

import { Confirmation, PleaseWait } from 'components/alerts';
import { ItemDate, ItemPrice, ItemSlug } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';
import MoreOptions from 'components/table/more-options';

import { SwalExtended } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { IPurchaseOrder } from 'interfaces/IMaintenance';

import PurchaseOrderWrapper from './purchase-order-wrapper';

import './../maintenance.styles.css';

const PurchaseOrders = () => {
  const columns = [
    {
      Header: 'Order Number',
      accessor: 'slug',
      Cell: ItemSlug,
    },
    {
      Header: 'Vendor',
      accessor: 'vendor_name',
      minWidth: 200,
    },
    {
      Header: 'Amount',
      accessor: 'total',
      Cell: ItemPrice,
    },
    {
      Header: 'Created',
      accessor: 'created_at',
      Cell: ItemDate,
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: PurchaseOrderActions,
      disableSortBy: true,
      sticky: 'right',
      minWidth: 0,
    },
  ];

  const { redirect } = useRedirect();

  return (
    <PurchaseOrderWrapper>
      {(filterValue, component) => (
        <TableWithPagination
          clickable
          columns={columns}
          filterMenu={component}
          filterValues={{ ...filterValue }}
          useData={useGetPurchaseOrdersQuery}
          pageHeader="Purchase Orders"
          newRecordButtonPermission={PERMISSIONS.MAINTENANCE}
          handleCreateNewRecord={() => redirect(`create`)}
          onRowClick={row => {
            if (row.original) {
              if ('id' in row.original) {
                const purchase = row.original['id'];
                redirect(`details/${purchase}`);
              }
            }
          }}
        />
      )}
    </PurchaseOrderWrapper>
  );
};

const PurchaseOrderActions = ({ row }: { row: ReactTableRow }) => {
  const { redirect } = useRedirect();
  const [
    deletePurchaseOrderByID,
    { isSuccess: isDeletePurchaseOrderSuccess, isError: isDeletePurchaseOrderError, error: deletePurchaseOrderError },
  ] = useDeletePurchaseOrderMutation();

  useResponse({
    isSuccess: isDeletePurchaseOrderSuccess,
    successTitle: 'You have deleted a Purchase Order',
    isError: isDeletePurchaseOrderError,
    error: deletePurchaseOrderError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      type: 'danger',
      description: 'Are you sure you want to delete this record?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deletePurchaseOrderByID(id).finally(() => {
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
          permission: PERMISSIONS.MAINTENANCE,
          onClick: () => {
            const row1 = row.original as IPurchaseOrder;
            if (row1.id) {
              redirect(`modify/${row1.id}`);
            }
          },
        },
        {
          disabled,
          text: 'Delete',
          permission: PERMISSIONS.MAINTENANCE,
          onClick: () => {
            const row1 = row.original as IPurchaseOrder;
            if (row1.id) {
              deleteRecord(row1.id);
            }
          },
        },
      ]}
    />
  );
};

export default PurchaseOrders;
