import { useCallback, useMemo } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { skipToken } from '@reduxjs/toolkit/query';
import { FormikValues, useFormik } from 'formik';

import { useCreateEmailSignatureMutation, useGetEmailSignatureByIdQuery } from 'services/api/email-signature';
import { useCreateEmailTemplateMutation, useUpdateEmailTemplateMutation } from 'services/api/email-template';
import useResponse from 'services/api/hooks/useResponse';
import { useGetListOfOwnersQuery } from 'services/api/owners';
import { useGetListOfTenantsQuery } from 'services/api/tenants';
import { BaseQueryError } from 'services/api/types/rtk-query';
import { useGetListOfUnitsQuery } from 'services/api/units';
import { useGetListOfVendorsQuery } from 'services/api/vendors';

import { BackButton } from 'components/back-button';
import { ItemMenuItem } from 'components/custom-cell';
import PageContainer from 'components/page-container';
import { Signature } from 'components/signature';
import { SubmitBtn } from 'components/submit-button';

import { CustomSelect, FilterPaginateInput } from 'core-ui/custom-select';
import { RichTextEditor } from 'core-ui/text-editor';
import { Notify } from 'core-ui/toast';

import { useRedirect } from 'hooks/useRedirect';

import { getIDFromObject, getReadableError, getStringPersonName, renderFormError } from 'utils/functions';

import {
  IEmailSingleTemplate,
  IEmailTemplateAPI,
  IndividualRecipientType,
  RecipientType,
} from 'interfaces/ICommunication';
import { IOwner, IVendor } from 'interfaces/IPeoples';
import { ITenantAPI } from 'interfaces/ITenant';
import { IUnitsAPI } from 'interfaces/IUnits';

import formFields from './form-fields';
import formValidation from './form-validation';

interface IProps {
  template?: IEmailSingleTemplate;
  update?: boolean;
}

