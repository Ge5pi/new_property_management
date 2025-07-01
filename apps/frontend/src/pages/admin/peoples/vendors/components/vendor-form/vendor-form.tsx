import { Button, Col, Form, Row, Stack } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { Formik } from 'formik';

import useResponse from 'services/api/hooks/useResponse';
import { BaseQueryError } from 'services/api/types/rtk-query';
import { useGetVendorTypesByIdQuery } from 'services/api/vendor-types';
import {
  useCreateVendorAddressesMutation,
  useCreateVendorsMutation,
  useGetVendorAddressesQuery,
  useUpdateVendorsAddressMutation,
  useUpdateVendorsMutation,
} from 'services/api/vendors';

import { BackButton } from 'components/back-button';
import PageContainer from 'components/page-container';
import { SubmitBtn } from 'components/submit-button';

import { Notify } from 'core-ui/toast';

import { useRedirect } from 'hooks/useRedirect';

import {
  getIDFromObject,
  getReadableError,
  populateDynamicField,
  renderFormError,
  returnIfHave,
} from 'utils/functions';

import { ISinglePeopleVendor, IVendorType, TaxIdentityType, VendorAddressType } from 'interfaces/IPeoples';

import ContactDetails from './contact-details';
import formValidation from './form-validation';
import GeneralDetails from './general-details';
import InsuranceProvider from './insurance-provider';
import TaxFilingInformation from './tax-filing';
import VendorAddress from './vendor-address';

interface IProps {
  vendor?: ISinglePeopleVendor;
  update?: boolean;
}

