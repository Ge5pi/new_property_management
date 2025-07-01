import { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Stack } from 'react-bootstrap';

import { clsx } from 'clsx';
import { FormikValues, useFormik } from 'formik';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import {
  useCreateBusinessInformationMutation,
  useGetBusinessInformationQuery,
  useUpdateBusinessInformationMutation,
} from 'services/api/business-information';
import useResponse from 'services/api/hooks/useResponse';
import { BaseQueryError } from 'services/api/types/rtk-query';

import { Dropzone } from 'components/dropzone';
import { SubmitBtn } from 'components/submit-button';

import { CustomSelect } from 'core-ui/custom-select';
import { DeleteBtn } from 'core-ui/delete-btn';
import { InputPhone } from 'core-ui/input-phone';
import { LazyImage } from 'core-ui/lazy-image';
import { Notify } from 'core-ui/toast';

import { useUploader } from 'hooks/useUploader';
import { useWindowSize } from 'hooks/useWindowSize';

import { FILE_TYPES_IMAGES } from 'constants/file-types';
import { getReadableError, renderFormError } from 'utils/functions';

import { TaxIdentityType } from 'interfaces/IPeoples';
import { IBusinessInformation } from 'interfaces/ISettings';

import formFields from './components/form-fields';
import formValidation from './components/form-validation';

import countries from 'data/countries.json';

const BusinessInformation = () => {
  const business = useGetBusinessInformationQuery();

  return (
    <ApiResponseWrapper
      {...business}
      renderResults={data => {
        const bizInformation = data.length > 0 ? data[data.length - 1] : null;
        return <BusinessInformationForm bizInformation={bizInformation} />;
      }}
    />
  );
};

interface IProps {
  bizInformation: IBusinessInformation | null;
}