const TemplateCRUD = ({ template, update }: IProps) => {
  const { redirect } = useRedirect();
  const {
    subject,
    recipient_type,
    tenants,
    owners,
    vendors,
    units,
    individual_recipient_type,
    body,
    signature,
    existing_signature,
  } = formFields;

  const {
    data: tenants_data,
    isLoading: tenantsLoading,
    isFetching: tenantsFetching,
  } = useGetListOfTenantsQuery(
    template && template.tenants && template.tenants.length > 0 ? template.tenants : skipToken
  );

  const {
    data: owners_data,
    isLoading: ownersLoading,
    isFetching: ownersFetching,
  } = useGetListOfOwnersQuery(template && template.owners && template.owners.length > 0 ? template.owners : skipToken);

  const {
    data: vendors_data,
    isLoading: vendorsLoading,
    isFetching: vendorsFetching,
  } = useGetListOfVendorsQuery(
    template && template.vendors && template.vendors.length > 0 ? template.vendors : skipToken
  );

  const {
    data: units_data,
    isLoading: unitsLoading,
    isFetching: unitsFetching,
  } = useGetListOfUnitsQuery(template && template.units && template.units.length > 0 ? template.units : skipToken);

  const {
    data: signature_data,
    isLoading: signatureLoading,
    isFetching: signatureFetching,
  } = useGetEmailSignatureByIdQuery(getIDFromObject('signature', template));

  const [
    createTemplate,
    { isSuccess: isCreateTemplateSuccess, isError: isCreateTemplateError, error: createTemplateError },
  ] = useCreateEmailTemplateMutation();

  useResponse({
    isSuccess: isCreateTemplateSuccess,
    successTitle: 'New Template has been added',
    isError: isCreateTemplateError,
    error: createTemplateError,
  });

  const [
    updateTemplate,
    { isSuccess: isUpdateTemplateSuccess, isError: isUpdateTemplateError, error: updateTemplateError },
  ] = useUpdateEmailTemplateMutation();

  useResponse({
    isSuccess: isUpdateTemplateSuccess,
    successTitle: 'Template has been updated successfully!',
    isError: isUpdateTemplateError,
    error: updateTemplateError,
  });

  const [createSignature, { isError: isCreateSignatureError, error: createSignatureError }] =
    useCreateEmailSignatureMutation();

  useResponse({
    isError: isCreateSignatureError,
    error: createSignatureError,
  });

  const handleFormSubmission = async (values: FormikValues) => {
    const units: Array<number> = [];
    const vendors: Array<number> = [];
    const owners: Array<number> = [];
    const tenants: Array<number> = [];

    (values.units as IUnitsAPI[]).forEach(selected => {
      units.push(Number(selected.id));
    });

    (values.vendors as IVendor[]).forEach(selected => {
      vendors.push(Number(selected.id));
    });

    (values.owners as IOwner[]).forEach(selected => {
      owners.push(Number(selected.id));
    });

    (values.tenants as ITenantAPI[]).forEach(selected => {
      tenants.push(Number(selected.id));
    });

    let signature_id = null;
    if (values.existing_signature && Number(values.existing_signature) > 0) {
      signature_id = Number(values.existing_signature);
    } else {
      if (values.signature && values.signature !== 'IMAGE') {
        signature_id = await createSignature({ text: values.signature }).then(res => {
          if (res.data) return Number(res.data.id);
          throw res.error;
        });
      }
    }

    const data = {
      ...values,
      signature: signature_id ? Number(signature_id) : undefined,
      units,
      tenants,
      vendors,
      owners,
    };

    if (template && template.id && update) {
      return updateTemplate({ id: template.id, ...data });
    }

    return createTemplate(data as IEmailTemplateAPI);
  };

  const {
    touched,
    errors,
    handleSubmit,
    isSubmitting,
    values,
    setFieldValue,
    handleChange,
    setFieldTouched,
    handleBlur,
  } = useFormik({
    initialValues: {
      recipient_type: template?.recipient_type ?? ('INDIVIDUAL' as RecipientType),
      individual_recipient_type: template?.individual_recipient_type ?? ('TENANT' as IndividualRecipientType),
      tenants: tenants_data ? tenants_data : ([] as Option[]),
      owners: owners_data ? owners_data : ([] as Option[]),
      vendors: vendors_data ? vendors_data : ([] as Option[]),
      units: units_data ? units_data : ([] as Option[]),
      subject: template?.subject ?? '',
      body: template?.body ?? '',
      signature: signature_data && signature_data.text !== 'IMAGE' ? signature_data.text : '',
      existing_signature: signature_data ? Number(signature_data.id) : null,
    },
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      handleFormSubmission(values)
        .then(result => {
          if (result.data) {
            redirect(`/template/details/${result.data.id}`, true, 'template');
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
    validationSchema: formValidation,
  });

  const onTenantSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        let selection = selected as ITenantAPI[];
        selection = selection.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              t =>
                t.first_name.toLowerCase().trim() === value.first_name.toLowerCase().trim() &&
                t.last_name.toLowerCase().trim() === value.last_name.toLowerCase().trim()
            )
        );
        setFieldValue('tenants', selection);
      } else {
        setFieldValue('tenants', []);
      }
    },
    [setFieldValue]
  );

  const onOwnerSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        let selection = selected as IOwner[];
        selection = selection.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              t =>
                t.first_name.toLowerCase().trim() === value.first_name.toLowerCase().trim() &&
                t.last_name.toLowerCase().trim() === value.last_name.toLowerCase().trim()
            )
        );
        setFieldValue('owners', selection);
      } else {
        setFieldValue('owners', []);
      }
    },
    [setFieldValue]
  );

  const onVendorSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        let selection = selected as IVendor[];
        selection = selection.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              t =>
                t.first_name.toLowerCase().trim() === value.first_name.toLowerCase().trim() &&
                t.last_name.toLowerCase().trim() === value.last_name.toLowerCase().trim()
            )
        );
        setFieldValue('vendors', selection);
      } else {
        setFieldValue('vendors', []);
      }
    },
    [setFieldValue]
  );

  const onUnitSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        let selection = selected as IUnitsAPI[];
        selection = selection.filter(
          (value, index, self) =>
            index === self.findIndex(t => t.name.toLowerCase().trim() === value.name.toLowerCase().trim())
        );
        setFieldValue('units', selection);
      } else {
        setFieldValue('units', []);
      }
    },
    [setFieldValue]
  );

  const currentType = useMemo(() => {
    const individual_type = values.individual_recipient_type;
    const recipient_type = values.recipient_type;

    if (recipient_type === 'INDIVIDUAL') {
      return individual_type;
    }

    return recipient_type;
  }, [values.individual_recipient_type, values.recipient_type]);

  const resetSelectedValues = useCallback(
    (fieldName: string) => {
      setFieldValue(fieldName, []);
    },
    [setFieldValue]
  );

  return (
    <PageContainer>
      <BackButton />

      <Card className="mt-3 border-0 p-0 page-section mb-3">
        <Card.Header className="border-0 p-4 pb-0 bg-transparent text-start">
          <h1 className="fw-bold h5 m-0">{template && update ? 'Update' : 'Create'} Template</h1>
        </Card.Header>

        <Card.Body className="p-4 text-start announcements-steps-card">
          <Form className="text-start" noValidate onSubmit={handleSubmit}>
            <Row className="gy-3">
              <Col lg={8} md={10} className="mb-3">
                <p className="fw-medium text-primary">Recipients</p>
                <Row className="gy-1">
                  <Col md={3}>
                    <CustomSelect
                      name={recipient_type.name}
                      classNames={{ labelClass: 'fw-medium' }}
                      value={values.recipient_type}
                      onSelectChange={value => {
                        setFieldValue(recipient_type.name, value);
                        resetSelectedValues(units.name);
                        resetSelectedValues(tenants.name);
                        resetSelectedValues(owners.name);
                        resetSelectedValues(vendors.name);
                      }}
                      onBlurChange={() => setFieldTouched(recipient_type.name, true)}
                      isValid={touched.recipient_type && !errors.recipient_type}
                      isInvalid={touched.recipient_type && !!errors.recipient_type}
                      error={errors.recipient_type}
                      controlId="EmailTemplateFormRecipientType"
                      options={[
                        { label: 'Property', value: 'PROPERTY' },
                        { label: 'Individual', value: 'INDIVIDUAL' },
                      ]}
                      placeholder="Recipient type"
                    />
                  </Col>
                  <Col md={3}>
                    <CustomSelect
                      classNames={{ labelClass: 'fw-medium' }}
                      name={individual_recipient_type.name}
                      value={values.individual_recipient_type}
                      onSelectChange={value => {
                        setFieldValue(individual_recipient_type.name, value);
                        resetSelectedValues(tenants.name);
                        resetSelectedValues(owners.name);
                        resetSelectedValues(vendors.name);
                      }}
                      onBlurChange={() => setFieldTouched(individual_recipient_type.name, true)}
                      isValid={touched.individual_recipient_type && !errors.individual_recipient_type}
                      isInvalid={touched.individual_recipient_type && !!errors.individual_recipient_type}
                      error={errors.individual_recipient_type}
                      controlId="EmailTemplateFormIndividualRecipientType"
                      options={[
                        { label: 'Owner', value: 'OWNER' },
                        { label: 'Tenant', value: 'TENANT' },
                        { label: 'Vendor', value: 'VENDOR' },
                      ]}
                      disabled={values.recipient_type !== 'INDIVIDUAL'}
                      placeholder="Tenant"
                    />
                  </Col>
                  <Col xs={12}>
                    {currentType === 'TENANT' && (
                      <FilterPaginateInput
                        multiple
                        size="sm"
                        name={tenants.name}
                        placeholder={`Search for tenants`}
                        controlId={`EmailTemplateFormTenants`}
                        classNames={{
                          labelClass: 'popup-form-labels',
                          wrapperClass: 'mb-3',
                        }}
                        selected={values.tenants}
                        onSelectChange={onTenantSelected}
                        onBlurChange={() => setFieldTouched(tenants.name, true)}
                        isValid={touched.tenants && !errors.tenants}
                        isInvalid={touched.tenants && !!errors.tenants}
                        filterBy={['first_name', 'last_name']}
                        labelKey={option => getStringPersonName(option as ITenantAPI)}
                        renderMenuItemChildren={option => <ItemMenuItem option={option as ITenantAPI} />}
                        searchIcon={false}
                        model_label="people.Tenant"
                        disabled={tenantsLoading || tenantsFetching}
                        error={errors.tenants}
                      />
                    )}
                    {currentType === 'OWNER' && (
                      <FilterPaginateInput
                        multiple
                        size="sm"
                        name={owners.name}
                        placeholder={`Search for owners`}
                        controlId={`EmailTemplateFormOwners`}
                        classNames={{
                          labelClass: 'popup-form-labels',
                          wrapperClass: 'mb-3',
                        }}
                        selected={values.owners}
                        onSelectChange={onOwnerSelected}
                        onBlurChange={() => setFieldTouched(owners.name, true)}
                        isValid={touched.owners && !errors.owners}
                        isInvalid={touched.owners && !!errors.owners}
                        filterBy={['first_name', 'last_name']}
                        labelKey={option => getStringPersonName(option as IOwner)}
                        renderMenuItemChildren={option => <ItemMenuItem option={option as IOwner} />}
                        searchIcon={false}
                        model_label="people.Owner"
                        disabled={ownersLoading || ownersFetching}
                        error={errors.owners}
                      />
                    )}
                    {currentType === 'VENDOR' && (
                      <FilterPaginateInput
                        multiple
                        size="sm"
                        name={vendors.name}
                        placeholder={`Search for vendors`}
                        controlId={`EmailTemplateFormVendor`}
                        classNames={{
                          labelClass: 'popup-form-labels',
                          wrapperClass: 'mb-3',
                        }}
                        selected={values.vendors}
                        onSelectChange={onVendorSelected}
                        onBlurChange={() => setFieldTouched(vendors.name, true)}
                        isValid={touched.vendors && !errors.vendors}
                        isInvalid={touched.vendors && !!errors.vendors}
                        filterBy={['first_name', 'last_name']}
                        labelKey={option => getStringPersonName(option as IVendor)}
                        renderMenuItemChildren={option => <ItemMenuItem option={option as IVendor} />}
                        searchIcon={false}
                        model_label="people.Vendor"
                        disabled={vendorsLoading || vendorsFetching}
                        error={errors.vendors}
                      />
                    )}
                    {currentType === 'PROPERTY' && (
                      <FilterPaginateInput
                        multiple
                        size="sm"
                        name={units.name}
                        model_label="property.Unit"
                        controlId={`EmailTemplateFormUnitName`}
                        placeholder={`Select`}
                        classNames={{
                          labelClass: 'popup-form-labels',
                          wrapperClass: 'mb-3',
                        }}
                        selected={values.units}
                        onSelectChange={onUnitSelected}
                        onBlurChange={() => setFieldTouched(units.name, true)}
                        isValid={touched.units && !errors.units}
                        isInvalid={touched.units && !!errors.units}
                        labelKey={'name'}
                        disabled={unitsLoading || unitsFetching}
                        error={errors.units}
                      />
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Form.Group as={Col} lg={8} md={10} className="mb-4" controlId="TemplatesFormEmail">
                <Form.Label className="form-label-md">Subject</Form.Label>
                <Form.Control
                  type="text"
                  name={subject.name}
                  value={values.subject}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isValid={touched.subject && !errors.subject}
                  isInvalid={touched.subject && !!errors.subject}
                  placeholder="Add subject here"
                />
                <Form.Control.Feedback type="invalid">{errors.subject}</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} lg={8} md={10} controlId="SendEmailTemplateFormBody" className="mb-4">
                <Form.Label className="popup-form-labels">Body</Form.Label>
                <RichTextEditor
                  height={200}
                  id="SendEmailTemplateFormBody"
                  value={values.body}
                  onChange={val => setFieldValue(body.name, val)}
                  onBlur={() => setFieldTouched(body.name, true)}
                  isValid={touched.body && !errors.body}
                  isInvalid={touched.body && !!errors.body}
                  error={errors.body}
                />
              </Form.Group>
            </Row>
            <Row>
              <Col xxl={4} lg={6} md={8}>
                <Signature
                  controlID="TemplatesFormEmail"
                  value={values.signature}
                  existing={values.existing_signature}
                  handleSignatureInput={(text, id) => {
                    setFieldValue(signature.name, text);
                    setFieldValue(existing_signature.name, id ? id : null);
                  }}
                  onBlur={() => setFieldTouched(signature.name, true)}
                  isValid={touched.signature && !errors.signature}
                  isInvalid={touched.signature && !!errors.signature}
                  readOnly={signatureLoading || signatureFetching || Boolean(values.existing_signature)}
                  error={errors.signature}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-5">
              <Button
                variant="light border-primary"
                className="px-4 py-1 me-3"
                type="reset"
                onClick={() => redirect(-1)}
              >
                Cancel
              </Button>
              <SubmitBtn
                variant="primary"
                type="submit"
                className="px-4 py-1"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {template && update ? 'Update' : 'Create'}
              </SubmitBtn>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </PageContainer>
  );
};

export default TemplateCRUD;
