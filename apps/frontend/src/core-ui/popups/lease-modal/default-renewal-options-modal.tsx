import { Col, Row } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { CustomSelect } from 'core-ui/custom-select';
import { GroupedField } from 'core-ui/grouped-field';
import { SwalExtended } from 'core-ui/sweet-alert';

import { renderFormError } from 'utils/functions';

import { RenewalChargeType } from 'interfaces/IGeneral';
import { ISingleProperty } from 'interfaces/IProperties';

const DefaultRenewalOptionSchema = Yup.object().shape({
  default_renewal_additional_fee: Yup.number().required('This field is required!'),
  default_renewal_charge_by: Yup.number().required('This field is required!'),
  default_renewal_terms: Yup.string().trim().required('This field is required!'),
});

interface IProps {
  id: string | number;
  property?: ISingleProperty;
  updatePropertyDetails?: GenericMutationTrigger<Partial<ISingleProperty>, ISingleProperty>;
}

const DefaultRenewalOptionsModal = ({ id, property, updatePropertyDetails }: IProps) => {
  const formik = useFormik({
    initialValues: {
      default_renewal_terms: property?.default_renewal_terms ?? ('monthly' as RenewalChargeType),
      default_renewal_charge_by: property?.default_renewal_charge_by ?? '',
      default_renewal_additional_fee: property?.default_renewal_additional_fee ?? '',
    },
    validationSchema: DefaultRenewalOptionSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      updatePropertyDetails &&
        updatePropertyDetails({
          ...values,
          id: Number(id),
          default_renewal_charge_by: Number(values.default_renewal_charge_by),
          default_renewal_additional_fee: Number(values.default_renewal_additional_fee),
        })
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
      title={'Default Renewal Options'}
      subtitle={'Update renewal options'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
    >
      <Row className="gx-sm-4 gx-0">
        <Col sm>
          <CustomSelect
            labelText="Terms"
            controlId="RenewalOptionsFormTerms"
            options={[
              { label: 'Monthly', value: 'monthly' },
              { label: 'Yearly', value: 'yearly' },
            ]}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mx-sm-0 mx-1 mb-4',
            }}
            name="default_renewal_terms"
            value={values.default_renewal_terms}
            onSelectChange={value => setFieldValue('default_renewal_terms', value)}
            onBlurChange={() => setFieldTouched('default_renewal_terms', true)}
            isValid={touched.default_renewal_terms && !errors.default_renewal_terms}
            isInvalid={touched.default_renewal_terms && !!errors.default_renewal_terms}
            error={errors.default_renewal_terms}
          />
        </Col>
        <Col sm>
          <GroupedField
            icon={'$'}
            position={'end'}
            name="default_renewal_charge_by"
            value={values.default_renewal_charge_by}
            controlId="RenewalOptionsFormChargeBy"
            wrapperClass="mx-sm-0 mx-1 mb-4"
            label="Charge by"
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.default_renewal_charge_by && !errors.default_renewal_charge_by}
            isInvalid={touched.default_renewal_charge_by && !!errors.default_renewal_charge_by}
            type="number"
            min="0"
            placeholder="50"
            error={errors.default_renewal_charge_by}
          />
        </Col>
        <Col sm>
          <GroupedField
            icon={'$'}
            position={'end'}
            name="default_renewal_additional_fee"
            controlId="RenewalOptionsFormAdditionalFee"
            wrapperClass="mx-sm-0 mx-1 mb-4"
            label="Additional Fee"
            value={values.default_renewal_additional_fee}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.default_renewal_additional_fee && !errors.default_renewal_additional_fee}
            isInvalid={touched.default_renewal_additional_fee && !!errors.default_renewal_additional_fee}
            type="number"
            min="0"
            placeholder="50"
            error={errors.default_renewal_additional_fee}
          />
        </Col>
      </Row>
    </Popup>
  );
};

export default DefaultRenewalOptionsModal;