const BusinessInformationForm = ({ bizInformation }: IProps) => {
  const [preview, setPreview] = useState<string | undefined>();
  const { setSelectedFiles, selectedFiles, setTotalFiles, handleUpload, isUploading } =
    useUploader('business-information');

  const [createBusinessInformation, { isLoading, isSuccess, isError, error }] = useCreateBusinessInformationMutation();
  const [
    updateBusinessInformation,
    {
      isLoading: isLoadingUpdateBusinessInformation,
      isSuccess: isSuccessUpdateBusinessInformation,
      isError: isErrorUpdateBusinessInformation,
      error: errorUpdateUpdateBusinessInformation,
    },
  ] = useUpdateBusinessInformationMutation();

  useResponse({
    isSuccess,
    isError,
    successTitle: 'Business information created successfully',
    errorTitle: 'Error creating business information',
    error,
  });

  useResponse({
    isSuccess: isSuccessUpdateBusinessInformation,
    isError: isErrorUpdateBusinessInformation,
    successTitle: 'Business information updated successfully',
    errorTitle: 'Error updating business information',
    error: errorUpdateUpdateBusinessInformation,
  });

  const handleFormSubmission = async (values: FormikValues) => {
    let photo = null;
    if (selectedFiles && selectedFiles.length > 0) {
      photo = await handleUpload(selectedFiles[0]);
    }

    if (bizInformation && bizInformation.id) {
      return await updateBusinessInformation({
        ...values,
        logo: photo ? photo.unique_name : values.logo,
        id: bizInformation.id,
      });
    } else {
      if (!photo) return Promise.reject('Incomplete information provided!');
      return await createBusinessInformation({ ...values, logo: photo.unique_name } as IBusinessInformation);
    }
  };
  const formik = useFormik({
    initialValues: {
      name: bizInformation?.name ?? '',
      description: bizInformation?.description ?? '',
      building_or_office_number: bizInformation?.building_or_office_number ?? '',
      street: bizInformation?.street ?? '',
      city: bizInformation?.city ?? '',
      postal_code: bizInformation?.postal_code ?? '',
      state: bizInformation?.state ?? '',
      country: bizInformation?.country ?? '',
      primary_email: bizInformation?.primary_email ?? '',
      secondary_email: bizInformation?.secondary_email ?? '',
      phone_number: bizInformation?.phone_number ?? '',
      telephone_number: bizInformation?.telephone_number ?? '',
      tax_identity_type: bizInformation?.tax_identity_type ?? ('EIN' as TaxIdentityType),
      tax_payer_id: bizInformation?.tax_payer_id ?? '',
      logo: bizInformation?.logo ?? null,
    },
    enableReinitialize: true,
    validationSchema: formValidation,
    onSubmit: (values, { setFieldError, setSubmitting }) => {
      setSubmitting(true);
      handleFormSubmission(values)
        .then(result => {
          if (result.data) {
            setSelectedFiles([]);
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
        .finally(() => setSubmitting(false));
    },
  });

  useEffect(() => {
    if (bizInformation && typeof bizInformation.logo === 'string') {
      setPreview(bizInformation.logo);
    }
  }, [bizInformation]);

  const {
    errors,
    touched,
    handleSubmit,
    handleBlur,
    handleChange,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    values,
    handleReset,
  } = formik;

  const {
    name,
    description,
    building_or_office_number,
    phone_number,
    city,
    country,
    postal_code,
    primary_email,
    secondary_email,
    state,
    street,
    telephone_number,
    tax_identity_type,
    tax_payer_id,
    logo,
  } = formFields;

  const [width] = useWindowSize();
  const handleImageRemove = async () => {
    setSelectedFiles([]);
    setFieldValue('logo', null);
    setPreview(undefined);
  };

  const onDrop = (acceptedFiles: Array<File>) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = function (e: ProgressEvent<FileReader>) {
        const target = e.target;
        if (target && target.result) {
          setPreview(target.result.toString());
        }
      };

      reader.readAsDataURL(file);

      setSelectedFiles([file]);
      setFieldValue('logo', [file]);
      setTotalFiles(acceptedFiles.length);
    }
  };
  return (
    <div className="mt-4">
      <Card className="py-3 p-0">
        <Card.Header className="px-4 bg-transparent border-0">
          <h1 className="fs-5 fw-bold mb-5">Business Information</h1>
        </Card.Header>

        <Card.Body className="p-0">
          <Form onSubmit={handleSubmit} onReset={handleReset}>
            <Row className="px-4 gx-4 gy-3 mb-4">
              <Col md={6} lg={5} xl={4}>
                {values.logo || typeof preview === 'string' ? (
                  <div className={'rounded-1 border border-dark overflow-hidden position-relative'}>
                    <DeleteBtn
                      resetCSS
                      style={{ zIndex: 1250 }}
                      className="position-absolute rounded-circle bg-white end-0 m-3"
                      onClick={handleImageRemove}
                    />
                    <LazyImage src={preview} size="4x3" />
                  </div>
                ) : (
                  <Form.Group controlId="BusinessInfoFormImage">
                    <div className="ratio ratio-4x3">
                      <Dropzone
                        onDrop={onDrop}
                        name={logo.name}
                        accept={FILE_TYPES_IMAGES}
                        onError={error => setFieldError(logo.name, error.message)}
                        maxSize={5242880}
                        multiple={false}
                        maxFiles={1}
                      />
                    </div>
                    <Form.Control.Feedback
                      type="invalid"
                      className={touched.logo && !!errors.logo ? 'd-block' : 'd-none'}
                    >
                      {errors.logo}
                    </Form.Control.Feedback>
                    <p className="mb-0 form-label-md">Logo Here</p>
                  </Form.Group>
                )}
              </Col>
              <Col md={6} lg={7} xl={5} xxl={4}>
                <Form.Group className="mb-4" controlId="BusinessInfoFormBusinessName">
                  <Form.Label className="form-label-md">Business Name</Form.Label>
                  <Form.Control
                    type="text"
                    name={name.name}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    isValid={touched.name && !errors.name}
                    isInvalid={touched.name && !!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-4" controlId="BusinessInfoFormDescription">
                  <Form.Label className="form-label-md">Business Description</Form.Label>
                  <Form.Control
                    type="text"
                    as="textarea"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name={description.name}
                    value={values.description}
                    isValid={touched.description && !errors.description}
                    isInvalid={touched.description && !!errors.description}
                    placeholder="Type Here.."
                  />
                  <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <hr className="m-0" />

            <Row className="px-4">
              <Col
                lg={6}
                className={clsx('py-4 pe-lg-5', { 'border-end border-primary border-opacity-25': width > 992 })}
              >
                <p className="fw-bold mb-4">Address Details</p>
                <Form.Group className="mb-4" controlId="BusinessInfoFormBuildingOffice">
                  <Form.Label className="form-label-md">Building / Office #</Form.Label>
                  <Form.Control
                    type="text"
                    name={building_or_office_number.name}
                    value={values.building_or_office_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    isValid={touched.building_or_office_number && !errors.building_or_office_number}
                    isInvalid={touched.building_or_office_number && !!errors.building_or_office_number}
                  />
                  <Form.Control.Feedback type="invalid">{errors.building_or_office_number}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-4" controlId="BusinessInfoFormStreet">
                  <Form.Label className="form-label-md">Street</Form.Label>
                  <Form.Control
                    name={street.name}
                    type="text"
                    value={values.street}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    isValid={touched.street && !errors.street}
                    isInvalid={touched.street && !!errors.street}
                  />
                  <Form.Control.Feedback type="invalid">{errors.street}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-4" controlId="BusinessInfoFormCity">
                  <Form.Label className="form-label-md">City</Form.Label>
                  <Form.Control
                    name={city.name}
                    type="text"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    isValid={touched.city && !errors.city}
                    isInvalid={touched.city && !!errors.city}
                  />
                  <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-4" controlId="BusinessInfoFormPostalCode">
                  <Form.Label className="form-label-md">Postal Code</Form.Label>
                  <Form.Control
                    name={postal_code.name}
                    type="text"
                    value={values.postal_code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    isValid={touched.postal_code && !errors.postal_code}
                    isInvalid={touched.postal_code && !!errors.postal_code}
                  />
                  <Form.Control.Feedback type="invalid">{errors.postal_code}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-4" controlId="BusinessInfoFormState">
                  <Form.Label className="form-label-md">State</Form.Label>
                  <Form.Control
                    name={state.name}
                    type="text"
                    value={values.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    isValid={touched.state && !errors.state}
                    isInvalid={touched.state && !!errors.state}
                  />
                  <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
                </Form.Group>

                <CustomSelect
                  labelText={'Country'}
                  onSelectChange={value => setFieldValue(country.name, value)}
                  onBlurChange={() => setFieldTouched(country.name, true)}
                  name={country.name}
                  controlId="BusinessInfoFormCountry"
                  value={values.country}
                  options={countries}
                  searchable
                  classNames={{
                    labelClass: 'form-label-md',
                    wrapperClass: 'mb-4',
                  }}
                  isValid={touched.country && !errors.country}
                  isInvalid={touched.country && !!errors.country}
                  error={errors.country}
                />
              </Col>

              <Col lg={6} className="py-4 flex-fill ps-lg-5">
                <p className="fw-bold mb-4">Contact Details</p>
                <Form.Group className="mb-4" controlId="BusinessInfoFormEmailPrimary">
                  <Form.Label className="form-label-md">Business email - Primary</Form.Label>
                  <Form.Control
                    type="email"
                    name={primary_email.name}
                    value={values.primary_email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="johndoe@example.com"
                    isValid={touched.primary_email && !errors.primary_email}
                    isInvalid={touched.primary_email && !!errors.primary_email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.primary_email}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-4" controlId="BusinessInfoFormEmailSecondary">
                  <Form.Label className="form-label-md">Business email - Secondary</Form.Label>
                  <Form.Control
                    type="email"
                    name={secondary_email.name}
                    value={values.secondary_email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="johndoe@example.com"
                    isValid={touched.secondary_email && !errors.secondary_email}
                    isInvalid={touched.secondary_email && !!errors.secondary_email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.secondary_email}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-4" controlId="BusinessInfoFormPhoneNumber">
                  <Form.Label className="form-label-md">Phone Number</Form.Label>
                  <InputPhone
                    name={phone_number.name}
                    value={values.phone_number}
                    onPhoneNumberChange={phone => setFieldValue(phone_number.name, phone)}
                    onBlur={handleBlur}
                    isValid={touched.phone_number && !errors.phone_number}
                    isInvalid={touched.phone_number && !!errors.phone_number}
                  />
                  <Form.Control.Feedback type="invalid">{errors.phone_number}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-4" controlId="BusinessInfoFormTelephoneNumber">
                  <Form.Label className="form-label-md">Telephone Number</Form.Label>
                  <InputPhone
                    required={false}
                    onBlur={handleBlur}
                    name={telephone_number.name}
                    value={values.telephone_number}
                    onPhoneNumberChange={phone => setFieldValue(telephone_number.name, phone)}
                    isValid={touched.telephone_number && !errors.telephone_number}
                    isInvalid={touched.telephone_number && !!errors.telephone_number}
                  />
                  <Form.Control.Feedback type="invalid">{errors.telephone_number}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <hr className="m-0" />

            <Row className="p-4">
              <p className="fw-bold mb-4">Tax paying details</p>

              <Col md={5}>
                <CustomSelect
                  labelText={'Tax identity type'}
                  onSelectChange={value => setFieldValue(tax_identity_type.name, value)}
                  onBlurChange={() => setFieldTouched(tax_identity_type.name, true)}
                  name={tax_identity_type.name}
                  controlId="BusinessInfoFormTaxIdentifyType"
                  options={[
                    { value: 'SSN', label: 'SSN' },
                    { value: 'EIN', label: 'EIN' },
                  ]}
                  classNames={{
                    labelClass: 'form-label-md',
                    wrapperClass: 'mb-4',
                  }}
                  value={values.tax_identity_type}
                  isValid={touched.tax_identity_type && !errors.tax_identity_type}
                  isInvalid={touched.tax_identity_type && !!errors.tax_identity_type}
                  error={<Form.Control.Feedback type="invalid">{errors.tax_identity_type}</Form.Control.Feedback>}
                />
                <Form.Group className="mb-4" controlId="BusinessInfoFormTaxPayerID">
                  <Form.Label className="form-label-md">Tax payer ID</Form.Label>
                  <Form.Control
                    type="text"
                    name={tax_payer_id.name}
                    value={values.tax_payer_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Type Here.."
                    isValid={touched.tax_payer_id && !errors.tax_payer_id}
                    isInvalid={touched.tax_payer_id && !!errors.tax_payer_id}
                  />
                  <Form.Control.Feedback type="invalid">{errors.tax_payer_id}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="sticky-bottom py-3 bg-white">
              <Stack className="justify-content-end mx-4 sticky-top" direction="horizontal">
                <Button type="reset" variant="light border-primary" className="px-4 py-1 me-3">
                  Reset
                </Button>

                <SubmitBtn
                  variant="primary"
                  type="submit"
                  loading={isLoading || isLoadingUpdateBusinessInformation || isUploading}
                  className="px-4 py-1"
                >
                  Save changes
                </SubmitBtn>
              </Stack>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BusinessInformation;
