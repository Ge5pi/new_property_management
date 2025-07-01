import { Col, Form, Row, Stack } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { skipToken } from '@reduxjs/toolkit/query';
import { FormikValues, useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import { useGetPropertyByIdQuery } from 'services/api/properties';
import { BaseQueryError } from 'services/api/types/rtk-query';
import { useGetListOfUnitsQuery } from 'services/api/units';

import { Popup } from 'components/popup';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { GroupedField } from 'core-ui/grouped-field';
import { InputDate } from 'core-ui/input-date';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { getIDFromObject, getReadableError, getSearchFilter, renderFormError } from 'utils/functions';

import { IProjects, ProjectStatusType } from 'interfaces/IMaintenance';
import { IPropertyAPI } from 'interfaces/IProperties';
import { IUnitsAPI } from 'interfaces/IUnits';

const ProjectSchema = Yup.object().shape({
  name: Yup.string().trim().required('This field is required!'),
  description: Yup.string().trim().required('This field is required!'),
  select_all_units: Yup.boolean().oneOf([true, false], 'Selected value must be one of "true" or "false"').default(true),
  parent_property: yupFilterInput.required('This field is required!'),
  units: Yup.array().when('select_all_units', {
    is: false,
    then: schema =>
      schema.of(Yup.object().required('a valid selected option required!')).min(1, 'This field is required!'),
  }),
  budget: Yup.number().positive().required('This field is required!'),
  start_date: Yup.date().required('This field is required!'),
  end_date: Yup.date().nullable(),
  status: Yup.string()
    .trim()
    .oneOf(['IN_PROGRESS', 'COMPLETED', 'PENDING'], 'Select a valid value')
    .required('This field is required!'),
});

interface IProps {
  update?: boolean;
  data?: IProjects;
  createProject?: (data: IProjects) => Promise<
    | {
        data: IProjects;
        error?: undefined;
      }
    | {
        data?: undefined;
        error: unknown;
      }
  >;
  updateProject?: (data: Partial<IProjects>) => Promise<
    | {
        data: IProjects;
        error?: undefined;
      }
    | {
        data?: undefined;
        error: unknown;
      }
  >;
}
const ProjectModal = ({ data, createProject, update, updateProject }: IProps) => {
  const {
    data: property_data,
    isLoading: propertyLoading,
    isFetching: propertyFetching,
  } = useGetPropertyByIdQuery(getIDFromObject('parent_property', data));

  const {
    data: units_data,
    isLoading: unitsLoading,
    isFetching: unitsFetching,
  } = useGetListOfUnitsQuery(
    data && data.units && data.units.length > 0 && !data.select_all_units ? (data.units as number[]) : skipToken
  );

  const handleFormSubmission = async (values: FormikValues) => {
    const { parent_property, units, ...rest } = values;

    let parent_property_id = 0;
    if (parent_property && parent_property.length > 0) {
      parent_property_id = Number((parent_property as Array<IPropertyAPI>)[0].id);
    }

    const units__id: Array<number> = [];
    if (!values.select_all_units) {
      (units as IUnitsAPI[]).forEach(selected => {
        units__id.push(Number(selected.id));
      });
    }

    const form_data = {
      ...rest,
      units: units__id,
      parent_property: parent_property_id,
      gl_account: '15454589 98598956 6566',
    };

    if (updateProject && update && data && data.id) {
      return await updateProject({ ...form_data, id: data.id });
    } else if (createProject) {
      return await createProject(form_data as IProjects);
    }

    return Promise.reject('Incomplete information provided!');
  };

  const formik = useFormik({
    initialValues: {
      end_date: data?.end_date,
      start_date: data?.start_date ?? '',
      parent_property: property_data ? [property_data] : ([] as Option[]),
      units: units_data ? units_data : ([] as Option[]),
      select_all_units: data?.select_all_units ?? true,
      status: data?.status ?? ('PENDING' as ProjectStatusType),
      budget: data?.budget ?? '',
      description: data?.description ?? '',
      name: data?.name ?? '',
    },
    validationSchema: ProjectSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();
      handleFormSubmission(values)
        .then(result => {
          if (result.data) {
            SwalExtended.close();
          } else {
            const error = result.error as BaseQueryError;
            if (error.status === 400 && error.data) {
              renderFormError(error.data, setFieldError);
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

  const {
    handleSubmit,
    touched,
    values,
    setFieldValue,
    setFieldTouched,
    handleBlur,
    handleChange,
    isSubmitting,
    handleReset,
    errors,
  } = formik;

  return (
    <Popup
      title={`${update ? 'Update' : 'Add'} Project`}
      subtitle={`Fill out the information to ${update ? 'update' : 'add'} project`}
      onSubmit={handleSubmit}
      onReset={handleReset}
      isSubmitting={isSubmitting}
    >
      <Form.Group className="mb-3" controlId="ProjectFormTitle">
        <Form.Label className="popup-form-labels">Project Title</Form.Label>
        <Form.Control
          autoFocus
          type="text"
          placeholder="Enter Project name here..."
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          isValid={touched.name && !errors.name}
          isInvalid={touched.name && !!errors.name}
        />
        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="ProjectFormDescription">
        <Form.Label className="popup-form-labels">Description</Form.Label>
        <Form.Control
          placeholder="Some description here"
          as="textarea"
          rows={3}
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          isValid={touched.description && !errors.description}
          isInvalid={touched.description && !!errors.description}
        />
        <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
      </Form.Group>

      <GroupedField
        min="0"
        controlId="ProjectFormBudget"
        label="Budget"
        type="number"
        placeholder="0.00"
        step={0.01}
        position="end"
        wrapperClass="mb-3"
        icon="$"
        name="budget"
        value={values.budget}
        onChange={handleChange}
        onBlur={handleBlur}
        isValid={touched.budget && !errors.budget}
        isInvalid={touched.budget && !!errors.budget}
        error={errors.budget}
      />

      <FilterPaginateInput
        name="parent_property"
        model_label="property.Property"
        labelText="Select Property"
        controlId={`ProjectModalFormProperty`}
        placeholder={`Select`}
        classNames={{
          labelClass: 'popup-form-labels',
          wrapperClass: 'mb-3',
        }}
        selected={values.parent_property}
        onSelectChange={selected => {
          if (selected.length) {
            setFieldValue('parent_property', selected);
          } else {
            setFieldValue('parent_property', []);
          }
        }}
        onBlurChange={() => setFieldTouched('parent_property', true)}
        isValid={touched.parent_property && !errors.parent_property}
        isInvalid={touched.parent_property && !!errors.parent_property}
        labelKey={'name'}
        disabled={propertyFetching || propertyLoading}
        error={errors.parent_property}
      />

      <FilterPaginateInput
        name="units"
        placeholder="Select Unit"
        labelText={
          <Stack direction="horizontal" gap={5} className="justify-content-between flex-wrap">
            <Form.Text className="popup-form-labels">Unit</Form.Text>
            <Form.Group controlId="ProjectsModalFormAllUnits">
              <Form.Check
                type="checkbox"
                label="Select all units?"
                name="select_all_units"
                className="small text-primary"
                onClick={ev => {
                  if (ev.currentTarget.checked) {
                    setFieldValue('select_all_units', false);
                    setFieldValue('units', []);
                  }
                }}
                onChange={handleChange}
                checked={values.select_all_units}
                isInvalid={touched.select_all_units && !!errors.select_all_units}
                onBlur={handleBlur}
              />
            </Form.Group>
          </Stack>
        }
        controlId={`ProjectModalFormUnits`}
        classNames={{
          wrapperClass: 'mb-3',
          labelClass: 'd-block',
        }}
        selected={values.units}
        onSelectChange={selected => {
          if (selected.length) {
            setFieldValue('units', selected);
          } else {
            setFieldValue('units', []);
          }
        }}
        model_label="property.Unit"
        filter={getSearchFilter(values.parent_property, 'parent_property')}
        preload={getSearchFilter(values.parent_property, 'parent_property', true)}
        onBlurChange={() => setFieldTouched('units', true)}
        isValid={touched.units && !errors.units}
        isInvalid={touched.units && !!errors.units}
        labelKey={'name'}
        error={errors.units}
        disabled={values.select_all_units || unitsLoading || unitsFetching || values.parent_property.length <= 0}
      />

      <Row className="gx-sm-4 gx-0">
        <Col>
          <InputDate
            name={'start_date'}
            minDate={new Date()}
            labelText={'Start Date'}
            controlId="ProjectFormStartDate"
            classNames={{ wrapperClass: 'mb-3', labelClass: 'popup-form-labels' }}
            value={values.start_date}
            onDateSelection={date => setFieldValue('start_date', date)}
            onBlur={() => setFieldTouched('start_date')}
            isValid={touched.start_date && !errors.start_date}
            isInvalid={touched.start_date && !!errors.start_date}
            error={errors.start_date}
          />
        </Col>
        {values.end_date && (
          <Col>
            <InputDate
              readOnly
              disabled
              name={'end_date'}
              labelText={'End Date'}
              value={values.end_date}
              controlId="ProjectFormEndDate"
              minDate={new Date(values.start_date)}
              classNames={{ wrapperClass: 'mb-3', labelClass: 'popup-form-labels' }}
              isValid={touched.end_date && !errors.end_date}
              isInvalid={touched.end_date && !!errors.end_date}
              error={errors.end_date}
            />
          </Col>
        )}
      </Row>
    </Popup>
  );
};

export default ProviderHOC(ProjectModal);
