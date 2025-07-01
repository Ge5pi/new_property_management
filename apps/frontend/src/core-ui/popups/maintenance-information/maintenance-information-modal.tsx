import { Col, Form, Row } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { GroupedField } from 'core-ui/grouped-field';
import { InputDate } from 'core-ui/input-date';
import { SwalExtended } from 'core-ui/sweet-alert';

import { renderFormError } from 'utils/functions';

import { ISingleProperty } from 'interfaces/IProperties';

const MaintenanceInformationSchema = Yup.object().shape({
  maintenance_limit_amount: Yup.number().required('This field is required!'),
  insurance_expiration_date: Yup.date().required('This field is required!'),
  has_home_warranty_coverage: Yup.boolean().oneOf([true, false], '"This field is required!"').default(false),
  home_warranty_company: Yup.string().when('has_home_warranty_coverage', {
    is: true,
    then: schema => schema.required('This field is required!'),
  }),
  home_warranty_expiration_date: Yup.date().when('has_home_warranty_coverage', {
    is: true,
    then: schema => schema.required('This field is required!'),
  }),
  maintenance_notes: Yup.string().required('This field is required!'),
});

interface IProps {
  id: string | number;
  property?: ISingleProperty;
  updatePropertyInformation?: GenericMutationTrigger<Partial<ISingleProperty>, ISingleProperty>;
}

