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

const ManagementFeeSchema = Yup.object().shape({
  management_fees_amount: Yup.number().required('This field is required!'),
  management_fees_percentage: Yup.number().required('This field is required!'),
  management_commission_type: Yup.string().trim().required('This field is required!'),
});

interface IProps {
  id: string | number;
  property?: ISingleProperty;
  updatePropertyDetails?: GenericMutationTrigger<Partial<ISingleProperty>, ISingleProperty>;
}

const ManagementFeeModal = ({ id, property, updatePropertyDetails }: IProps) => {
  const formik = useFormik({
    initialValues: {
      management_commission_type: property?.management_commission_type ?? ('percentage' as CommissionType),
      management_fees_percentage: property?.management_fees_percentage ?? 0,
      management_fees_amount: property?.management_fees_amount ?? '0',
    },
    validationSchema: ManagementFeeSchema,
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
      title={'Management Fees'}
      subtitle={'Update property management fee'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
    >
      <Row className="gx-sm-4 gx-0">
        <Col sm>
          <CustomSelect
            autoFocus
            labelText="Commission Type"
            controlId="ManagementFeeFormCommissionType"
            options={[
              { label: 'Percent', value: 'percentage' },
              { label: 'Fixed', value: 'fixed' },
            ]}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mx-sm-0 mx-1 mb-4',
            }}
            name="management_commission_type"
            value={values.management_commission_type}
            onSelectChange={value => setFieldValue('management_commission_type', value)}
            onBlurChange={() => setFieldTouched('management_commission_type', true)}
            isValid={touched.management_commission_type && !errors.management_commission_type}
            isInvalid={touched.management_commission_type && !!errors.management_commission_type}
            error={errors.management_commission_type}
          />
        </Col>
        <Col sm>
          <GroupedField
            wrapperClass="mx-sm-0 mx-1 mb-4"
            labelClass="popup-form-labels"
            controlId="ManagementFeeFormPercentage"
            icon={'%'}
            position="end"
            label="Fee Percentage"
            min="0"
            type="number"
            step={0.1}
            placeholder="50"
            name="management_fees_percentage"
            value={values.management_fees_percentage}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.management_fees_percentage && !errors.management_fees_percentage}
            isInvalid={touched.management_fees_percentage && !!errors.management_fees_percentage}
            error={errors.management_fees_percentage}
          />
        </Col>
        <Col sm>
          <GroupedField
            wrapperClass="mx-sm-0 mx-1 mb-4"
            labelClass="popup-form-labels"
            controlId="ManagementFeeFormAmount"
            icon={'$'}
            position="end"
            label="Fee Amount"
            min="0"
            type="number"
            placeholder="500"
            name="management_fees_amount"
            value={values.management_fees_amount}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.management_fees_amount && !errors.management_fees_amount}
            isInvalid={touched.management_fees_amount && !!errors.management_fees_amount}
            error={errors.management_fees_amount}
          />
        </Col>
      </Row>
    </Popup>
  );
};

export default ManagementFeeModal;
