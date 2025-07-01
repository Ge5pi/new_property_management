import { Col, Form, Row } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useUpdatePropertiesInformationMutation } from 'services/api/properties';
import { BaseQueryError } from 'services/api/types/rtk-query';
import { useUpdateUnitTypesInformationMutation } from 'services/api/unit-types';

import { Popup } from 'components/popup';

import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { getReadableError, renderFormError } from 'utils/functions';

import { IAmenities } from 'interfaces/IGeneral';

const AmenitiesSchema = Yup.object().shape({
  is_smoking_allowed: Yup.boolean()
    .oneOf([true, false], 'Selected value must be one of "true" or "false"')
    .default(false),
  is_cat_allowed: Yup.boolean().oneOf([true, false], 'Selected value must be one of "true" or "false"').default(false),
  is_dog_allowed: Yup.boolean().oneOf([true, false], 'Selected value must be one of "true" or "false"').default(false),
});

interface IProps {
  id?: number;
  parent: number;
  data: IAmenities;
  variant: 'properties' | 'unit-types';
}

const AmenitiesModal = ({ variant, data, parent, id }: IProps) => {
  const [updatePropertyAmenities] = useUpdatePropertiesInformationMutation();
  const [updateUnitTypeAmenities] = useUpdateUnitTypesInformationMutation();

  const handleFormSubmission = async (values: IAmenities) => {
    const response =
      variant === 'properties'
        ? await updatePropertyAmenities({ ...values, id }).unwrap()
        : await updateUnitTypeAmenities({ ...values, parent_property: parent, id }).unwrap();

    return {
      data: response,
      feedback: `You have updated amenities preferences`,
      status: 'success' as 'success' | 'warning',
    };
  };

  const formik = useFormik({
    initialValues: {
      is_smoking_allowed: data?.is_smoking_allowed ?? false,
      is_cat_allowed: data?.is_cat_allowed ?? false,
      is_dog_allowed: data?.is_dog_allowed ?? false,
    },
    validationSchema: AmenitiesSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      handleFormSubmission(values)
        .then(result => {
          Notify.show({ type: result.status, title: result.feedback });
          SwalExtended.close({ isConfirmed: true, value: Number(result.data.id) });
        })
        .catch(err => {
          Notify.show({ type: 'danger', title: 'Something went wrong!', description: getReadableError(err) });
          const error = err as BaseQueryError;
          if (error.status === 400 && error.data) {
            renderFormError(error.data, setFieldError);
          }
        })
        .finally(() => {
          setSubmitting(false);
          SwalExtended.hideLoading();
        });
    },
  });

  const { handleSubmit, touched, values, setFieldValue, setFieldTouched, isSubmitting, handleReset, errors } = formik;

  return (
    <Popup
      title={'Amenities'}
      subtitle={'Update property amenities'}
      onSubmit={handleSubmit}
      onReset={handleReset}
      isSubmitting={isSubmitting}
    >
      <Row className="gx-0 py-2 border-bottom">
        <Col>Cats allowed</Col>
        <Form.Group as={Col} xs={'auto'} controlId="AmenitiesFormCatsYes">
          <Form.Check
            type={'radio'}
            label={`Yes`}
            className="small text-primary"
            name="is_cat_allowed"
            defaultChecked={values.is_cat_allowed === true}
            onChange={() => setFieldValue('is_cat_allowed', true)}
            onBlur={() => setFieldTouched('is_cat_allowed')}
            isInvalid={touched.is_cat_allowed && !!errors.is_cat_allowed}
          />
        </Form.Group>
        <Form.Group as={Col} xs={'auto'} className="ms-3" controlId="AmenitiesFormCatsNo">
          <Form.Check
            type={'radio'}
            label={`No`}
            className="small text-primary"
            name="is_cat_allowed"
            defaultChecked={values.is_cat_allowed === false}
            onChange={() => setFieldValue('is_cat_allowed', false)}
            onBlur={() => setFieldTouched('is_cat_allowed')}
            isInvalid={touched.is_cat_allowed && !!errors.is_cat_allowed}
          />
        </Form.Group>
      </Row>
      <Row className="gx-0 py-2 border-bottom">
        <Col>Dogs allowed</Col>
        <Form.Group as={Col} xs={'auto'} controlId="AmenitiesFormDogsYes">
          <Form.Check
            type={'radio'}
            label={`Yes`}
            className="small text-primary"
            name="is_dog_allowed"
            defaultChecked={values.is_dog_allowed === true}
            onChange={() => setFieldValue('is_dog_allowed', true)}
            onBlur={() => setFieldTouched('is_dog_allowed')}
            isInvalid={touched.is_dog_allowed && !!errors.is_dog_allowed}
          />
        </Form.Group>
        <Form.Group as={Col} xs={'auto'} className="ms-3" controlId="AmenitiesFormDogsNo">
          <Form.Check
            type={'radio'}
            label={`No`}
            className="small text-primary"
            name="is_dog_allowed"
            defaultChecked={values.is_dog_allowed === false}
            onChange={() => setFieldValue('is_dog_allowed', false)}
            onBlur={() => setFieldTouched('is_dog_allowed')}
            isInvalid={touched.is_dog_allowed && !!errors.is_dog_allowed}
          />
        </Form.Group>
      </Row>
      <Row className="gx-0 py-2 border-bottom">
        <Col>Smoking allowed</Col>
        <Form.Group as={Col} xs={'auto'} controlId="AmenitiesFormSmokingYes">
          <Form.Check
            type={'radio'}
            label={`Yes`}
            className="small text-primary"
            name="is_smoking_allowed"
            defaultChecked={values.is_smoking_allowed === true}
            onChange={() => setFieldValue('is_smoking_allowed', true)}
            onBlur={() => setFieldTouched('is_smoking_allowed')}
            isInvalid={touched.is_smoking_allowed && !!errors.is_smoking_allowed}
          />
        </Form.Group>
        <Form.Group as={Col} xs={'auto'} className="ms-3" controlId="AmenitiesFormSmokingNo">
          <Form.Check
            type={'radio'}
            label={`No`}
            className="small text-primary"
            name="is_smoking_allowed"
            defaultChecked={values.is_smoking_allowed === false}
            onChange={() => setFieldValue('is_smoking_allowed', false)}
            onBlur={() => setFieldTouched('is_smoking_allowed')}
            isInvalid={touched.is_smoking_allowed && !!errors.is_smoking_allowed}
          />
        </Form.Group>
      </Row>
    </Popup>
  );
};

export default ProviderHOC(AmenitiesModal);
