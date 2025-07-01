import { useMemo } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

import { skipToken } from '@reduxjs/toolkit/query';
import { clsx } from 'clsx';
import { FormikValues, useFormik } from 'formik';
import * as Yup from 'yup';

import useResponse from 'services/api/hooks/useResponse';
import { useCreateGeneralTagMutation, useGetListOfGeneralTagsQuery } from 'services/api/system-preferences';
import { BaseQueryError } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';
import { TagsInput } from 'components/tags-input';

import { GroupedField } from 'core-ui/grouped-field';
import { InputDate } from 'core-ui/input-date';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { getReadableError, renderFormError } from 'utils/functions';

import { CustomOptionType } from 'interfaces/IInputs';
import { GeneralTags } from 'interfaces/ISettings';
import { ISingleUnit, ISingleUnitType } from 'interfaces/IUnits';

const RentalInformationSchema = Yup.object().shape({
  rental_information_for: Yup.string().trim().oneOf(['UNIT_TYPE', 'UNIT']),
  bed_rooms: Yup.number()
    .positive('Please input a valid positive number')
    .when('rental_information_for', {
      is: 'UNIT_TYPE',
      then: schema => schema.required('This field is required!'),
    }),
  bath_rooms: Yup.number()
    .positive('Please input a valid positive number')
    .when('rental_information_for', {
      is: 'UNIT_TYPE',
      then: schema => schema.required('This field is required!'),
    }),
  square_feet: Yup.number()
    .positive('Please input a valid positive number')
    .when('rental_information_for', {
      is: 'UNIT_TYPE',
      then: schema => schema.required('This field is required!'),
    }),
  apply_on_all_units: Yup.boolean(),
  market_rent: Yup.number().positive('Please input a valid positive number').required('This field is required!'),
  future_market_rent: Yup.number().required('This field is required!'),
  effective_date: Yup.date().required('This field is required!'),
  application_fee: Yup.number().positive('Please input a valid positive number').required('This field is required!'),
  estimate_turn_over_cost: Yup.number().required('This field is required!'),
  tags: Yup.array()
    .of(Yup.object())
    .when('rental_information_for', {
      is: 'UNIT_TYPE',
      then: schema => schema.min(1, 'Please add at least 1 tag').required('This field is required!'),
    }),
});

interface IProps {
  data?: Partial<ISingleUnitType>;
  rental_information_for: 'UNIT_TYPE' | 'UNIT';
  updateDataState: (data: Partial<ISingleUnitType>) => Promise<
    | {
        data: ISingleUnitType | ISingleUnit;
        error?: undefined;
      }
    | {
        data?: undefined;
        error: unknown;
      }
  >;
}

