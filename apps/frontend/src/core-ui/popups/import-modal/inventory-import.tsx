import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Col, Form, Row, Stack } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { CellProps, Column, useFilters, useGlobalFilter, useSortBy, useTable } from 'react-table';

import { FormikValues, useFormik } from 'formik';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { ItemInputItem, ItemMenuItem } from 'components/custom-cell';
import { Popup } from 'components/popup';
import GenericTable from 'components/table/generic-table';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { getReadableError, getStringPersonName, renderFormError } from 'utils/functions';

import { IIDName } from 'interfaces/IGeneral';
import { CustomOptionType } from 'interfaces/IInputs';
import { IImportProcessedInventoryItems, IInventoryAPI, ISingleInventory } from 'interfaces/IInventory';
import { IVendor } from 'interfaces/IPeoples';
import { InventoryLocations, InventoryType } from 'interfaces/ISettings';

const InventorySchema = Yup.object().shape({
  item_type: Yup.array().of(Yup.object().required('a valid selected option required!')).notRequired(),
  vendor: Yup.array().of(Yup.object().required('a valid selected option required!')).notRequired(),
  location: Yup.array().of(Yup.object().required('a valid selected option required!')).notRequired(),
});

interface IProps {
  importValues: Partial<IImportProcessedInventoryItems>[];
  createBulkInventory: GenericMutationTrigger<IInventoryAPI[], ISingleInventory[]>;
  createInventoryLocation: GenericMutationTrigger<IIDName, InventoryLocations>;
  createInventoryType: GenericMutationTrigger<IIDName, InventoryType>;
}

interface ICellProps<T> extends CellProps<IImportProcessedInventoryItems> {
  value: T;
}

