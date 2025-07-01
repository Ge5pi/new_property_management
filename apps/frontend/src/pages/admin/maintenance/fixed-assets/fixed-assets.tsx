import { Fragment, useState } from 'react';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import { Row as ReactTableRow } from 'react-table';

import { clsx } from 'clsx';
import { ColInfo, utils, write, writeFile } from 'xlsx';

import { downloadTemplateFile, exportFixedAssets, exportInventory } from 'api/import-export';
import {
  useCreateBulkAssetsMutation,
  useDeleteFixedAssetsMutation,
  useGetFixedAssetsQuery,
} from 'services/api/fixed-assets';
import useResponse from 'services/api/hooks/useResponse';

import { Confirmation, PleaseWait } from 'components/alerts';
import { ItemDate, ItemName, ItemStatus } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';
import MoreOptions from 'components/table/more-options';

import { ImportIcon } from 'core-ui/icons';
import { FixedAssetsModal } from 'core-ui/popups/fixed-assets';
import { FixedAssetsImport, ImportModal } from 'core-ui/popups/import-modal';
import { PleaseWaitDialog } from 'core-ui/popups/please-wait';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { PERMISSIONS } from 'constants/permissions';
import { downloadZip, getReadableError } from 'utils/functions';

import { FixedAssetStatus, IFixedAssets, IImportFixedAssetsItems } from 'interfaces/IAssets';
import { IInventoryAPI } from 'interfaces/IInventory';
import { InventoryLocations } from 'interfaces/ISettings';

import FixedAssetWrapper from './fixed-assets-wrapper';

import './../maintenance.styles.css';

