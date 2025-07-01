import { Badge, Col, Form, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { useFormik } from 'formik';
import { yupFilterInput, yupPhoneInput } from 'validations/base';
import * as Yup from 'yup';

import { useGetPropertyByIdQuery } from 'services/api/properties';
import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';
import { useGetUnitByIdQuery } from 'services/api/units';

import { Popup } from 'components/popup';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { InputPhone } from 'core-ui/input-phone';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';

import { getIDFromObject, getSearchFilter, isPositiveNumber, renderFormError } from 'utils/functions';

import { IApplicantForm } from 'interfaces/IApplications';
import { SearchObject } from 'interfaces/IGeneral';
import { IUnitsAPI } from 'interfaces/IUnits';

interface IProps {
  update?: boolean;
  applicant?: IApplicantForm;
  createApplicant?: GenericMutationTrigger<IApplicantForm, IApplicantForm>;
  updateApplicant?: GenericMutationTrigger<Partial<IApplicantForm>, IApplicantForm>;
}

const ApplicantSchema = Yup.object().shape({
  is_opened_for_edit: Yup.boolean(),
  property: yupFilterInput
    .required('this filed is required!')
    .test('LateFeePolicy', 'Late Fee is not configured and/or property is not vacant', (value, ctx) => {
      if (ctx.parent['is_opened_for_edit'] === true) return true;
      const opt = value.filter(
        f => (f as SearchObject).is_late_fee_policy_configured && (f as SearchObject).is_occupied === false
      );
      if (opt.length > 0) return true;
      return false;
    }),
  unit: yupFilterInput.required('this filed is required!').test('LateFeePolicy', 'Unit is not vacant', (value, ctx) => {
    if (ctx.parent['is_opened_for_edit'] === true) return true;
    const opt = value.filter(f => (f as SearchObject).is_occupied === false);
    if (opt.length > 0) return true;
    return false;
  }),
  first_name: Yup.string().trim().required('This field is required!'),
  last_name: Yup.string().trim().required('This field is required!'),
  email: Yup.string().trim().email().required('This field is required!'),
  phone_number: yupPhoneInput.required('This field is required!'),
  allow_email_for_rental_application: Yup.boolean()
    .oneOf([true, false], 'Selected value must be one of "true" or "false"')
    .default(false),
});

const NewApplicantsModal = ({ applicant, update = false, createApplicant, updateApplicant }: IProps) => {
  const {
    data: property,
    isLoading: propertyLoading,
    isFetching: propertyFetching,
  } = useGetPropertyByIdQuery(getIDFromObject('property_id', applicant));
  const {
    data: unit,
    isLoading: unitLoading,
    isFetching: unitFetching,
  } = useGetUnitByIdQuery(getIDFromObject('unit', applicant));

  const formik = useFormik({
    initialValues: {
      is_opened_for_edit: applicant && isPositiveNumber(applicant.id),
      property: property ? [property] : ([] as Option[]),
      unit: unit ? [unit] : ([] as Option[]),
      first_name: applicant?.first_name ?? '',
      last_name: applicant?.last_name ?? '',
      phone_number: applicant?.phone_number ?? '',
      email: applicant?.email ?? '',
      allow_email_for_rental_application: applicant?.allow_email_for_rental_application ?? false,
    },
    validationSchema: ApplicantSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      let unit_id = 0;
      if (values.unit && values.unit.length > 0) {
        unit_id = Number((values.unit as Array<IUnitsAPI>)[0].id);
      }

      const data: IApplicantForm = {
        ...values,
        unit: unit_id,
      };

      if (update && applicant && Number(applicant.id) > 0) {
        updateApplicant &&
          updateApplicant({ ...applicant, ...data, id: applicant.id })
            .then(result => {
              if (result.data) {
                SwalExtended.close({
                  isConfirmed: true,
                  value: { applicant: result.data.id, application: result.data.rental_application },
                });
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
      } else {
        createApplicant &&
          createApplicant(data)
            .then(result => {
              if (result.data) {
                SwalExtended.close({
                  isConfirmed: true,
                  value: { applicant: result.data.id, application: result.data.rental_application },
                });
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
      }
    },
  });

  const {
    handleSubmit,
    handleChange,
    touched,
    values,
    isSubmitting,
    handleReset,
    setFieldValue,
    setFieldTouched,
    handleBlur,
    errors,
  } = formik;

  return (
    <Popup
      title={`${update ? 'Update' : 'Add'} applicant detail`}
      subtitle="Fill out the information of the applicant for rental"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
    >
      <div className="mx-md-0 mx-sm-1 text-start">
        <Row className="gx-sm-4 gx-0 justify-content-between">
          <Col md={6}>
            <Form.Group className="mb-4" controlId="ApplicantFormFirstName">
              <Form.Label className="form-label-md">Legal First Name</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                name="first_name"
                placeholder="First Name"
                value={values.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.first_name && !errors.first_name}
                isInvalid={touched.first_name && !!errors.first_name}
              />

              <Form.Control.Feedback type="invalid">{errors.first_name}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-4" controlId="ApplicantFormLastName">
              <Form.Label className="form-label-md">Legal Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={values.last_name}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.last_name && !errors.last_name}
                isInvalid={touched.last_name && !!errors.last_name}
              />
              <Form.Control.Feedback type="invalid">{errors.last_name}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="gx-sm-4 gx-0">
          <Col md={6}>
            <Form.Group className="mb-4" controlId="ApplicantFormEmail">
              <Form.Label className="form-label-md">Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="johndoe@example.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.email && !errors.email}
                isInvalid={touched.email && !!errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-4" controlId="ApplicantFormPhone">
              <Form.Label className="form-label-md">Phone number</Form.Label>
              <InputPhone
                name="phone_number"
                value={values.phone_number}
                onPhoneNumberChange={phone => setFieldValue('phone_number', phone)}
                onBlur={handleBlur}
                isValid={touched.phone_number && !errors.phone_number}
                isInvalid={touched.phone_number && !!errors.phone_number}
              />
              <Form.Control.Feedback type="invalid">{errors.phone_number}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="gx-sm-4 gx-0">
          <Col>
            <Form.Group className="mb-4" controlId="ApplicantFormEmailApplicant">
              <Form.Check
                type={'checkbox'}
                label={`Email applicant for the rental application`}
                className="small text-primary"
                onChange={handleChange}
                onBlur={handleBlur}
                name="allow_email_for_rental_application"
                checked={values.allow_email_for_rental_application}
                isInvalid={touched.allow_email_for_rental_application && !!errors.allow_email_for_rental_application}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="gx-sm-4 gx-0">
          <Col md={6}>
            <FilterPaginateInput
              name="property"
              model_label="property.Property"
              labelText="Select Property"
              controlId={`ApplicantFormPropertyName`}
              placeholder={`Select`}
              classNames={{
                labelClass: 'popup-form-labels',
                wrapperClass: 'mb-3',
              }}
              selected={values.property}
              onSelectChange={selected => {
                if (selected.length) {
                  setFieldValue('property', selected);
                } else {
                  setFieldValue('property', []);
                }

                setFieldValue('unit', []);
              }}
              onBlurChange={() => setFieldTouched('property', true)}
              isValid={touched.property && !errors.property}
              isInvalid={touched.property && !!errors.property}
              labelKey={'name'}
              renderMenuItemChildren={(option: Option) => {
                const selected = option as SearchObject;
                return (
                  <div className="position-relative">
                    <div>
                      <div style={{ marginRight: '5rem' }} className="fw-medium">
                        {selected.name}
                      </div>
                      <p className="small text-wrap m-0 text-muted">
                        {selected.is_late_fee_policy_configured && selected.is_occupied === false
                          ? 'Verified'
                          : !selected.is_occupied
                            ? 'No unit found associated with this property'
                            : 'Please make sure the property is vacant and late fee policy is configured'}
                      </p>
                    </div>
                    <div className="position-absolute top-0 end-0">
                      <Badge
                        pill
                        bg={
                          selected.is_late_fee_policy_configured && selected.is_occupied === false
                            ? 'success'
                            : 'warning'
                        }
                        className="small fw-normal"
                      >
                        {selected.is_late_fee_policy_configured && selected.is_occupied === false
                          ? 'Available'
                          : 'Unavailable'}
                      </Badge>
                    </div>
                  </div>
                );
              }}
              disabled={propertyLoading || propertyFetching || (applicant && isPositiveNumber(applicant.id))}
              error={errors.property}
            />
          </Col>
          <Col md={6}>
            <FilterPaginateInput
              name="unit"
              labelText="Search Unit"
              model_label="property.Unit"
              filter={getSearchFilter(values.property, 'parent_property')}
              controlId={`ApplicantFormUnit`}
              placeholder={`Select Unit`}
              classNames={{
                labelClass: 'popup-form-labels',
                wrapperClass: 'mb-3',
              }}
              selected={values.unit}
              labelKey={'name'}
              onSelectChange={selected => {
                if (selected.length) {
                  setFieldValue('unit', selected);
                } else {
                  setFieldValue('unit', []);
                }
              }}
              onBlurChange={() => setFieldTouched('unit', true)}
              isValid={touched.unit && !errors.unit}
              isInvalid={touched.unit && !!errors.unit}
              preload={getSearchFilter(values.property, 'parent_property', true)}
              renderMenuItemChildren={(option: Option) => {
                const selected = option as SearchObject;
                return (
                  <div className="position-relative">
                    <div>
                      <div style={{ marginRight: '5rem' }} className="fw-medium">
                        {selected.name}
                      </div>
                      <p className="small text-wrap m-0 text-muted">
                        {selected.is_occupied === false
                          ? 'Available'
                          : !selected.is_occupied
                            ? 'No unit found associated with this property!'
                            : 'Unit is occupied'}
                      </p>
                    </div>
                    <div className="position-absolute top-0 end-0">
                      <Badge
                        pill
                        bg={selected.is_occupied === false ? 'success' : 'warning'}
                        className="small fw-normal"
                      >
                        {selected.is_occupied === false ? 'Available' : 'Occupied'}
                      </Badge>
                    </div>
                  </div>
                );
              }}
              disabled={
                values.property.length <= 0 ||
                unitFetching ||
                unitLoading ||
                (applicant && isPositiveNumber(applicant.id)) ||
                (touched.property && !!errors.property)
              }
              error={errors.unit}
            />
          </Col>
        </Row>
      </div>
    </Popup>
  );
};

export default ProviderHOC(NewApplicantsModal);
