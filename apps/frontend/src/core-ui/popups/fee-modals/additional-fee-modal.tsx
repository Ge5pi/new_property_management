import { Col, Form, Row } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { CustomSelect } from 'core-ui/custom-select';
import { GroupedField } from 'core-ui/grouped-field';
import { SwalExtended } from 'core-ui/sweet-alert';

import { renderFormError } from 'utils/functions';

import { ISingleProperty } from 'interfaces/IProperties';

const LeaseFeeSchema = Yup.object().shape({
  additional_fees_gl_account: Yup.string().trim().required('This field is required!'),
  additional_fees_percentage: Yup.number().required('This field is required!'),
  addition_fees_suppress: Yup.boolean()
    .required('This field is required!')
    .oneOf([true, false], 'Selected value must be one of "true" or "false"')
    .default(false),
});

interface IProps {
  id: string | number;
  property?: ISingleProperty;
  updatePropertyDetails?: GenericMutationTrigger<Partial<ISingleProperty>, ISingleProperty>;
}

const AdditionalFeeModal = ({ id, property, updatePropertyDetails }: IProps) => {
  const formik = useFormik({
    initialValues: {
      additional_fees_gl_account: property?.additional_fees_gl_account ?? '',
      additional_fees_percentage: property?.additional_fees_percentage ?? 0,
      addition_fees_suppress: property?.addition_fees_suppress ?? false,
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
      title={'Additional Fees'}
      subtitle={'Apply any additional fee for the property'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
    >
      <Row className="g-0">
        <Col xl={6} lg={8}>
          <CustomSelect
            autoFocus
            labelText="GL Account"
            controlId="AdditionalFeeFormAccount"
            options={[
              {
                label: '15454589 98598956 6566',
                value: '15454589 98598956 6566',
              },
            ]}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-4',
            }}
            name="additional_fees_gl_account"
            value={values.additional_fees_gl_account}
            onSelectChange={value => setFieldValue('additional_fees_gl_account', value)}
            onBlurChange={() => setFieldTouched('additional_fees_gl_account', true)}
            isValid={touched.additional_fees_gl_account && !errors.additional_fees_gl_account}
            isInvalid={touched.additional_fees_gl_account && !!errors.additional_fees_gl_account}
            error={errors.additional_fees_gl_account}
          />
        </Col>
      </Row>
      <Row className="g-0">
        <Col>
          <GroupedField
            wrapperClass="mb-4"
            labelClass="popup-form-labels"
            controlId="AdditionalFeeFormPercentage"
            icon={'%'}
            position="end"
            min="0"
            type="number"
            step={0.1}
            label="Percentage"
            placeholder="50"
            name="additional_fees_percentage"
            value={values.additional_fees_percentage}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.additional_fees_percentage && !errors.additional_fees_percentage}
            isInvalid={touched.additional_fees_percentage && !!errors.additional_fees_percentage}
            error={errors.additional_fees_percentage}
          />
        </Col>
        <Col>
          <Form.Group className="ms-sm-4 ms-3 mb-4" controlId="AdditionalFeeFormSuppress">
            <Form.Label className="popup-form-labels">Suppress</Form.Label>
            <Row className="g-0 mt-2">
              <Form.Group as={Col} xs={'auto'} controlId="AdditionalFeeFormSuppressYes">
                <Form.Check
                  type={'radio'}
                  label={`Yes`}
                  className="small text-primary"
                  name="addition_fees_suppress"
                  defaultChecked={values.addition_fees_suppress === true}
                  onChange={() => setFieldValue('addition_fees_suppress', true)}
                  onBlur={() => setFieldTouched('addition_fees_suppress')}
                  isInvalid={touched.addition_fees_suppress && !!errors.addition_fees_suppress}
                />
              </Form.Group>
              <Form.Group as={Col} xs={'auto'} className="ms-3" controlId="AdditionalFeeFormSuppressNo">
                <Form.Check
                  type={'radio'}
                  label={`No`}
                  className="small text-primary"
                  name="addition_fees_suppress"
                  defaultChecked={values.addition_fees_suppress === false}
                  onChange={() => setFieldValue('addition_fees_suppress', false)}
                  onBlur={() => setFieldTouched('addition_fees_suppress')}
                  isInvalid={touched.addition_fees_suppress && !!errors.addition_fees_suppress}
                />
              </Form.Group>
            </Row>
          </Form.Group>
        </Col>
      </Row>
    </Popup>
  );
};

export default AdditionalFeeModal;