const RentalInformationModal = ({ data, updateDataState, rental_information_for }: IProps) => {
  const [createTag, { isError: isCreateGeneralTagError, error: createGeneralTagError }] = useCreateGeneralTagMutation();

  useResponse({
    isError: isCreateGeneralTagError,
    error: createGeneralTagError,
  });

  const handleTagCreation = async (name: string) => {
    return await createTag({ name }).then(result => {
      if (result.data) {
        return result.data;
      } else {
        const error = result.error as BaseQueryError;
        if (error.status === 400 && error.data) {
          Notify.show({
            type: 'danger',
            title: 'Something went wrong... Please try again',
          });
        }

        throw Error('unable to create new tag');
      }
    });
  };

  const handleFormSubmission = async (values: FormikValues) => {
    if (rental_information_for === 'UNIT') {
      const { market_rent, future_market_rent, effective_date, application_fee, estimate_turn_over_cost } =
        values as Partial<ISingleUnitType>;
      return await updateDataState({
        market_rent,
        future_market_rent,
        estimate_turn_over_cost,
        effective_date,
        application_fee,
      });
    }

    const tags: Array<number> = [];
    const promises: Array<Promise<GeneralTags>> = [];

    (values.tags as GeneralTags[]).forEach(selected => {
      if (typeof selected !== 'string' && 'customOption' in selected) {
        promises.push(handleTagCreation((selected as CustomOptionType).name));
      } else {
        tags.push(Number(selected.id));
      }
    });

    if (promises.length > 0) {
      await Promise.all(promises).then(results => {
        results.forEach(result => tags.push(Number(result.id)));
      });
    }

    return await updateDataState({ ...values, tags } as Partial<ISingleUnitType>);
  };

  const {
    data: tags_list,
    isLoading: tagsLoading,
    isFetching: tagsFetching,
  } = useGetListOfGeneralTagsQuery(data && data.tags ? data.tags : skipToken);

  const apply_on_all_units = useMemo(() => {
    if (rental_information_for === 'UNIT') return false;
    if (!data) return false;
    return data.apply_on_all_units;
  }, [data, rental_information_for]);

  const formik = useFormik({
    initialValues: {
      apply_on_all_units,
      bed_rooms: data?.bed_rooms ?? '',
      bath_rooms: data?.bath_rooms ?? '',
      square_feet: data?.square_feet ?? '',
      market_rent: data?.market_rent ?? '',
      rental_information_for: rental_information_for,
      future_market_rent: data?.future_market_rent ?? '',
      effective_date: data?.effective_date ?? '',
      application_fee: data?.application_fee ?? '',
      estimate_turn_over_cost: data?.estimate_turn_over_cost ?? '',
      tags: tags_list ? tags_list : [],
    },
    validationSchema: RentalInformationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      if (Object.keys(errors).some(er => ['bed_rooms', 'bath_rooms', 'square_feet', 'tags'].includes(er))) {
        setSubmitting(false);
        Notify.show({
          type: 'danger',
          title: 'One of the following information is invalid',
          description: `'bed_rooms', 'bath_rooms', 'square_feet', 'tags'\nPlease specify them in respective Unit Type`,
        });
        return;
      }

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
    touched,
    values,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
    handleReset,
    handleBlur,
    errors,
  } = formik;

  return (
    <Popup
      title={'Rental Information'}
      subtitle={'Edit the property Rental information'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
    >
      <Row className="gy-md-0 gy-3 gx-md-2 gx-sm-1 gx-0 align-items-stretch">
        <Col
          className={clsx(
            { 'col-xl-6 col-lg-7': rental_information_for === 'UNIT_TYPE' },
            { 'col-12': rental_information_for === 'UNIT' }
          )}
        >
          <Row className="gy-md-0 gy-3 gx-md-3 gx-sm-1 gx-0">
            <Col md={3} sm={6} className={clsx({ 'd-none': rental_information_for === 'UNIT' })}>
              <Form.Group className="mx-md-0 mx-sm-2 mx-1 mb-4" controlId="RentalInformationFormBedrooms">
                <Form.Label className="popup-form-labels">Bedrooms</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="02"
                  name="bed_rooms"
                  value={values.bed_rooms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={rental_information_for === 'UNIT'}
                  disabled={rental_information_for === 'UNIT'}
                  isValid={touched.bed_rooms && !errors.bed_rooms}
                  isInvalid={touched.bed_rooms && !!errors.bed_rooms}
                />
                <Form.Control.Feedback type="invalid">{errors.bath_rooms}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3} sm={6} className={clsx({ 'd-none': rental_information_for === 'UNIT' })}>
              <Form.Group className="mx-md-0 mx-sm-2 mx-1 mb-4" controlId="RentalInformationFormBathrooms">
                <Form.Label className="popup-form-labels">Bathrooms</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="03"
                  name="bath_rooms"
                  value={values.bath_rooms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={rental_information_for === 'UNIT'}
                  disabled={rental_information_for === 'UNIT'}
                  isValid={touched.bath_rooms && !errors.bath_rooms}
                  isInvalid={touched.bath_rooms && !!errors.bath_rooms}
                />
                <Form.Control.Feedback type="invalid">{errors.bath_rooms}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6} sm={'auto'} className={clsx({ 'd-none': rental_information_for === 'UNIT' })}>
              <GroupedField
                icon={'SQft'}
                position={'end'}
                controlId="RentalInformationFormSquareFeet"
                label="Square Feet"
                name="square_feet"
                value={values.square_feet}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.square_feet && !errors.square_feet}
                isInvalid={touched.square_feet && !!errors.square_feet}
                wrapperClass="mx-md-0 mx-sm-2 mx-1 mb-4"
                type="number"
                min="1"
                readOnly={rental_information_for === 'UNIT'}
                disabled={rental_information_for === 'UNIT'}
                placeholder="50"
                error={errors.square_feet}
              />
            </Col>

            <Col md={4} sm={'auto'}>
              <GroupedField
                icon={'$'}
                position={'end'}
                controlId="RentalInformationFormMarketRent"
                wrapperClass="mx-md-0 mx-sm-2 mx-1 mb-4"
                label="Market Rent"
                name="market_rent"
                value={values.market_rent}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.market_rent && !errors.market_rent}
                isInvalid={touched.market_rent && !!errors.market_rent}
                type="number"
                min="1"
                placeholder="50"
                step={0.01}
                error={errors.market_rent}
              />
            </Col>

            <Col md={4} sm={'auto'}>
              <GroupedField
                icon={'$'}
                position={'end'}
                name="application_fee"
                controlId="RentalInformationFormApplicationRent"
                wrapperClass="mx-md-0 mx-sm-2 mx-1 mb-4"
                label="Application Fee"
                value={values.application_fee}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.application_fee && !errors.application_fee}
                isInvalid={touched.application_fee && !!errors.application_fee}
                type="number"
                min="1"
                placeholder="50"
                step={0.01}
                error={errors.application_fee}
              />
            </Col>

            <Col md={6} sm={'auto'}>
              <GroupedField
                icon={'$'}
                position={'end'}
                name="future_market_rent"
                controlId="RentalInformationFormFutureMarketRent"
                wrapperClass="mx-md-0 mx-sm-2 mx-1 mb-4"
                label="Future Market Rent"
                value={values.future_market_rent}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.future_market_rent && !errors.future_market_rent}
                isInvalid={touched.future_market_rent && !!errors.future_market_rent}
                type="number"
                min="1"
                placeholder="50"
                step={0.01}
                error={errors.future_market_rent}
              />
            </Col>

            <Col md={6} sm={'auto'}>
              <GroupedField
                icon={'$'}
                position={'end'}
                name="estimate_turn_over_cost"
                value={values.estimate_turn_over_cost}
                controlId="RentalInformationFormEstimatedCost"
                wrapperClass="mx-md-0 mx-sm-2 mx-1 mb-4"
                label="Estimated Turnover Cost"
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.estimate_turn_over_cost && !errors.estimate_turn_over_cost}
                isInvalid={touched.estimate_turn_over_cost && !!errors.estimate_turn_over_cost}
                type="number"
                min="1"
                placeholder="50"
                step={0.01}
                error={errors.estimate_turn_over_cost}
              />
            </Col>

            <Col md={5} sm={'auto'}>
              <InputDate
                labelText={'Effective Date'}
                controlId="RentalInformationFormEffectiveDate"
                classNames={{ wrapperClass: 'mx-md-0 mx-sm-2 mx-1 mb-4', labelClass: 'popup-form-labels' }}
                onDateSelection={date => setFieldValue('effective_date', date)}
                name={'effective_date'}
                minDate={new Date()}
                value={values.effective_date}
                onBlur={handleBlur}
                isValid={touched.effective_date && !errors.effective_date}
                isInvalid={touched.effective_date && !!errors.effective_date}
                error={errors.effective_date}
              />
            </Col>
          </Row>
        </Col>

        <Col xl={6} lg className={clsx({ 'd-none': rental_information_for === 'UNIT' })}>
          <TagsInput
            name="tags"
            label={'Tags'}
            tags={values.tags as GeneralTags[]}
            onCreate={data => setFieldValue('tags', data)}
            isValid={touched.tags && !errors.tags}
            isInvalid={touched.tags && !!errors.tags}
            controlID={'RentalInformationFormTags'}
            onBlur={() => setFieldTouched('tags', true)}
            disabled={tagsLoading || tagsFetching || rental_information_for === 'UNIT'}
            error={errors.tags}
          />
        </Col>
        <Col xs={12} className={clsx({ 'd-none': rental_information_for === 'UNIT' })}>
          <Form.Group controlId="ApplyOnAllUnitsRentalInformationForm">
            <Form.Check
              type={'checkbox'}
              label={`Should apply these changes on all units?`}
              className="small text-primary"
              name="apply_on_all_units"
              onBlur={handleBlur}
              onChange={ev => {
                setFieldValue('apply_on_all_units', ev.target.checked);
              }}
              checked={values.apply_on_all_units}
              isInvalid={touched.apply_on_all_units && !!errors.apply_on_all_units}
              disabled={rental_information_for === 'UNIT'}
              readOnly={rental_information_for === 'UNIT'}
            />
          </Form.Group>
        </Col>
      </Row>
    </Popup>
  );
};

export default ProviderHOC(RentalInformationModal);
