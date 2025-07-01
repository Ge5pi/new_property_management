import { Fragment, useCallback, useMemo } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { FormikValues, useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateOwnerUpcomingActivityMutation,
  useGetOwnersByIdQuery,
  useUpdateOwnerUpcomingActivityMutation,
} from 'services/api/owners';
import {
  useCreatePropertyUpcomingActivityMutation,
  useGetPropertyByIdQuery,
  useUpdatePropertyUpcomingActivityMutation,
} from 'services/api/properties';
import { useCreateGeneralLabelMutation, useGetGeneralLabelByIdQuery } from 'services/api/system-preferences';
import {
  useCreateTenantUpcomingActivityMutation,
  useGetTenantByIdQuery,
  useUpdateTenantUpcomingActivityMutation,
} from 'services/api/tenants';
import { BaseQueryError } from 'services/api/types/rtk-query';
import {
  useCreateUnitUpcomingActivityMutation,
  useGetUnitByIdQuery,
  useUpdateUnitUpcomingActivityMutation,
} from 'services/api/units';
import { useGetUserByIdQuery } from 'services/api/users';

import { ItemInputItem, ItemMenuItem } from 'components/custom-cell';
import { Popup } from 'components/popup';

import { CustomSelect, FilterPaginateInput } from 'core-ui/custom-select';
import { UsersPlusIcon } from 'core-ui/icons';
import { InputDate } from 'core-ui/input-date';
import { InputTime } from 'core-ui/input-time';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import {
  dayJS,
  getIDFromObject,
  getReadableError,
  getStringPersonName,
  isPositiveNumber,
  renderFormError,
} from 'utils/functions';

import { IUser } from 'interfaces/IAvatar';
import { CalendarFilterModule, ICalendarAPI } from 'interfaces/ICalendar';
import { IIDName } from 'interfaces/IGeneral';
import { CustomOptionType } from 'interfaces/IInputs';
import { IOwner, IOwnerUpcomingActivities } from 'interfaces/IPeoples';
import { IPropertyUpcomingActivities } from 'interfaces/IProperties';
import { GeneralLabels } from 'interfaces/ISettings';
import { ITenantAPI, ITenantUpcomingActivities } from 'interfaces/ITenant';
import { IUnitsUpcomingActivities } from 'interfaces/IUnits';

interface IProps {
  event?: Partial<ICalendarAPI>;
  eventFor?: CalendarFilterModule;
  update?: boolean;
}

const UpcomingActivitySchema = Yup.object().shape({
  assign_to: yupFilterInput,
  title: Yup.string().trim().required('This field is required!'),
  date: Yup.date().required('This field is required!'),
  label: Yup.array().of(Yup.object().required('a valid selected option required!')),
  status: Yup.boolean().oneOf([true, false], 'Selected value must be one of "true" or "false"').default(true),
  description: Yup.string().trim().required('This field is required!').min(5),
  event_type: Yup.string().trim().oneOf(['PROPERTY', 'TENANT', 'OWNER', 'UNIT']).required('this field is required!'),
  unit: Yup.array()
    .of(Yup.object().required('a valid selected option required!'))
    .when('event_type', {
      is: (value?: string) => value && value === 'UNIT',
      then: schema => schema.min(1, 'this field is required!'),
    }),
  owner: Yup.array()
    .of(Yup.object().required('a valid selected option required!'))
    .when('event_type', {
      is: (value?: string) => value && value === 'OWNER',
      then: schema => schema.min(1, 'this field is required!'),
    }),
  tenant: Yup.array()
    .of(Yup.object().required('a valid selected option required!'))
    .when('event_type', {
      is: (value?: string) => value && value === 'TENANT',
      then: schema => schema.min(1, 'this field is required!'),
    }),
  parent_property: Yup.array()
    .of(Yup.object().required('a valid selected option required!'))
    .when('event_type', {
      is: (value?: string) => value && value === 'PROPERTY',
      then: schema => schema.min(1, 'this field is required!'),
    }),
  start_time: Yup.string()
    .trim()
    .required('This field is required!')
    .test('is-greater-start', `start time should be greater/equal to current time`, function (value) {
      if (!value || !this.parent.date) return false;
      const selectedDate = dayJS(this.parent.date).format('MM/DD/YYYY');
      const selectedDateTime = dayJS(`${selectedDate} ${value}`, 'MM/DD/YYYY hh:mm A');
      return selectedDateTime.isSameOrAfter(dayJS());
    }),
  end_time: Yup.string()
    .trim()
    .test('is-greater', 'end time should be greater', function (value) {
      if (!value || !this.parent.date || !this.parent.start_time) return false;

      const selectedDate = dayJS(this.parent.date).format('MM/DD/YYYY');
      const startDateTime = dayJS(`${selectedDate} ${this.parent.start_time}`, 'MM/DD/YYYY hh:mm A');
      const endDateTime = dayJS(`${selectedDate} ${value}`, 'MM/DD/YYYY hh:mm A');
      return dayJS(endDateTime).isAfter(startDateTime);
    })
    .required('This field is required!'),
});