const InventoryImport = ({
  importValues,
  createBulkInventory,
  createInventoryLocation,
  createInventoryType,
}: IProps) => {
  const [initialValues, updateInitialValues] = useState<Partial<IImportProcessedInventoryItems>[]>(importValues);

  const handleFormSubmission = async (values: FormikValues, tableValues: Partial<IImportProcessedInventoryItems>[]) => {
    const { vendor, location, item_type, ...rest } = values;

    let location_id = null;
    if (location && location.length > 0) {
      location_id = Number((location as Array<InventoryLocations>)[0].id);
      const selection_01 = location[0];
      if (typeof selection_01 !== 'string' && 'customOption' in selection_01) {
        await createInventoryLocation({ name: (selection_01 as CustomOptionType).name }).then(result => {
          if (result.data) {
            location_id = Number(result.data.id);
          } else {
            return result;
          }
        });
      }
    }

    let item_type_id = null;
    if (item_type && item_type.length > 0) {
      item_type_id = Number((item_type as Array<InventoryType>)[0].id);
      const selection_02 = item_type[0];
      if (typeof selection_02 !== 'string' && 'customOption' in selection_02) {
        await createInventoryType({ name: (selection_02 as CustomOptionType).name }).then(result => {
          if (result.data) {
            item_type_id = Number(result.data.id);
          } else {
            return result;
          }
        });
      }
    }

    let vendor_id = null;
    if (vendor && vendor.length > 0) {
      vendor_id = Number((vendor as Array<IVendor>)[0].id);
    }

    let api_data: Partial<IInventoryAPI> = {
      ...rest,
      expense_account: '15454589 98598956 6566',
    };

    if (vendor_id && vendor_id > 0) {
      api_data = {
        ...api_data,
        vendor: vendor_id,
      };
    }

    if (location_id && location_id > 0) {
      api_data = {
        ...api_data,
        location: location_id,
      };
    }

    if (item_type_id && item_type_id > 0) {
      api_data = {
        ...api_data,
        item_type: item_type_id,
      };
    }

    const data = tableValues.map(val => ({
      ...api_data,
      ...val,
    })) as IInventoryAPI[];

    return await createBulkInventory(data);
  };

  const { handleReset, handleSubmit, setFieldValue, values, setFieldTouched, errors, touched, isSubmitting } =
    useFormik({
      initialValues: {
        vendor: [] as Option[],
        location: [] as Option[],
        item_type: [] as Option[],
      },
      validationSchema: InventorySchema,
      enableReinitialize: true,
      onSubmit: (values, { setSubmitting, setFieldError }) => {
        setSubmitting(true);
        SwalExtended.showLoading();
        handleFormSubmission(values, initialValues)
          .then(result => {
            if (result.data) {
              SwalExtended.close();
            } else {
              const error = result.error as BaseQueryError;
              if (error.status === 400 && error.data) {
                const obj = Array.isArray(error.data) ? error.data[0] : error.data;
                renderFormError(obj, setFieldError);
              }
            }
          })
          .catch(error => {
            Notify.show({
              type: 'danger',
              title: 'Something went wrong, please check your input record',
              description: getReadableError(error),
            });
          })
          .finally(() => {
            setSubmitting(false);
            SwalExtended.hideLoading();
          });
      },
    });

  const onVendorSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('vendor', selected);
      } else {
        setFieldValue('vendor', []);
      }
    },
    [setFieldValue]
  );

  const onInvTypeSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('item_type', selected);
      } else {
        setFieldValue('item_type', []);
      }
    },
    [setFieldValue]
  );

  const onInvLocationSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('location', selected);
      } else {
        setFieldValue('location', []);
      }
    },
    [setFieldValue]
  );

  const columns = useMemo(() => {
    return [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value, row }: ICellProps<string>) => (
          <Form.Control
            name="name"
            className="w-75"
            onChange={ev => {
              updateInitialValues(prev => {
                const inx = prev.findIndex((f, i) => i === row.index);
                if (inx !== -1) {
                  prev[inx].name = ev.target.value;
                }
                return prev;
              });
            }}
            data-id={row.index}
            defaultValue={value}
          />
        ),
      },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: ({ value, row }: ICellProps<string>) => (
          <Form.Control
            name="description"
            className="w-75"
            onChange={ev => {
              updateInitialValues(prev => {
                const inx = prev.findIndex((f, i) => i === row.index);
                if (inx !== -1) {
                  prev[inx].description = ev.target.value;
                }
                return prev;
              });
            }}
            data-id={row.index}
            defaultValue={value}
          />
        ),
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
        Cell: ({ value, row }: ICellProps<number>) => (
          <Form.Control
            name="quantity"
            type="number"
            className="w-75"
            onChange={ev => {
              updateInitialValues(prev => {
                const inx = prev.findIndex((f, i) => i === row.index);
                if (inx !== -1) {
                  prev[inx].quantity = Number(ev.target.value);
                }
                return prev;
              });
            }}
            data-id={row.index}
            defaultValue={value}
          />
        ),
      },
      {
        Header: 'Cost',
        accessor: 'cost',
        Cell: ({ value, row }: ICellProps<number>) => (
          <Form.Control
            name="cost"
            type="number"
            className="w-75"
            onChange={ev => {
              updateInitialValues(prev => {
                const inx = prev.findIndex((f, i) => i === row.index);
                if (inx !== -1) {
                  prev[inx].cost = Number(ev.target.value);
                }
                return prev;
              });
            }}
            data-id={row.index}
            defaultValue={value}
          />
        ),
      },
      {
        Header: 'Part Number',
        accessor: 'part_number',
        Cell: ({ value, row }: ICellProps<string>) => (
          <Form.Control
            name="part_number"
            className="w-75"
            onChange={ev => {
              updateInitialValues(prev => {
                const inx = prev.findIndex((f, i) => i === row.index);
                if (inx !== -1) {
                  prev[inx].part_number = ev.target.value;
                }
                return prev;
              });
            }}
            data-id={row.index}
            defaultValue={value}
          />
        ),
      },
      {
        Header: 'Bin/Shelf Number',
        accessor: 'bin_or_shelf_number',
        Cell: ({ value, row }: ICellProps<string>) => (
          <Form.Control
            name="bin_or_shelf_number"
            className="w-75"
            onChange={ev => {
              updateInitialValues(prev => {
                const inx = prev.findIndex((f, i) => i === row.index);
                if (inx !== -1) {
                  prev[inx].bin_or_shelf_number = ev.target.value;
                }
                return prev;
              });
            }}
            data-id={row.index}
            defaultValue={value}
          />
        ),
      },
    ];
  }, []);

  const dataTable = useRef<HTMLTableElement | null>(null);
  const [list, setList] = useState({
    itemsDisplayed: 20,
    data: initialValues.slice(0, 20),
  });

  const onScroll = useCallback(() => {
    setList(prev => {
      if (prev.itemsDisplayed + 10 <= initialValues.length) {
        return {
          itemsDisplayed: prev.itemsDisplayed + 10,
          data: initialValues.slice(0, prev.itemsDisplayed + 10),
        };
      }

      return prev;
    });
  }, [initialValues]);

  useEffect(() => {
    const tableEl = dataTable.current;
    const handleScroll = (ev: Event) => {
      const { scrollHeight, scrollTop, clientHeight } = ev.target as HTMLDivElement;
      if (scrollHeight - scrollTop - clientHeight < 300) {
        onScroll();
      }
    };

    if (tableEl) {
      const tableWrapper = tableEl.parentElement;
      if (tableWrapper && tableWrapper.classList.contains('table-responsive')) {
        tableWrapper.addEventListener('scroll', handleScroll);
      }
    }

    return () => {
      if (tableEl) {
        const tableWrapper = tableEl.parentElement;
        if (tableWrapper && tableWrapper.classList.contains('table-responsive')) {
          tableWrapper.removeEventListener('scroll', handleScroll);
        }
      }
    };
  }, [onScroll]);

  useEffect(() => {
    if (onScroll) {
      const tableEl = dataTable.current;
      if (tableEl) {
        const tableWrapper = tableEl.parentElement;
        if (tableWrapper && tableWrapper.classList.contains('table-responsive')) {
          const { scrollHeight, scrollTop, clientHeight } = tableWrapper as HTMLDivElement;
          if (scrollHeight - scrollTop - clientHeight < 300) {
            onScroll();
          }
        }
      }
    }
  }, [onScroll]);

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns: columns as readonly Column<Partial<IImportProcessedInventoryItems>>[],
      data: list.data,
      manualFilters: true,
      manualGlobalFilter: true,
    },
    useGlobalFilter,
    useFilters,
    useSortBy
  );

  return (
    <Popup
      title={'Review Items import'}
      subtitle={'Please verify the information below before proceeding'}
      onSubmit={handleSubmit}
      onReset={handleReset}
      isSubmitting={isSubmitting}
      disabled={initialValues.length <= 0}
    >
      <Row className="gy-4 gx-md-4 gx-sm-1 gx-0 align-items-stretch">
        <Col md={4} sm={6} xs={12}>
          <FilterPaginateInput
            name="vendor"
            labelText={
              <Stack direction="horizontal" className="justify-content-between">
                <span className="popup-form-labels flex-fill">Vendor</span>
                <span className="text-muted small">Optional</span>
              </Stack>
            }
            controlId={`InventoryFormVendor`}
            placeholder={`Choose Vendor`}
            classNames={{
              labelClass: 'popup-form-labels w-100',
              wrapperClass: 'mb-3',
            }}
            selected={values.vendor}
            onSelectChange={onVendorSelected}
            onBlurChange={() => setFieldTouched('vendor', true)}
            isValid={touched.vendor && !errors.vendor}
            isInvalid={touched.vendor && !!errors.vendor}
            model_label="people.Vendor"
            filterBy={['first_name', 'last_name']}
            inputProps={{
              style: {
                paddingLeft: values.vendor.length > 0 ? `2.5rem` : '',
              },
            }}
            labelKey={option => getStringPersonName(option as IVendor)}
            renderMenuItemChildren={option => <ItemMenuItem option={option as IVendor} />}
            renderInput={(inputProps, { selected }) => {
              const option = selected.length > 0 ? (selected[0] as IVendor) : undefined;
              return <ItemInputItem {...inputProps} option={option} />;
            }}
            error={errors.vendor}
          />
        </Col>
        <Col md={4} sm={6} xs={12}>
          <FilterPaginateInput
            allowNew
            name="item_type"
            model_label="system_preferences.InventoryItemType"
            labelText={
              <Stack direction="horizontal" className="justify-content-between">
                <span className="popup-form-labels flex-fill">Item Type</span>
                <span className="text-muted small">Optional</span>
              </Stack>
            }
            placeholder="Type Here..."
            controlId={`InventoryFormType`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            selected={values.item_type}
            onSelectChange={onInvTypeSelected}
            onBlurChange={() => setFieldTouched('item_type', true)}
            isValid={touched.item_type && !errors.item_type}
            isInvalid={touched.item_type && !!errors.item_type}
            labelKey={`name`}
            searchIcon={false}
            error={errors.item_type}
          />
        </Col>
        <Col md={4} sm={6} xs={12}>
          <FilterPaginateInput
            allowNew
            name="location"
            model_label="system_preferences.InventoryLocation"
            labelText={
              <Stack direction="horizontal" className="justify-content-between">
                <span className="popup-form-labels flex-fill">Location</span>
                <span className="text-muted small">Optional</span>
              </Stack>
            }
            placeholder="Type Here..."
            controlId={`InventoryFormLocation`}
            classNames={{
              labelClass: 'popup-form-labels w-100',
              wrapperClass: 'mb-3',
            }}
            selected={values.location}
            onSelectChange={onInvLocationSelected}
            onBlurChange={() => setFieldTouched('location', true)}
            isValid={touched.location && !errors.location}
            isInvalid={touched.location && !!errors.location}
            labelKey={`name`}
            searchIcon={false}
            error={errors.location}
          />
        </Col>
      </Row>
      <GenericTable
        data={rows}
        ref={dataTable}
        shadow={false}
        wrapperClass="detail-section-table"
        total={rows.length}
        tableProps={{
          getTableProps,
          headerGroups,
          getTableBodyProps,
          prepareRow,
        }}
      />
    </Popup>
  );
};

export default InventoryImport;