const MaintenanceInformationModal = ({ id, property, updatePropertyInformation }: IProps) => {
  const formik = useFormik({
    initialValues: {
      maintenance_limit_amount: property?.maintenance_limit_amount ?? '',
      insurance_expiration_date: property?.insurance_expiration_date ?? '',
      has_home_warranty_coverage: property?.has_home_warranty_coverage ?? false,
      home_warranty_company: property?.home_warranty_company ?? '',
      home_warranty_expiration_date: property?.home_warranty_expiration_date ?? '',
      maintenance_notes: property?.maintenance_notes ?? '',
    },
    validationSchema: MaintenanceInformationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      const data = {
        ...values,
        home_warranty_company: values.has_home_warranty_coverage ? values.home_warranty_company : undefined,
        home_warranty_expiration_date: values.has_home_warranty_coverage
          ? values.home_warranty_expiration_date
          : undefined,
      };

      updatePropertyInformation &&
        updatePropertyInformation({ ...data, id: Number(id) })
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

  const { handleSubmit, handleChange, touched, values, setFieldValue, isSubmitting, handleReset, handleBlur, errors } =
    formik;

  return (
    <Popup
      title={'Maintenance Information'}
      subtitle={'Edit the property maintenance information'}
      onSubmit={handleSubmit}
      onReset={handleReset}
      isSubmitting={isSubmitting}
    >
      <Row className="gy-md-0 gy-3 gx-md-4 gx-sm-1 gx-0 align-items-stretch">
        <Col xl={4} sm>
          <GroupedField
            wrapperClass="mx-md-0 mx-sm-2 mx-1 mb-4"
            labelClass="popup-form-labels"
            controlId="MaintenanceInformationFormMaintenanceLimit"
            icon={'$'}
            position="end"
            label="Maintenance Limit"
            min="0"
            type="number"
            step={0.01}
            placeholder="0.00"
            name="maintenance_limit_amount"
            value={values.maintenance_limit_amount}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.maintenance_limit_amount && !errors.maintenance_limit_amount}
            isInvalid={touched.maintenance_limit_amount && !!errors.maintenance_limit_amount}
            error={errors.maintenance_limit_amount}
          />
        </Col>
        <Col xl={4} sm>
          <InputDate
            onBlur={handleBlur}
            minDate={new Date()}
            name={'insurance_expiration_date'}
            labelText={'Insurance Expiration'}
            controlId="MaintenanceInformationFormInsuranceExpiration"
            classNames={{ wrapperClass: 'mx-md-0 mx-sm-2 mx-1 mb-4', labelClass: 'popup-form-labels' }}
            onDateSelection={date => setFieldValue('insurance_expiration_date', date)}
            value={values.insurance_expiration_date}
            isValid={touched.insurance_expiration_date && !errors.insurance_expiration_date}
            isInvalid={touched.insurance_expiration_date && !!errors.insurance_expiration_date}
            error={errors.insurance_expiration_date}
          />
        </Col>

        <Col xs={12}>
          <Form.Group
            as={Row}
            className="justify-content-start gx-0 mx-md-0 mx-sm-2 mx-1 mb-4"
            controlId="MaintenanceInformationFormHasWarranty"
          >
            <Col xl={4} sm={'auto'}>
              <Form.Label className="popup-form-labels">Has home warranty coverage</Form.Label>
            </Col>
            <Col xs={'auto'}>
              <Form.Group className="ms-sm-3" controlId="MaintenanceInformationFormWarrantyYes">
                <Form.Check
                  type={'radio'}
                  label={`Yes`}
                  className="small text-primary"
                  defaultChecked={values.has_home_warranty_coverage}
                  name={'has_home_warranty_coverage'}
                  onChange={() => setFieldValue('has_home_warranty_coverage', !values.has_home_warranty_coverage)}
                  onBlur={handleBlur}
                  isInvalid={touched.has_home_warranty_coverage && !!errors.has_home_warranty_coverage}
                />
              </Form.Group>
            </Col>
            <Col xs={'auto'}>
              <Form.Group className="mx-3" controlId="MaintenanceInformationFormWarrantyNo">
                <Form.Check
                  type={'radio'}
                  label={`No`}
                  className="small text-primary"
                  defaultChecked={values.has_home_warranty_coverage === false}
                  name={'has_home_warranty_coverage'}
                  onChange={() => setFieldValue('has_home_warranty_coverage', !values.has_home_warranty_coverage)}
                  onBlur={handleBlur}
                  isInvalid={touched.has_home_warranty_coverage && !!errors.has_home_warranty_coverage}
                />
              </Form.Group>
            </Col>
          </Form.Group>
        </Col>

        <Col md={8} sm={6}>
          <Form.Group className="mx-md-0 mx-sm-2 mx-1 mb-4" controlId="MaintenanceInformationFormWarranty">
            <Form.Label className="popup-form-labels">Home warranty coverage</Form.Label>
            <Form.Control
              disabled={!values.has_home_warranty_coverage}
              readOnly={!values.has_home_warranty_coverage}
              type="text"
              placeholder="Home warranty coverage"
              name="home_warranty_company"
              value={values.home_warranty_company}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.home_warranty_company && !errors.home_warranty_company}
              isInvalid={touched.home_warranty_company && !!errors.home_warranty_company}
            />
            <Form.Control.Feedback type="invalid">{errors.home_warranty_company}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4} sm={6}>
          <InputDate
            onBlur={handleBlur}
            minDate={new Date()}
            disabled={!values.has_home_warranty_coverage}
            readOnly={!values.has_home_warranty_coverage}
            name="home_warranty_expiration_date"
            labelText="Warranty Expiration"
            controlId="MaintenanceInformationFormMaintenanceWarrantyExpiration"
            classNames={{ wrapperClass: 'mx-md-0 mx-sm-2 mx-1 mb-4', labelClass: 'popup-form-labels' }}
            onDateSelection={date => setFieldValue('home_warranty_expiration_date', date)}
            value={values.home_warranty_expiration_date}
            isValid={touched.home_warranty_expiration_date && !errors.home_warranty_expiration_date}
            isInvalid={touched.home_warranty_expiration_date && !!errors.home_warranty_expiration_date}
            error={errors.home_warranty_expiration_date}
          />
        </Col>

        <Col xs={12}>
          <Form.Group className="mx-md-0 mx-sm-2 mx-1 mb-4" controlId="MaintenanceInformationFormNote">
            <Form.Label className="popup-form-labels">Maintenance Notes</Form.Label>
            <Form.Control
              placeholder="Some text here"
              as="textarea"
              rows={5}
              name="maintenance_notes"
              value={values.maintenance_notes}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.maintenance_notes && !errors.maintenance_notes}
              isInvalid={touched.maintenance_notes && !!errors.maintenance_notes}
            />
            <Form.Control.Feedback type="invalid">{errors.maintenance_notes}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
    </Popup>
  );
};

export default MaintenanceInformationModal;