const NewEventModal = ({ event, eventFor, update }: IProps) => {
  const [createOwnerUpcomingActivity, { isSuccess: isOwnerSuccess, isError: isOwnerError, error: ownerError }] =
    useCreateOwnerUpcomingActivityMutation();

  const [createTenantUpcomingActivity, { isSuccess: isTenantSuccess, isError: isTenantError, error: tenantError }] =
    useCreateTenantUpcomingActivityMutation();

  const [
    createPropertyUpcomingActivity,
    { isSuccess: isPropertySuccess, isError: isPropertyError, error: propertyError },
  ] = useCreatePropertyUpcomingActivityMutation();

  const [createUnitUpcomingActivity, { isSuccess: isUnitSuccess, isError: isUnitError, error: unitError }] =
    useCreateUnitUpcomingActivityMutation();

  const [
    updateOwnerUpcomingActivity,
    { isSuccess: isOwnerUpdateSuccess, isError: isOwnerUpdateError, error: ownerUpdateError },
  ] = useUpdateOwnerUpcomingActivityMutation();

  const [
    updateTenantUpcomingActivity,
    { isSuccess: isTenantUpdateSuccess, isError: isTenantUpdateError, error: tenantUpdateError },
  ] = useUpdateTenantUpcomingActivityMutation();

  const [
    updatePropertyUpcomingActivity,
    { isSuccess: isPropertyUpdateSuccess, isError: isPropertyUpdateError, error: propertyUpdateError },
  ] = useUpdatePropertyUpcomingActivityMutation();

  const [
    updateUnitUpcomingActivity,
    { isSuccess: isUnitUpdateSuccess, isError: isUnitUpdateError, error: unitUpdateError },
  ] = useUpdateUnitUpcomingActivityMutation();

  useResponse({
    successTitle: 'New Event has been added',
    isSuccess: isOwnerSuccess || isTenantSuccess || isPropertySuccess || isUnitSuccess,
    isError: isOwnerError || isTenantError || isPropertyError || isUnitError,
    error: ownerError || tenantError || propertyError || unitError,
  });

  useResponse({
    successTitle: 'Event detail has been updated successfully!',
    isSuccess: isOwnerUpdateSuccess || isTenantUpdateSuccess || isPropertyUpdateSuccess || isUnitUpdateSuccess,
    isError: isOwnerUpdateError || isTenantUpdateError || isPropertyUpdateError || isUnitUpdateError,
    error: ownerUpdateError || tenantUpdateError || propertyUpdateError || unitUpdateError,
  });

  const [createLabel, { isError: isCreateGeneralLabelError, error: createGeneralLabelError }] =
    useCreateGeneralLabelMutation();

  useResponse({
    isError: isCreateGeneralLabelError,
    error: createGeneralLabelError,
  });

  const handleFormSubmission = async (values: FormikValues) => {
    const { date, title, description } = values;
    const user_id = Number((values.assign_to as Array<IUser>)[0].id);

    let label_id: number | undefined;
    if (values.label && Array.isArray(values.label) && values.label.length) {
      label_id = Number((values.label as Array<GeneralLabels>)[0].id);

      const selection = values.label[0];
      if (typeof selection !== 'string' && 'customOption' in selection) {
        await createLabel({ name: (selection as CustomOptionType).name }).then(result => {
          if (result.data) {
            label_id = Number(result.data.id);
          } else {
            return result;
          }
        });
      }
    }

    let property_id: number | undefined;
    if (values.parent_property && Array.isArray(values.parent_property) && values.parent_property.length) {
      property_id = Number((values.parent_property as Array<IIDName>)[0].id);
    }

    let unit_id: number | undefined;
    if (values.unit && Array.isArray(values.unit) && values.unit.length) {
      unit_id = Number((values.unit as Array<IIDName>)[0].id);
    }

    let owner_id: number | undefined;
    if (values.owner && Array.isArray(values.owner) && values.owner.length) {
      owner_id = Number((values.owner as Array<IIDName>)[0].id);
    }

    let tenant_id: number | undefined;
    if (values.tenant && Array.isArray(values.tenant) && values.tenant.length) {
      tenant_id = Number((values.tenant as Array<IIDName>)[0].id);
    }

    const start_time = values.start_time ? dayJS(values.start_time, 'hh:mm A').format('HH:mm') : undefined;
    const end_time = values.end_time ? dayJS(values.end_time, 'hh:mm A').format('HH:mm') : undefined;

    const data = {
      ...values,
      date,
      title,
      end_time,
      start_time,
      description,
      unit: unit_id,
      owner: owner_id,
      tenant: tenant_id,
      parent_property: property_id,
      assign_to: Number(user_id),
      label: Number(label_id),
    };

    if (property_id && property_id > 0) {
      if (update && event && isPositiveNumber(event.id)) {
        return await updatePropertyUpcomingActivity({ ...data, id: event.id } as IPropertyUpcomingActivities);
      }

      return await createPropertyUpcomingActivity(data as IPropertyUpcomingActivities);
    }

    if (unit_id && unit_id > 0) {
      if (update && event && isPositiveNumber(event.id)) {
        return await updateUnitUpcomingActivity({ ...data, id: event.id } as IPropertyUpcomingActivities);
      }

      return await createUnitUpcomingActivity(data as IUnitsUpcomingActivities);
    }

    if (owner_id && owner_id > 0) {
      if (update && event && isPositiveNumber(event.id)) {
        return await updateOwnerUpcomingActivity({ ...data, id: event.id } as IPropertyUpcomingActivities);
      }

      return await createOwnerUpcomingActivity(data as IOwnerUpcomingActivities);
    }

    if (tenant_id && tenant_id > 0) {
      if (update && event && isPositiveNumber(event.id)) {
        return await updateTenantUpcomingActivity({ ...data, id: event.id } as IPropertyUpcomingActivities);
      }

      return await createTenantUpcomingActivity(data as ITenantUpcomingActivities);
    }

    return Promise.reject('Invalid information provided!');
  };

  const {
    data: assign_to,
    isLoading: assignLoading,
    isFetching: assignFetching,
  } = useGetUserByIdQuery(getIDFromObject('assign_to', event));

  const {
    data: activity_label,
    isLoading: labelLoading,
    isFetching: labelFetching,
  } = useGetGeneralLabelByIdQuery(getIDFromObject('label', event));

  const {
    data: owner_data,
    isLoading: ownerLoading,
    isFetching: ownerFetching,
  } = useGetOwnersByIdQuery(getIDFromObject('owner', event));

  const {
    data: tenant_data,
    isLoading: tenantLoading,
    isFetching: tenantFetching,
  } = useGetTenantByIdQuery(getIDFromObject('tenant', event));

  const {
    data: unit_data,
    isLoading: unitLoading,
    isFetching: unitFetching,
  } = useGetUnitByIdQuery(getIDFromObject('unit', event));

  const {
    data: property_data,
    isLoading: propertyLoading,
    isFetching: propertyFetching,
  } = useGetPropertyByIdQuery(getIDFromObject('parent_property', event));

  const formik = useFormik({
    initialValues: {
      event_type: eventFor ? eventFor : '',
      title: event?.title ?? '',
      unit: unit_data ? [unit_data] : ([] as Option[]),
      tenant: tenant_data ? [tenant_data] : ([] as Option[]),
      parent_property: property_data ? [property_data] : ([] as Option[]),
      owner: owner_data ? [owner_data] : ([] as Option[]),
      assign_to: assign_to ? [assign_to] : ([] as Option[]),
      label: activity_label ? [activity_label] : ([] as Option[]),
      date: event?.date ?? '',
      status: event?.status ?? true,
      description: event?.description ?? '',
      start_time: event && event.start_time ? dayJS(event.start_time, 'HH:mm:ss').format('hh:mm A') : '',
      end_time: event && event.end_time ? dayJS(event.end_time, 'HH:mm:ss').format('hh:mm A') : '',
    },
    validationSchema: UpcomingActivitySchema,
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
    handleChange,
    handleBlur,
    touched,
    values,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
    handleReset,
    errors,
  } = formik;

  const onUserSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('assign_to', selected);
      } else {
        setFieldValue('assign_to', []);
      }
    },
    [setFieldValue]
  );

  const onLabelSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('label', selected);
      } else {
        setFieldValue('label', []);
      }
    },
    [setFieldValue]
  );

  const currentType = useMemo(() => {
    return values.event_type;
  }, [values.event_type]);

  const resetSelectedValues = useCallback(
    (fieldName: string) => {
      setFieldValue(fieldName, []);
    },
    [setFieldValue]
  );

  return (
    <Popup
      title={update && event?.id ? 'Update Event' : 'Add new event'}
      subtitle={`Fill out the information bellow to ${update && event?.id ? 'add a new event' : 'update event details'}`}
      successButton={update && event?.id ? 'Update' : 'Create'}
      onSubmit={handleSubmit}
      onReset={handleReset}
      isSubmitting={isSubmitting}
    >
      <Row className="gy-md-0 gy-3 gx-md-4 gx-sm-1 gx-0 align-items-stretch justify-content-between">
        <Col md={8}>
          <Form.Group className="mx-md-0 mx-sm-2 mx-1 mb-4" controlId="CalendarEventFormTitle">
            <Form.Label className="popup-form-labels">Title</Form.Label>
            <Form.Control
              autoFocus
              name="title"
              placeholder="Some title here"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.title && !errors.title}
              isInvalid={touched.title && !!errors.title}
            />
            <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md sm={6}>
          <InputDate
            name="date"
            labelText={'Date'}
            controlId="CalendarEventFormDate"
            classNames={{ wrapperClass: 'mx-md-0 mx-sm-2 mx-1 mb-4', labelClass: 'popup-form-labels' }}
            value={values.date}
            minDate={new Date()}
            onDateSelection={date => setFieldValue('date', date)}
            onBlur={() => setFieldTouched('date')}
            isValid={touched.date && !errors.date}
            isInvalid={touched.date && !!errors.date}
            error={errors.date}
          />
        </Col>
        <Col lg={3} md={4} sm={5}>
          <InputTime
            name="start_time"
            classNames={{ wrapperClass: 'mx-md-0 mx-sm-2 mx-1 mb-4', labelClass: 'popup-form-labels' }}
            controlId="CalendarEventFormStartTime"
            labelText="Start Time"
            value={values.start_time}
            onTimeSelection={time => setFieldValue('start_time', time)}
            onBlurChange={() => setFieldTouched('start_time')}
            isValid={touched.start_time && !errors.start_time}
            isInvalid={touched.start_time && !!errors.start_time}
            error={errors.start_time}
          />
        </Col>
        <Col lg={3} md={4} sm={5}>
          <InputTime
            name="end_time"
            classNames={{ wrapperClass: 'mx-md-0 mx-sm-2 mx-1 mb-4', labelClass: 'popup-form-labels' }}
            controlId="CalendarEventFormEndTime"
            labelText="End Time"
            value={values.end_time}
            onTimeSelection={time => setFieldValue('end_time', time)}
            onBlurChange={() => setFieldTouched('end_time')}
            isValid={touched.end_time && !errors.end_time}
            isInvalid={touched.end_time && !!errors.end_time}
            error={errors.end_time}
          />
        </Col>
        <Col md sm={6}>
          <FilterPaginateInput
            allowNew
            name="label"
            labelText="Label"
            model_label="system_preferences.Label"
            placeholder="Type Here..."
            controlId={`CalendarEventFormLabel`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mx-md-0 mx-sm-2 mx-1 mb-4',
            }}
            selected={values.label}
            onSelectChange={onLabelSelected}
            onBlurChange={() => setFieldTouched('label', true)}
            isValid={touched.label && !errors.label}
            isInvalid={touched.label && !!errors.label}
            disabled={labelFetching || labelLoading}
            labelKey={`name`}
            searchIcon={false}
            error={errors.label}
          />
        </Col>

        <Col xs={6}>
          <CustomSelect
            name="event_type"
            labelText="Event related to"
            classNames={{ labelClass: 'fw-medium', wrapperClass: 'mx-md-0 mx-sm-2 mx-1 mb-4' }}
            value={values.event_type}
            onSelectChange={value => {
              setFieldValue('event_type', value);
              resetSelectedValues('unit');
              resetSelectedValues('tenant');
              resetSelectedValues('owner');
              resetSelectedValues('parent_property');
            }}
            onBlurChange={() => setFieldTouched('event_type', true)}
            isValid={touched.event_type && !errors.event_type}
            isInvalid={touched.event_type && !!errors.event_type}
            error={errors.event_type}
            controlId="CalendarEventFormEventType"
            options={[
              { label: 'Unit', value: 'UNIT' },
              { label: 'Property', value: 'PROPERTY' },
              { label: 'Tenant', value: 'TENANT' },
              { label: 'Owner', value: 'OWNER' },
            ]}
            placeholder="Select Event Type"
          />
        </Col>
        <Col xs={12}>
          {currentType === 'TENANT' && (
            <FilterPaginateInput
              name="tenant"
              placeholder="Select Tenant"
              controlId={`EmailTemplateFormTenants`}
              classNames={{
                labelClass: 'popup-form-labels',
                wrapperClass: 'mx-md-0 mx-sm-2 mx-1 mb-4',
              }}
              inputProps={{
                style: {
                  paddingLeft: values.tenant.length > 0 ? `2.5rem` : '',
                },
              }}
              selected={values.tenant}
              onSelectChange={selected => {
                if (selected.length) {
                  setFieldValue('tenant', selected);
                } else {
                  setFieldValue('tenant', []);
                }
              }}
              onBlurChange={() => setFieldTouched('tenant', true)}
              isValid={touched.tenant && !errors.tenant}
              isInvalid={touched.tenant && !!errors.tenant}
              filterBy={['first_name', 'last_name']}
              labelKey={option => getStringPersonName(option as ITenantAPI)}
              renderMenuItemChildren={option => <ItemMenuItem option={option as ITenantAPI} />}
              renderInput={(inputProps, { selected }) => {
                const option = selected.length > 0 ? (selected[0] as ITenantAPI) : undefined;
                return <ItemInputItem {...inputProps} option={option} />;
              }}
              searchIcon={false}
              disabled={tenantFetching || tenantLoading}
              model_label="people.Tenant"
              error={errors.tenant}
            />
          )}
          {currentType === 'OWNER' && (
            <FilterPaginateInput
              name="owner"
              model_label="people.Owner"
              placeholder="Select Owner"
              controlId={`EmailTemplateFormOwners`}
              classNames={{
                labelClass: 'popup-form-labels',
                wrapperClass: 'mx-md-0 mx-sm-2 mx-1 mb-4',
              }}
              selected={values.owner}
              onSelectChange={selected => {
                if (selected.length) {
                  setFieldValue('owner', selected);
                } else {
                  setFieldValue('owner', []);
                }
              }}
              inputProps={{
                style: {
                  paddingLeft: values.owner.length > 0 ? `2.5rem` : '',
                },
              }}
              onBlurChange={() => setFieldTouched('owner', true)}
              isValid={touched.owner && !errors.owner}
              isInvalid={touched.owner && !!errors.owner}
              filterBy={['first_name', 'last_name']}
              labelKey={option => getStringPersonName(option as IOwner)}
              renderMenuItemChildren={option => <ItemMenuItem option={option as IOwner} />}
              renderInput={(inputProps, { selected }) => {
                const option = selected.length > 0 ? (selected[0] as IOwner) : undefined;
                return <ItemInputItem {...inputProps} option={option} />;
              }}
              searchIcon={false}
              disabled={ownerFetching || ownerLoading}
              error={errors.owner}
            />
          )}
          {currentType === 'PROPERTY' && (
            <FilterPaginateInput
              name="parent_property"
              model_label="property.Property"
              controlId={`CalendarEventFormProperty`}
              placeholder="Select Property"
              classNames={{
                labelClass: 'popup-form-labels',
                wrapperClass: 'mx-md-0 mx-sm-2 mx-1 mb-4',
              }}
              selected={values.parent_property}
              onSelectChange={selected => {
                if (selected.length) {
                  setFieldValue('parent_property', selected);
                } else {
                  setFieldValue('parent_property', []);
                }
              }}
              labelKey={'name'}
              onBlurChange={() => setFieldTouched('parent_property', true)}
              isValid={touched.parent_property && !errors.parent_property}
              isInvalid={touched.parent_property && !!errors.parent_property}
              disabled={propertyFetching || propertyLoading}
              error={errors.parent_property}
            />
          )}
          {currentType === 'UNIT' && (
            <FilterPaginateInput
              name="unit"
              model_label="property.Unit"
              controlId={`CalendarEventFormUnit`}
              placeholder="Select Unit"
              classNames={{
                labelClass: 'popup-form-labels',
                wrapperClass: 'mx-md-0 mx-sm-2 mx-1 mb-4',
              }}
              selected={values.unit}
              onSelectChange={selected => {
                if (selected.length) {
                  setFieldValue('unit', selected);
                } else {
                  setFieldValue('unit', []);
                }
              }}
              labelKey={'name'}
              disabled={unitFetching || unitLoading}
              onBlurChange={() => setFieldTouched('unit', true)}
              isValid={touched.unit && !errors.unit}
              isInvalid={touched.unit && !!errors.unit}
              error={errors.unit}
            />
          )}
        </Col>

        <Col xs={12}>
          <Form.Group className="mx-md-0 mx-sm-2 mx-1 mb-4" controlId="CalendarEventFormDescription">
            <Form.Label className="popup-form-labels">Description</Form.Label>
            <Form.Control
              placeholder="Some description here"
              as="textarea"
              rows={5}
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.description && !errors.description}
              isInvalid={touched.description && !!errors.description}
            />
            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <FilterPaginateInput
            name="assign_to"
            model_label="authentication.User"
            labelText={
              <Fragment>
                Assign To <UsersPlusIcon />
              </Fragment>
            }
            inputProps={{
              style: {
                paddingLeft: values.assign_to.length > 0 ? `2.5rem` : '',
              },
            }}
            controlId={`CalendarEventFormAssignTo`}
            placeholder="Choose a user"
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mx-md-0 mx-sm-2 mx-1 mb-4',
            }}
            selected={values.assign_to}
            onSelectChange={onUserSelected}
            onBlurChange={() => setFieldTouched('assign_to', true)}
            isValid={touched.assign_to && !errors.assign_to}
            isInvalid={touched.assign_to && !!errors.assign_to}
            filterBy={['username', 'first_name', 'last_name']}
            labelKey={option => getStringPersonName(option as IUser)}
            renderMenuItemChildren={option => <ItemMenuItem option={option as IUser} />}
            renderInput={(inputProps, { selected }) => {
              const option = selected.length > 0 ? (selected[0] as IUser) : undefined;
              return <ItemInputItem {...inputProps} option={option} />;
            }}
            searchIcon={false}
            disabled={assignFetching || assignLoading}
            error={errors.assign_to}
          />
        </Col>
        <Col sm={'auto'}>
          <Form.Group className="mx-md-0 mx-sm-2 mx-1 mb-4" controlId="CalendarEventFormStatus">
            <Form.Label className="popup-form-labels">Status</Form.Label>
            <Form.Check
              className="form-check-green"
              type="switch"
              label={values.status ? `Active` : 'Inactive'}
              name="status"
              onBlur={handleBlur}
              onChange={() => {
                setFieldValue('status', !values.status);
              }}
              checked={values.status === true}
              isInvalid={touched.status && !!errors.status}
            />
          </Form.Group>
        </Col>
      </Row>
    </Popup>
  );
};

export default ProviderHOC(NewEventModal);
