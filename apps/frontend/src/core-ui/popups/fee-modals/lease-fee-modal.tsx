import { Col, Row } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { CustomSelect } from 'core-ui/custom-select';
import { GroupedField } from 'core-ui/grouped-field';
import { SwalExtended } from 'core-ui/sweet-alert';

import { renderFormError } from 'utils/functions';

import { CommissionType } from 'interfaces/IAssets';
import { ISingleProperty } from 'interfaces/IProperties';

const LeaseFeeSchema = Yup.object().shape({
  lease_fees_amount: Yup.number().required('This field is required!'),
  lease_fees_percentage: Yup.number().required('This field is required!'),
  lease_fees_commission_type: Yup.string().trim().required('This field is required!'),
});

interface IProps {
  id: string | number;
  property?: ISingleProperty;
  updatePropertyDetails?: GenericMutationTrigger<Partial<ISingleProperty>, ISingleProperty>;
}

const LeaseFeeModal = ({ id, property, updatePropertyDetails }: IProps) => {
  const formik = useFormik({
    initialValues: {
      lease_fees_commission_type: property?.lease_fees_commission_type ?? ('percentage' as CommissionType),
      lease_fees_percentage: property?.lease_fees_percentage ?? 0,
      lease_fees_amount: property?.lease_fees_amount ?? '0',
    },
    validationSchema: LeaseFeeSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      updatePropertyDetails &&
        updatePropertyDetails({ ...values, id: Number(id) })
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
      title={'Lease Fees'}
      subtitle={'Update the property lease fee'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
    >
      <Row className="gx-sm-4 gx-0">
        <Col sm>
          <CustomSelect
            autoFocus
            labelText="Commission Type"
            controlId="LaseFeeFormCommissionType"
            options={[
              { label: 'Percent', value: 'percentage' },
              { label: 'Fixed', value: 'fixed' },
            ]}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mx-sm-0 mx-1 mb-4',
            }}
            name="lease_fees_commission_type"
            value={values.lease_fees_commission_type}
            onSelectChange={value => setFieldValue('lease_fees_commission_type', value)}
            onBlurChange={() => setFieldTouched('lease_fees_commission_type', true)}
            isValid={touched.lease_fees_commission_type && !errors.lease_fees_commission_type}
            isInvalid={touched.lease_fees_commission_type && !!errors.lease_fees_commission_type}
            error={errors.lease_fees_commission_type}
          />
        </Col>
        <Col sm>
          <GroupedField
            wrapperClass="mb-4"
            labelClass="popup-form-labels"
            controlId="LaseFeeFormPercentage"
            icon={'%'}
            position="end"
            label="Fee Percentage"
            min="0"
            type="number"
            step={0.1}
            placeholder="50"
            name="lease_fees_percentage"
            value={values.lease_fees_percentage}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.lease_fees_percentage && !errors.lease_fees_percentage}
            isInvalid={touched.lease_fees_percentage && !!errors.lease_fees_percentage}
            error={errors.lease_fees_percentage}
          />
        </Col>
        <Col sm>
          <GroupedField
            wrapperClass="mb-4"
            labelClass="popup-form-labels"
            controlId="LaseFeeFormAmount"
            icon={'$'}
            position="end"
            label="Fee Amount"
            min="0"
            type="number"
            step={0.1}
            placeholder="50"
            name="lease_fees_amount"
            value={values.lease_fees_amount}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.lease_fees_amount && !errors.lease_fees_amount}
            isInvalid={touched.lease_fees_amount && !!errors.lease_fees_amount}
            error={errors.lease_fees_amount}
          />
        </Col>
      </Row>
    </Popup>
  );
};

export default LeaseFeeModal;