const VendorForm = ({ vendor, update }: IProps) => {
  const { redirect } = useRedirect();

  // update Vendors
  const [
    updateVendors,
    { isSuccess: isUpdateVendorsSuccess, isError: isUpdateVendorsError, error: updateVendorsError },
  ] = useUpdateVendorsMutation();

  useResponse({
    isSuccess: isUpdateVendorsSuccess,
    successTitle: 'Vendors Information has been successfully updated!',
    isError: isUpdateVendorsError,
    error: updateVendorsError,
  });

  const [
    createVendors,
    { isSuccess: isCreateVendorsSuccess, isError: isCreateVendorsError, error: createVendorsError },
  ] = useCreateVendorsMutation();

  useResponse({
    isSuccess: isCreateVendorsSuccess,
    successTitle: 'New Vendor has been successfully added!',
    isError: isCreateVendorsError,
    error: createVendorsError,
  });

  // update VendorAddress
  const [updateVendorAddress] = useUpdateVendorsAddressMutation();
  const [createVendorAddress] = useCreateVendorAddressesMutation();

  const {
    data: vendor_addresses,
    isLoading: VendorAddressLoading,
    isFetching: VendorAddressFetching,
  } = useGetVendorAddressesQuery(getIDFromObject('id', vendor));

  const {
    data: vendor_type,
    isLoading: vTypeLoading,
    isFetching: vTypeFetching,
  } = useGetVendorTypesByIdQuery(getIDFromObject('vendor_type', vendor));

  const handleFormSubmission = async (values: ISinglePeopleVendor) => {
    return await Promise.resolve().then(() => {
      if (vendor && vendor.id && update) {
        return updateVendors({ ...values, id: vendor.id });
      }
      return createVendors(values);
    });
  };

  const handleAddresses = async (addresses: VendorAddressType[], vendor: number) => {
    const promises = addresses.map(address => {
      if (address.id && Number(address.id) > 0) {
        return updateVendorAddress({ ...address, vendor });
      }
      return createVendorAddress({ ...address, vendor });
    });

    return await Promise.all(promises).then(results => {
      if (results.some(r => 'error' in r)) {
        Notify.show({
          type: 'warning',
          title: 'Error while saving Vendor Addresses',
          description: 'You can always edit vendor to add/update addresses.',
        });
      }
      return results;
    });
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        first_name: vendor?.first_name ?? '',
        last_name: vendor?.last_name ?? '',
        company_name: vendor?.company_name ?? '',
        vendor_type: vendor_type ? [vendor_type] : ([] as Option[]),
        gl_account: vendor?.gl_account ?? '',
        use_company_name_as_display_name: vendor?.use_company_name_as_display_name ?? false,
        personal_contact_numbers: populateDynamicField('phone', vendor?.personal_contact_numbers),
        business_contact_numbers: populateDynamicField('phone', vendor?.business_contact_numbers),
        personal_emails: populateDynamicField('email', vendor?.personal_emails),
        business_emails: populateDynamicField('email', vendor?.business_emails),
        website: vendor?.website ?? '',
        addresses: returnIfHave<VendorAddressType>(
          [{ city: '', country: '', state: '', street_address: '', zip: '' }],
          vendor_addresses
        ),
        insurance_provide_name: vendor?.insurance_provide_name ?? '',
        insurance_policy_number: vendor?.insurance_policy_number ?? '',
        insurance_expiry_date: vendor?.insurance_expiry_date ?? '',
        tax_identity_type: vendor?.tax_identity_type ?? ('EIN' as TaxIdentityType),
        tax_payer_id: vendor?.tax_payer_id ?? '',
      }}
      validationSchema={formValidation}
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        const vendor_type_id = Number((values.vendor_type as Array<IVendorType>)[0].id);
        const data: ISinglePeopleVendor = {
          ...values,
          vendor_type: vendor_type_id,
          personal_contact_numbers: values.personal_contact_numbers.map(num => num['phone']).filter(f => f !== ''),
          personal_emails: values.personal_emails.map(mail => mail['email']).filter(f => f !== ''),
          business_contact_numbers: values.business_contact_numbers.map(num => num['phone']).filter(f => f !== ''),
          business_emails: values.business_emails.map(mail => mail['email']).filter(f => f !== ''),
        };

        let vendor_id = vendor && vendor.id ? vendor.id : -1;
        handleFormSubmission(data)
          .then(result => {
            if (result.data) {
              vendor_id = Number(result.data.id);
              return handleAddresses(
                values.addresses.filter(e => !Object.values(e).every(e => !e)),
                vendor_id
              );
            } else {
              const error = result.error as BaseQueryError;
              if (error.status === 400 && error.data) {
                renderFormError(error.data, setFieldError);
              }
            }
          })
          .then(() => {
            redirect(`/vendors/${vendor_id}/general-details`, true, 'vendors');
          })
          .catch(error => {
            Notify.show({
              type: 'danger',
              title: 'Something went wrong, please check your input record',
              description: getReadableError(error),
            });
          })
          .finally(() => setSubmitting(false));
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <PageContainer>
            <div className="my-3">
              <Row className="align-items-end">
                <Col>
                  <div>
                    <BackButton />
                    <h1 className="fw-bold h4 mt-1">{update ? 'Update Vendor Information' : 'Create New Vendor'}</h1>
                  </div>
                </Col>
                <Col sm={'auto'}>
                  <div className="my-3">
                    <Stack gap={3} className="justify-content-end" direction="horizontal">
                      <Button
                        variant="light border-primary"
                        type="reset"
                        className="px-4 py-1"
                        onClick={() => redirect(-1)}
                      >
                        Cancel
                      </Button>
                      <SubmitBtn variant="primary" type="submit" className="px-4 py-1" loading={isSubmitting}>
                        Save
                      </SubmitBtn>
                    </Stack>
                  </div>
                </Col>
              </Row>
            </div>
            <GeneralDetails vTypeFetching={vTypeFetching} vTypeLoading={vTypeLoading} />
            <ContactDetails />
            <VendorAddress addressFetching={VendorAddressFetching} addressLoading={VendorAddressLoading} />
            <InsuranceProvider />
            <TaxFilingInformation />
          </PageContainer>
        </Form>
      )}
    </Formik>
  );
};

export default VendorForm;
