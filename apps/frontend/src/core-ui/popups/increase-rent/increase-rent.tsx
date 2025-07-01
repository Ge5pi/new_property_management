import { Col, Form, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { FormikValues, useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import useResponse from 'services/api/hooks/useResponse';
import { useIncreaseRentMutation } from 'services/api/properties';
import { BaseQueryError } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { GroupedField } from 'core-ui/grouped-field';
import { InputDate } from 'core-ui/input-date';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';

import { renderFormError } from 'utils/functions';

import { CommissionType } from 'interfaces/IAssets';
import { IIncreaseRentAPI, IPropertyAPI } from 'interfaces/IProperties';

const RentIncreaseSchema = Yup.object().shape({
  property_name: yupFilterInput.required('this filed is required!'),
  rent_increase_type: Yup.string()
    .trim()
    .oneOf(['fixed', 'percentage'], 'Select a valid value')
    .required('This field is required!'),
  rent_increase: Yup.number().positive().required('This field is required!'),
  schedule_increase: Yup.boolean().required('this field is required!').default(false),
  schedule_increase_date: Yup.date().when('schedule_increase', {
    is: true,
    then: schema => schema.required('This field is required!'),
  }),
});

const IncreaseRent = () => {
  const [increaseRent, { isSuccess: isIncreaseRentSuccess, isError: isIncreaseRentError, error: increaseRentError }] =
    useIncreaseRentMutation();

  useResponse({
    isSuccess: isIncreaseRentSuccess,
    successTitle: 'Rent has been increased successfully!',
    isError: isIncreaseRentError,
    error: increaseRentError,
  });

  const handleFormSubmission = async (values: FormikValues) => {
    let property_id = -1;
    if (values.property_name && values.property_name.length > 0) {
      property_id = Number((values.property_name as Array<IPropertyAPI>)[0].id);
    }

    const data = {
      ...values,
      parent_property: Number(property_id),
      schedule_increase_date: values.schedule_increase_date ? values.schedule_increase_date : undefined,
    };

    return await increaseRent(data as IIncreaseRentAPI);
  };

  const formik = useFormik({
    initialValues: {
      property_name: [] as Option[],
      rent_increase: '',
      rent_increase_type: 'fixed' as CommissionType,
      schedule_increase: false,
      schedule_increase_date: '',
    },
    validationSchema: RentIncreaseSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
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
        .finally(() => {
          setSubmitting(false);
          SwalExtended.hideLoading();
        });
    },
  });

  const {
    handleSubmit,
    handleChange,
    touched,
    values,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
    handleReset,
    handleBlur,
    errors,
  } = formik;

  return (
    <Popup
      title={'Increase rent form'}
      subtitle={'Provide the rent details in this form'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
    >
      <div className="mx-md-0 mx-sm-1 text-start">
        <div className="mb-4">
          <FilterPaginateInput
            name="property_name"
            model_label="property.Property"
            labelText="Select Property"
            controlId={`IncreaseRentFormProperty`}
            placeholder={`Select`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            selected={values.property_name}
            onSelectChange={selected => {
              if (selected.length) {
                setFieldValue('property_name', selected);
              } else {
                setFieldValue('property_name', []);
              }
            }}
            labelKey={'name'}
            onBlurChange={() => setFieldTouched('property_name', true)}
            isValid={touched.property_name && !errors.property_name}
            isInvalid={touched.property_name && !!errors.property_name}
            error={errors.property_name}
          />
        </div>
        <div className="mb-4">
          <p className="rent-group-label text-primary">Set rent increase</p>
          <p className="rent-group-label text-primary mb-1">By</p>
          <Row className="gx-1 gy-2">
            <Col>
              <Row className="gx-2">
                <Form.Group as={Col} xs={'auto'} controlId="RentFormFlat">
                  <Form.Check
                    type={'radio'}
                    label={`Flat amount`}
                    className="small text-primary"
                    name="rent_increase_type"
                    onBlur={handleBlur}
                    onChange={() => {
                      setFieldValue('rent_increase_type', 'fixed');
                    }}
                    checked={values.rent_increase_type === 'fixed'}
                    isInvalid={touched.rent_increase_type && !!errors.rent_increase_type}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={'auto'} controlId="RentFormPercentage">
                  <Form.Check
                    type={'radio'}
                    label={`Percentage`}
                    className="small text-primary"
                    name="rent_increase_type"
                    onBlur={handleBlur}
                    onChange={() => {
                      setFieldValue('rent_increase_type', 'percentage');
                    }}
                    checked={values.rent_increase_type === 'percentage'}
                    isInvalid={touched.rent_increase_type && !!errors.rent_increase_type}
                  />
                </Form.Group>

                <Col sm={10}>
                  <GroupedField
                    labelClass="popup-form-labels"
                    controlId="RentFormIncreaseRentValue"
                    wrapperClass="mt-1"
                    icon={values.rent_increase_type === 'fixed' ? '$' : '%'}
                    position="end"
                    min="0"
                    type="number"
                    placeholder="50"
                    step={0.1}
                    name="rent_increase"
                    value={values.rent_increase}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.rent_increase && !errors.rent_increase}
                    isInvalid={touched.rent_increase && !!errors.rent_increase}
                    error={errors.rent_increase}
                  />
                </Col>
              </Row>
            </Col>
            <Col md={5}>
              <Form.Group controlId="RentFormSchedule">
                <Form.Check
                  type={'checkbox'}
                  label={`Schedule Increase`}
                  className="small text-primary"
                  name="schedule_increase"
                  onBlur={handleBlur}
                  onChange={() => {
                    setFieldValue('schedule_increase', !values.schedule_increase);
                  }}
                  checked={values.schedule_increase === true}
                  isInvalid={touched.schedule_increase && !!errors.schedule_increase}
                />
              </Form.Group>

              <InputDate
                minDate={new Date()}
                name={'schedule_increase_date'}
                controlId="RentFormScheduleDate"
                classNames={{ wrapperClass: 'mt-1' }}
                value={values.schedule_increase_date}
                onDateSelection={date => setFieldValue('schedule_increase_date', date)}
                onBlur={() => setFieldTouched('schedule_increase_date', true)}
                isValid={touched.schedule_increase_date && !errors.schedule_increase_date}
                isInvalid={touched.schedule_increase_date && !!errors.schedule_increase_date}
                disabled={values.schedule_increase === false}
                readOnly={values.schedule_increase === false}
                error={errors.schedule_increase_date}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Popup>
  );
};

export default ProviderHOC(IncreaseRent);
