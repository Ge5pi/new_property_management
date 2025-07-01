import { Fragment, useState } from 'react';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import { Row as ReactTableRow } from 'react-table';

import { utils, writeFile } from 'xlsx';

import { exportInventory } from 'api/import-export';
import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateBulkInventoryMutation,
  useCreateInventoryMutation,
  useDeleteInventoryMutation,
  useGetInventoryQuery,
  useUpdateInventoryMutation,
} from 'services/api/inventory';
import { useCreateInventoryLocationMutation, useCreateInventoryTypeMutation } from 'services/api/system-preferences';

import { Confirmation, PleaseWait } from 'components/alerts';
import { ItemPrice } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';
import MoreOptions from 'components/table/more-options';

import { ImportIcon } from 'core-ui/icons';
import { ImportModal, InventoryImport } from 'core-ui/popups/import-modal';
import { InventoryModal } from 'core-ui/popups/inventory';
import { PleaseWaitDialog } from 'core-ui/popups/please-wait';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';
import { getReadableError } from 'utils/functions';

import { IImportInventoryItems, IInventoryAPI, ISingleInventory } from 'interfaces/IInventory';

import InventoryWrapper from './inventory-wrapper';

import '../maintenance.styles.css';

const Inventory = () => {
  const { redirect } = useRedirect();

  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      minWidth: 200,
    },
    {
      Header: 'Quantity',
      accessor: 'quantity',
    },
    {
      Header: 'Cost',
      accessor: 'cost',
      Cell: ItemPrice,
    },
    {
      Header: 'Category',
      accessor: 'item_type_name',
    },
    {
      Header: 'Location',
      accessor: 'location_name',
    },
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: InventoryActions,
      disableSortBy: true,
      sticky: 'right',
      minWidth: 0,
    },
  ];

  const [createInventoryType, { isError: isCreateInventoryTypeError, error: createInventoryTypeError }] =
    useCreateInventoryTypeMutation();

  useResponse({
    isError: isCreateInventoryTypeError,
    error: createInventoryTypeError,
  });

  const [createInventoryLocation, { isError: isCreateInventoryLocationError, error: createInventoryLocationError }] =
    useCreateInventoryLocationMutation();

  useResponse({
    isError: isCreateInventoryLocationError,
    error: createInventoryLocationError,
  });

  const [
    createInventory,
    { isSuccess: isCreateInventorySuccess, isError: isCreateInventoryError, error: createInventoryError },
  ] = useCreateInventoryMutation();

  useResponse({
    isSuccess: isCreateInventorySuccess,
    successTitle: 'New Inventory Item has been added',
    isError: isCreateInventoryError,
    error: createInventoryError,
  });

  const [
    createBulkInventory,
    { isSuccess: isCreateBulkInventorySuccess, isError: isCreateBulkInventoryError, error: createBulkInventoryError },
  ] = useCreateBulkInventoryMutation();

  useResponse({
    isSuccess: isCreateBulkInventorySuccess,
    successTitle: 'Inventory Items has been added',
    isError: isCreateBulkInventoryError,
    error: createBulkInventoryError,
  });

  const handleInventory = async (values: IInventoryAPI) => {
    return await createInventory(values);
  };

  const [loading, setLoading] = useState(false);
  const downloadTemplate = () => {
    setLoading(true);
    Promise.resolve()
      .then(() => {
        const link = document.createElement('a');
        link.href = `/template/inventory-items-template.xls`;
        link.download = `inventory-items-template.xls`;
        link.click();
        window.URL.revokeObjectURL(link.href);
      })
      .catch(error => {
        Notify.show({
          type: 'danger',
          title: 'Something went wrong, unable to download template file.',
          description: getReadableError(error),
        });
      })
      .finally(() => setLoading(false));
  };
  const onImportClick = () => {
    SweetAlert({
      html: (
        <ImportModal
          modalTitle="Import Inventory Items"
          handleDownload={downloadTemplate}
          keys={['Name', 'Description', 'Part Number', 'Bin or Shelf Number', 'Quantity', 'Cost']}
        />
      ),
    })
      .fire({
        allowOutsideClick: () => !SwalExtended.isLoading(),
      })
      .then(result => {
        if (result.isConfirmed && result.value) {
          const values = (result.value as Partial<IImportInventoryItems>[]).map(val => ({
            name: val['Name'],
            description: val['Description'],
            part_number: val['Part Number'],
            bin_or_shelf_number: val['Bin or Shelf Number'],
            quantity: val['Quantity'],
            cost: val['Cost'],
          }));

          SweetAlert({
            html: (
              <InventoryImport
                importValues={values}
                createBulkInventory={createBulkInventory}
                createInventoryLocation={createInventoryLocation}
                createInventoryType={createInventoryType}
              />
            ),
            size: 'xl',
          }).fire({
            allowOutsideClick: false,
          });
        }
      });
  };

  const onExportClick = (exportType: 'xlsx' | 'csv') => {
    setLoading(true);
    exportInventory()
      .then(response => {
        const todayDate = new Date().toLocaleDateString().replaceAll('/', '-');
        const todayTime = new Date().toLocaleTimeString().replaceAll(':', '-');

        const inventory = (response.data as ISingleInventory[]).map(inv => ({
          name: inv.name,
          item_type: inv.item_type ? `${inv.item_type.name}` : '-',
          description: inv.description,
          part_number: inv.part_number,
          vendor: inv.vendor ? `${inv.vendor.first_name} ${inv.vendor.last_name}` : '-',
          location: inv.location ? `${inv.location.name}` : '-',
          bin_or_shelf_number: inv.bin_or_shelf_number,
          quantity: inv.quantity,
          cost: `$${inv.cost ? Number(inv.cost).toFixed(2) : '-'}`,
        }));
        const headings = [
          'Name',
          'Item Type',
          'Description',
          'Part Number',
          'Vendor',
          'Location',
          'Bin or Shelf Number',
          'Quantity',
          'Cost',
        ];

        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, [headings]);
        utils.sheet_add_json(ws, inventory, { origin: 'A2', skipHeader: true });
        utils.book_append_sheet(wb, ws, 'Record');
        writeFile(wb, `export-inventory-items-${todayDate} at ${todayTime}.${exportType}`, { bookType: exportType });
      })
      .catch(error => {
        Notify.show({
          type: 'danger',
          title: 'Something went wrong, unable to export data',
          description: getReadableError(error),
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Fragment>
      <InventoryWrapper>
        {(filterValue, component) => (
          <TableWithPagination
            clickable
            columns={columns}
            pageHeader={'Inventory'}
            useData={useGetInventoryQuery}
            filterMenu={component}
            filterValues={{ ...filterValue }}
            newRecordButtonPermission={PERMISSIONS.MAINTENANCE}
            handleCreateNewRecord={() => {
              SweetAlert({
                html: (
                  <InventoryModal
                    createInventoryLocation={createInventoryLocation}
                    createInventoryType={createInventoryType}
                    createInventory={handleInventory}
                  />
                ),
                size: 'lg',
              }).fire({
                allowOutsideClick: () => !SwalExtended.isLoading(),
              });
            }}
            additionalActionButtons={
              <Row className="gx-2 align-items-center justify-content-end">
                <Col xs={'auto'}>
                  <Button
                    variant={'outline-primary'}
                    size="sm"
                    className="btn-search-adjacent-sm"
                    onClick={onImportClick}
                  >
                    <ImportIcon />
                    <span className="d-md-block d-none mx-1">Import</span>
                  </Button>
                </Col>
                <Col xs={'auto'}>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-primary"
                      className="btn-search-adjacent-sm"
                      id={`export-data-inventory}`}
                      size="sm"
                    >
                      Export
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="stay-on-top">
                      <Dropdown.Item onClick={() => onExportClick('xlsx')}>Excel</Dropdown.Item>
                      <Dropdown.Item onClick={() => onExportClick('csv')}>CSV</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            }
            onRowClick={row => {
              if (row.original) {
                if ('id' in row.original) {
                  const inventory_id = row.original['id'];
                  redirect(`details/${inventory_id}`);
                }
              }
            }}
          />
        )}
      </InventoryWrapper>
      <PleaseWaitDialog show={loading} />
    </Fragment>
  );
};

const InventoryActions = ({ row }: { row: ReactTableRow }) => {
  const [createInventoryType, { isError: isCreateInventoryTypeError, error: createInventoryTypeError }] =
    useCreateInventoryTypeMutation();

  useResponse({
    isError: isCreateInventoryTypeError,
    error: createInventoryTypeError,
  });

  const [createInventoryLocation, { isError: isCreateInventoryLocationError, error: createInventoryLocationError }] =
    useCreateInventoryLocationMutation();

  useResponse({
    isError: isCreateInventoryLocationError,
    error: createInventoryLocationError,
  });

  // update Inventory
  const [
    updateInventory,
    { isSuccess: isUpdatedInventorySuccess, isError: isUpdatedInventoryError, error: updatedInventoryError },
  ] = useUpdateInventoryMutation();

  useResponse({
    isSuccess: isUpdatedInventorySuccess,
    successTitle: 'Inventory has been successfully updated!',
    isError: isUpdatedInventoryError,
    error: updatedInventoryError,
  });

  const [
    deleteInventoryByID,
    { isSuccess: isDeleteInventorySuccess, isError: isDeleteInventoryError, error: deleteInventoryError },
  ] = useDeleteInventoryMutation();

  useResponse({
    isSuccess: isDeleteInventorySuccess,
    successTitle: 'You have deleted an Inventory',
    isError: isDeleteInventoryError,
    error: deleteInventoryError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      type: 'danger',
      title: 'Inventory cannot be deleted',
      description: 'the item has been installed in one of Property/Unit. Are you sure you want to continue?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deleteInventoryByID(id).finally(() => {
          SwalExtended.close();
          setDisabled(false);
        });
      }
    });
  };

  const handleInventoryUpdate = async (values: Partial<IInventoryAPI>) => {
    return await updateInventory(values);
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
            const row1 = row.original as ISingleInventory;
            if (row1.id) {
              SweetAlert({
                html: (
                  <InventoryModal
                    data={row1}
                    createInventoryLocation={createInventoryLocation}
                    createInventoryType={createInventoryType}
                    updateInventory={handleInventoryUpdate}
                    update
                  />
                ),
                size: 'lg',
              }).fire({
                allowOutsideClick: () => !SwalExtended.isLoading(),
              });
            }
          },
        },
        {
          disabled,
          text: 'Delete',
          permission: PERMISSIONS.MAINTENANCE,
          onClick: () => {
            const row1 = row.original as ISingleInventory;
            if (row1.id) {
              deleteRecord(row1.id);
            }
          },
        },
      ]}
    />
  );
};

export default Inventory;
