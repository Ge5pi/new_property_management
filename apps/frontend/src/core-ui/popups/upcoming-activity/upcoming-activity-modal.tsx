import { Fragment, useCallback } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { FormikValues, useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import { useGetGeneralLabelByIdQuery } from 'services/api/system-preferences';
import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';
import { useGetUserByIdQuery } from 'services/api/users';

import { ItemInputItem, ItemMenuItem } from 'components/custom-cell';
import { Popup } from 'components/popup';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { UsersPlusIcon } from 'core-ui/icons';
import { InputDate } from 'core-ui/input-date';
import { InputTime } from 'core-ui/input-time';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { dayJS, getIDFromObject, getReadableError, getStringPersonName, renderFormError } from 'utils/functions';

import { IUser } from 'interfaces/IAvatar';
import { IIDName } from 'interfaces/IGeneral';
import { CustomOptionType } from 'interfaces/IInputs';
import { IOwnerUpcomingActivities } from 'interfaces/IPeoples';
import { IPropertyUpcomingActivities } from 'interfaces/IProperties';
import { GeneralLabels } from 'interfaces/ISettings';
import { ITenantUpcomingActivities } from 'interfaces/ITenant';
import { IUnitsUpcomingActivities } from 'interfaces/IUnits';
import { IUpcomingActivities } from 'interfaces/IUpcomingActivities';

const UpcomingActivitySchema = Yup.object().shape({
  assign_to: yupFilterInput,
  title: Yup.string().trim().required('This field is required!'),
  date: Yup.date().required('This field is required!'),
  label: Yup.array().of(Yup.object().required('a valid selected option required!')),
  status: Yup.boolean().oneOf([true, false], 'Selected value must be one of "true" or "false"').default(true),
  description: Yup.string().trim().required('This field is required!').min(5),
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

interface IProps {
  update?: boolean;
  data?: IUpcomingActivities;
  createUpcomingActivity?: (data: IUpcomingActivities) => Promise<
    | {
        data:
          | IOwnerUpcomingActivities
          | IPropertyUpcomingActivities
          | IUnitsUpcomingActivities
          | ITenantUpcomingActivities;
        error?: undefined;
      }
    | {
        data?: undefined;
        error: unknown;
      }
  >;
  updateUpcomingActivity?: (data: Partial<IUpcomingActivities>) => Promise<
    | {
        data:
          | IOwnerUpcomingActivities
          | IPropertyUpcomingActivities
          | IUnitsUpcomingActivities
          | ITenantUpcomingActivities;
        error?: undefined;
      }
    | {
        data?: undefined;
        error: unknown;
      }
  >;
  createLabel: GenericMutationTrigger<IIDName, GeneralLabels>;
}

const UpcomingActivityModal = ({
  createUpcomingActivity,
  createLabel,
  data,
  update,
  updateUpcomingActivity,
}: IProps) => {
  const handleFormSubmission = async (values: FormikValues) => {
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

    const start_time = values.start_time ? dayJS(values.start_time, 'hh:mm A').format('HH:mm') : undefined;
    const end_time = values.end_time ? dayJS(values.end_time, 'hh:mm A').format('HH:mm') : undefined;

    const data = {
      ...values,
      start_time,
      end_time,
      assign_to: Number(user_id),
      label: Number(label_id),
    };

    if (updateUpcomingActivity && update) {
      return await updateUpcomingActivity(data);
    } else if (createUpcomingActivity) {
      return await createUpcomingActivity(data as IUpcomingActivities);
    }

    return Promise.reject('Incomplete information provided!');
  };

  const {
    data: assign_to,
    isLoading: assignLoading,
    isFetching: assignFetching,
  } = useGetUserByIdQuery(getIDFromObject('assign_to', data));

  const {
    data: activity_label,
    isLoading: labelLoading,
    isFetching: labelFetching,
  } = useGetGeneralLabelByIdQuery(getIDFromObject('label', data));

  const formik = useFormik({
    initialValues: {
      title: data?.title ?? '',
      assign_to: assign_to ? [assign_to] : ([] as Option[]),
      label: activity_label ? [activity_label] : ([] as Option[]),
      date: data?.date ?? '',
      status: data?.status ?? true,
      description: data?.description ?? '',
      start_time: data && data.start_time ? dayJS(data.start_time, 'HH:mm:ss').format('hh:mm A') : '',
      end_time: data && data.end_time ? dayJS(data.end_time, 'HH:mm:ss').format('hh:mm A') : '',
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

  return (
    <Popup
      title={`${update ? 'Update' : 'Create'} Upcoming Activities`}
      subtitle={`Fill out the form to ${update ? 'Update' : 'Create'} an upcoming activity`}
      onSubmit={handleSubmit}
      onReset={handleReset}
      isSubmitting={isSubmitting}
    >
      <Row className="gy-md-0 gy-3 gx-md-4 gx-sm-1 gx-0 align-items-stretch justify-content-between">
        <Col md={8}>
          <Form.Group className="mx-md-0 mx-sm-2 mx-1 mb-4" controlId="UpcomingActivityFormTitle">
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
            controlId="UpcomingActivityFormDate"
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
            controlId="UpcomingActivityFormStartTime"
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
            controlId="UpcomingActivityFormEndTime"
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

        <Col xs={12}>
          <Form.Group className="mx-md-0 mx-sm-2 mx-1 mb-4" controlId="UpcomingActivityFormDescription">
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
          <Form.Group className="mx-md-0 mx-sm-2 mx-1 mb-4" controlId="UpcomingActivityFormStatus">
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

export default ProviderHOC(UpcomingActivityModal);