const FixedAssets = () => {
  const columns = [
    {
      Header: 'Asset ID',
      accessor: 'asset',
      Cell: ItemName,
    },
    {
      Header: 'Unit',
      accessor: 'property_unit',
      Cell: ItemName,
      minWidth: 200,
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
    {
      Header: () => <div className="text-center">Actions</div>,
      accessor: 'actions',
      Cell: FixedAssetsActions,
      disableSortBy: true,
      sticky: 'right',
      minWidth: 0,
    },
  ];

  const [
    createBulkFixedAssets,
    {
      isSuccess: isCreateBulkFixedAssetsSuccess,
      isError: isCreateBulkFixedAssetsError,
      error: createBulkFixedAssetsError,
    },
  ] = useCreateBulkAssetsMutation();

  useResponse({
    isSuccess: isCreateBulkFixedAssetsSuccess,
    successTitle: 'Fixed Assets Items has been added',
    isError: isCreateBulkFixedAssetsError,
    error: createBulkFixedAssetsError,
  });

  const [loading, setLoading] = useState(false);
  const downloadTemplate = () => {
    setLoading(true);
    Promise.all([exportInventory(), downloadTemplateFile('fixed-assets-template.xls')])
      .then(responses => {
        const data = (responses[0].data as IInventoryAPI[]).map(d => ({
          ID: d.id,
          Name: d.name,
          Location: d.location ? (d.location as InventoryLocations).name : 'N/A',
          Cost: d.cost,
          Quantity: d.quantity,
        }));

        const headings = ['ID', 'Name', 'Location', 'Cost', 'Quantity'];

        const wb = utils.book_new();
        const ws2 = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws2, [headings]);
        utils.sheet_add_json(ws2, data, { origin: 'A2', skipHeader: true });

        const colsWidth2 = [] as Array<ColInfo>;
        const template_data_sheet = data.length > 0 ? data[0] : { ID: 0, Name: '', Location: '', Cost: 0, Quantity: 0 };
        Object.keys(template_data_sheet).forEach(field => {
          colsWidth2.push({
            width: field === 'Name' || field === 'Location' ? 25 : field === 'Quantity' || field === 'Cost' ? 15 : 10,
          });
        });

        ws2['!cols'] = colsWidth2;
        utils.book_append_sheet(wb, ws2, 'Inventory Items');
        const u8 = write(wb, { type: 'array', bookType: 'xls' });
        const blob = new Blob([u8], { type: 'application/octet-stream' });
        return { blob, template: responses[1] };
      })
      .then(({ blob, template }) => downloadZip([template, blob], ['template-fixed-assets.xls', 'inventory-items.xls']))
      .then(content => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(content);
        link.download = `fixed-assets.zip`;
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
          modalTitle="Import Fixed Assets"
          handleDownload={downloadTemplate}
          keys={['Status', 'Inventory Item', 'Placed In Service Date', 'Expiration Date', 'Quantity']}
        />
      ),
    })
      .fire({
        allowOutsideClick: () => !SwalExtended.isLoading(),
      })
      .then(result => {
        if (result.isConfirmed && result.value) {
          const values = (result.value as Partial<IImportFixedAssetsItems>[]).map(val => ({
            status: val['Status'] as FixedAssetStatus,
            inventory_item: val['Inventory Item'],
            placed_in_service_date:
              typeof val['Placed In Service Date'] === 'number'
                ? new Date(Date.UTC(0, 0, Number(val['Placed In Service Date']) - 1, 0, 0, 0))
                    .toISOString()
                    .substring(0, 10)
                : '',
            warranty_expiration_date:
              typeof val['Expiration Date'] === 'number'
                ? new Date(Date.UTC(0, 0, Number(val['Expiration Date']) - 1, 0, 0, 0)).toISOString().substring(0, 10)
                : '',
            quantity: val['Quantity'],
          }));

          SweetAlert({
            html: <FixedAssetsImport importValues={values} createBulkFixedAssets={createBulkFixedAssets} />,
            size: 'xl',
          }).fire({
            allowOutsideClick: false,
          });
        }
      });
  };

  const onExportClick = (exportType: 'xlsx' | 'csv') => {
    setLoading(true);
    exportFixedAssets()
      .then(response => {
        const todayDate = new Date().toLocaleDateString().replaceAll('/', '-');
        const todayTime = new Date().toLocaleTimeString().replaceAll(':', '-');

        const assets = (response.data as IFixedAssets[]).map(a => ({
          slug: a.slug?.toUpperCase(),
          inventory_name: a.inventory_name,
          get_status_display: a.get_status_display,
          placed_in_service_date: a.placed_in_service_date,
          warranty_expiration_date: a.warranty_expiration_date,
          unit_name: a.unit_name,
          property_name: a.property_name,
          inventory_location: a.inventory_location ? a.inventory_location : '-',
          quantity: a.quantity,
          cost: `$${a.cost ? Number(a.cost).toFixed(2) : '-'}`,
          total_cost: `$${a.total_cost ? Number(a.total_cost).toFixed(2) : '-'}`,
        }));
        const headings = [
          'Slug',
          'Name',
          'Status',
          'Placed In Service Date',
          'Warranty Expiration Date',
          'Unit',
          'Property',
          'Location',
          'Quantity',
          'Cost',
          'Line Total',
        ];

        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, [headings]);
        utils.sheet_add_json(ws, assets, { origin: 'A2', skipHeader: true });
        utils.book_append_sheet(wb, ws, 'Record');
        writeFile(wb, `export-fixed-assets-${todayDate} at ${todayTime}.${exportType}`, { bookType: exportType });
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
      <FixedAssetWrapper>
        {(filterValues, component) => (
          <TableWithPagination
            columns={columns}
            pageHeader={'Fixed Assets'}
            useData={useGetFixedAssetsQuery}
            filterMenu={component}
            filterValues={{ ...filterValues }}
            newRecordButtonPermission={PERMISSIONS.MAINTENANCE}
            handleCreateNewRecord={() => {
              SweetAlert({
                html: <FixedAssetsModal />,
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
          />
        )}
      </FixedAssetWrapper>
      <PleaseWaitDialog show={loading} />
    </Fragment>
  );
};

const FixedAssetsActions = ({ row }: { row: ReactTableRow }) => {
  const [
    deleteFixedAssetsByID,
    { isSuccess: isDeleteFixedAssetsSuccess, isError: isDeleteFixedAssetsError, error: deleteFixedAssetsError },
  ] = useDeleteFixedAssetsMutation();

  useResponse({
    isSuccess: isDeleteFixedAssetsSuccess,
    successTitle: 'You have deleted an FixedAssets',
    isError: isDeleteFixedAssetsError,
    error: deleteFixedAssetsError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      type: 'danger',
      title: 'Fixed assets cannot be deleted',
      description: 'the item has been installed in one of Property/Unit. Are you sure you want to continue?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deleteFixedAssetsByID(id).finally(() => {
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
          text: 'Edit',
          permission: PERMISSIONS.MAINTENANCE,
          disabled: disabled || (row.original as IFixedAssets).status === 'installed',
          className: clsx({ 'd-none': (row.original as IFixedAssets).status === 'installed' }),
          onClick: () => {
            const row1 = row.original as IFixedAssets;
            if (row1.id && row1.status === 'in_storage') {
              SweetAlert({
                html: <FixedAssetsModal data={row1} update />,
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
            const row1 = row.original as IFixedAssets;
            if (row1.id) {
              deleteRecord(row1.id);
            }
          },
        },
      ]}
    />
  );
};

export default FixedAssets;
