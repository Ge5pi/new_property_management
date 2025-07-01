import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { CellProps, Column, useFilters, useGlobalFilter, useSortBy, useTable } from 'react-table';

import { FormikValues, useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';
import GenericTable from 'components/table/generic-table';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { getReadableError, getSearchFilter, renderFormError } from 'utils/functions';

import { FixedAssetStatus, IFixedAssets, IImportProcessedFixedAssetsItems } from 'interfaces/IAssets';
import { IPropertyAPI } from 'interfaces/IProperties';
import { IUnitsAPI } from 'interfaces/IUnits';

const AssetsSchema = Yup.object().shape({
  unit: yupFilterInput.required('This field is required!'),
  property_id: yupFilterInput.required('This field is required!'),
});

interface IProps {
  importValues: Partial<IImportProcessedFixedAssetsItems>[];
  createBulkFixedAssets: GenericMutationTrigger<IFixedAssets[], IFixedAssets[]>;
}

interface ICellProps<T> extends CellProps<IImportProcessedFixedAssetsItems> {
  value: T;
}

const FixedAssetsImport = ({ importValues, createBulkFixedAssets }: IProps) => {
  const [initialValues, updateInitialValues] = useState<Partial<IImportProcessedFixedAssetsItems>[]>(importValues);

  const handleFormSubmission = async (
    values: FormikValues,
    tableValues: Partial<IImportProcessedFixedAssetsItems>[]
  ) => {
    const { property_id, unit, ...rest } = values;

    let parent_property_id = 0;
    if (property_id && property_id.length > 0) {
      parent_property_id = Number((property_id as Array<IPropertyAPI>)[0].id);
    }

    let unit_id = 0;
    if (unit && unit.length > 0) {
      unit_id = Number((unit as Array<IUnitsAPI>)[0].id);
    }

    const form_data = {
      ...rest,
      property_id: parent_property_id,
      unit: unit_id,
    };

    const data = tableValues.map(val => ({
      ...form_data,
      ...val,
    })) as IFixedAssets[];

    return await createBulkFixedAssets(data);
  };

  const { handleReset, handleSubmit, setFieldValue, values, setFieldTouched, errors, touched, isSubmitting } =
    useFormik({
      initialValues: {
        unit: [] as Option[],
        property_id: [] as Option[],
      },
      validationSchema: AssetsSchema,
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

  const columns = useMemo(() => {
    return [
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value, row }: ICellProps<string>) => (
          <Form.Select
            name="status"
            className="w-75"
            onChange={ev => {
              updateInitialValues(prev => {
                const inx = prev.findIndex((f, i) => i === row.index);
                if (inx !== -1) {
                  prev[inx].status = ev.target.value as FixedAssetStatus;
                }
                return prev;
              });
            }}
            data-id={row.index}
            defaultValue={value}
          >
            <option value={'installed'}>Installed</option>
            <option value={'in_storage'}>In Storage</option>
          </Form.Select>
        ),
      },
      {
        Header: 'Inventory Item',
        accessor: 'inventory_item',
      },
      {
        Header: 'Placed In Service Date',
        accessor: 'placed_in_service_date',
        Cell: ({ value, row }: ICellProps<number>) => (
          <Form.Control
            type="date"
            className="w-75"
            name={'placed_in_service_date'}
            onChange={ev => {
              updateInitialValues(prev => {
                const inx = prev.findIndex((f, i) => i === row.index);
                if (inx !== -1) {
                  prev[inx].placed_in_service_date = new Date(ev.target.value).toISOString().substring(0, 10);
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
        Header: 'Expiration Date',
        accessor: 'warranty_expiration_date',
        Cell: ({ value, row }: ICellProps<number>) => (
          <Form.Control
            type="date"
            className="w-75"
            name={'warranty_expiration_date'}
            onChange={ev => {
              updateInitialValues(prev => {
                const inx = prev.findIndex((f, i) => i === row.index);
                if (inx !== -1) {
                  prev[inx].warranty_expiration_date = new Date(ev.target.value).toISOString().substring(0, 10);
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
      columns: columns as readonly Column<Partial<IImportProcessedFixedAssetsItems>>[],
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
            name="property_id"
            model_label="property.Property"
            labelText="Select Property"
            controlId={`FixedAssetImportFormProperty`}
            placeholder={`Select`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            selected={values.property_id}
            onSelectChange={selected => {
              if (selected.length) {
                setFieldValue('property_id', selected);
              } else {
                setFieldValue('property_id', []);
              }

              setFieldValue('unit', []);
            }}
            labelKey={'name'}
            onBlurChange={() => setFieldTouched('property_id', true)}
            isValid={touched.property_id && !errors.property_id}
            isInvalid={touched.property_id && !!errors.property_id}
            error={errors.property_id}
          />
        </Col>
        <Col md={4} sm={6} xs={12}>
          <FilterPaginateInput
            name="unit"
            labelText="Search Unit"
            model_label="property.Unit"
            filter={getSearchFilter(values.property_id, 'parent_property')}
            controlId={`FixedAssetImportFormUnit`}
            placeholder={`Select Unit`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            selected={values.unit}
            labelKey={'name'}
            onSelectChange={selected => {
              if (selected.length) {
                setFieldValue('unit', selected);
              } else {
                setFieldValue('unit', []);
              }
            }}
            onBlurChange={() => setFieldTouched('unit', true)}
            isValid={touched.unit && !errors.unit}
            isInvalid={touched.unit && !!errors.unit}
            preload={getSearchFilter(values.property_id, 'parent_property', true)}
            disabled={values.property_id.length <= 0}
            error={errors.unit}
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

export default FixedAssetsImport;
