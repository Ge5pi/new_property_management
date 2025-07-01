import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateVendorAttachmentsMutation,
  useDeleteVendorAttachmentsMutation,
  useGetVendorAddressesQuery,
  useGetVendorAttachmentsQuery,
  useGetVendorsByIdQuery,
} from 'services/api/vendors';

import { Attachments } from 'components/attachments';
import PageContainer from 'components/page-container';
import Skeleton, { InformationSkeleton } from 'components/skeleton';

import { RenderInformation } from 'core-ui/render-information';

import { PERMISSIONS } from 'constants/permissions';
import { getCountry, getIDFromObject, getValidID } from 'utils/functions';

import { IAttachments } from 'interfaces/IAttachments';
import { IVendorAttachments } from 'interfaces/IPeoples';

const VendorGeneralDetails = () => {
  const { vendor: vendor_id } = useParams();

  // get vendor by id
  const vendor = useGetVendorsByIdQuery(getValidID(vendor_id));

  // create attachment
  const [
    createVendorAttachments,
    { isSuccess: isCreateAttachmentSuccess, isError: isCreateAttachmentError, error: attachmentError },
  ] = useCreateVendorAttachmentsMutation();
  useResponse({
    isSuccess: isCreateAttachmentSuccess,
    successTitle: 'Your file has been successfully uploaded!',
    isError: isCreateAttachmentError,
    error: attachmentError,
  });

  const [
    deleteVendorAttachments,
    { isSuccess: isDeleteAttachmentSuccess, isError: isDeleteAttachmentError, error: deleteAttachmentError },
  ] = useDeleteVendorAttachmentsMutation();

  useResponse({
    isSuccess: isDeleteAttachmentSuccess,
    successTitle: 'Your file has been successfully deleted!',
    isError: isDeleteAttachmentError,
    error: deleteAttachmentError,
  });

  const handleAttachmentDelete = async (row: object) => {
    const attachment = row as IVendorAttachments;
    if (attachment.id && attachment.vendor) {
      await deleteVendorAttachments({ vendor: attachment.vendor, id: attachment.id });
      return Promise.resolve('delete successful');
    }

    return Promise.reject('Incomplete data found');
  };

  const handleAttachmentUpload = async (data: IAttachments) => {
    if (!isNaN(Number(vendor_id)) && Number(vendor_id) > 0) {
      return await createVendorAttachments({ ...data, vendor: Number(vendor_id) });
    }
    return Promise.reject('Incomplete data found');
  };

  // get vendor attachments
  const attachments = useGetVendorAttachmentsQuery(getValidID(vendor_id));
  const vendor_addresses = useGetVendorAddressesQuery(
    vendor_id ? getValidID(vendor_id) : getIDFromObject('id', vendor.data)
  );

  return (
    <ApiResponseWrapper
      {...vendor}
      renderResults={data => {
        return (
          <PageContainer>
            <Card className="border-0 p-4 page-section my-3">
              <Card.Header className="border-0 p-0 mb-4 bg-transparent text-start">
                <p className="fw-bold m-0 text-primary">General Details</p>
              </Card.Header>
              <Card.Body className="p-0">
                <Row className="gx-3 gy-4">
                  <Col sm={3}>
                    <RenderInformation title="First Name" description={data.first_name} />
                  </Col>
                  <Col sm={3}>
                    <RenderInformation title="Last Name" description={data.last_name} />
                  </Col>
                </Row>
                <Row className="gx-3 gy-3">
                  <Col sm={3}>
                    <RenderInformation title="Company Name" description={data.company_name} />
                  </Col>
                  <Col sm={3}>
                    <RenderInformation title="Vendor Type" description={data.vendor_type_name} />
                  </Col>
                </Row>
                <Row className="gx-3 gy-3">
                  <Col sm={3}>
                    <RenderInformation title="GL Account" description={data.gl_account} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="border-0 p-4 page-section my-3">
              <Card.Header className="border-0 p-0 mb-4 bg-transparent text-start">
                <p className="fw-bold m-0 text-primary">Contact Details</p>
              </Card.Header>
              <Card.Body className="p-0">
                <Row className="gx-3 gy-4">
                  {data.personal_contact_numbers && data.personal_contact_numbers.length > 0 ? (
                    <Col sm={3}>
                      <RenderInformation title="Personal Number" phone={data.personal_contact_numbers} />
                    </Col>
                  ) : (
                    <Col sm={3}>
                      <RenderInformation title="Personal Number" description={'N/A'} />
                    </Col>
                  )}
                  {data.personal_emails && data.personal_emails.length > 0 ? (
                    <Col sm={3}>
                      <RenderInformation title="Personal Email" email={data.personal_emails} />
                    </Col>
                  ) : (
                    <Col sm={3}>
                      <RenderInformation title="Personal Email" description={'N/A'} />
                    </Col>
                  )}
                </Row>
                <Row className="gx-3 gy-4">
                  {data.business_contact_numbers && data.business_contact_numbers.length > 0 ? (
                    <Col sm={3}>
                      <RenderInformation title="Business Phone Number" phone={data.business_contact_numbers} />
                    </Col>
                  ) : (
                    <Col sm={3}>
                      <RenderInformation title="Business Phone Number" description={'N/A'} />
                    </Col>
                  )}
                  {data.business_emails && data.business_emails.length > 0 ? (
                    <Col sm={3}>
                      <RenderInformation title="Business Email" email={data.business_emails} />
                    </Col>
                  ) : (
                    <Col sm={3}>
                      <RenderInformation title="Business Email" description={'N/A'} />
                    </Col>
                  )}
                </Row>
                <RenderInformation desClass="mb-1" title="Vendor website" link={data.website} />
              </Card.Body>
            </Card>

            <Card className="border-0 p-4 page-section my-3">
              <Card.Header className="border-0 p-0 mb-4 bg-transparent text-start">
                <p className="fw-bold m-0 text-primary">Address</p>
              </Card.Header>
              <Card.Body className="p-0">
                <ApiResponseWrapper
                  {...vendor_addresses}
                  hideIfNoResults
                  showError={false}
                  loadingComponent={
                    <Card className="p-4 bg-secondary mb-3">
                      <Skeleton as={'p'} xs={8} />
                      <InformationSkeleton skeletonType="column" title={false} columnCount={3} md={3} lg={2}>
                        <InformationSkeleton lines="single" />
                      </InformationSkeleton>
                    </Card>
                  }
                  renderResults={v_address => (
                    <Fragment>
                      {v_address.map((address, _k) => {
                        return (
                          <Card className="p-4 bg-secondary mb-3" key={_k}>
                            <Row className="gx-3 gy-4">
                              <Col>
                                <RenderInformation title="Street address" description={address.street_address} />
                              </Col>
                            </Row>
                            <Row className="gx-3 gy-4">
                              <Col md={3} lg={2}>
                                <RenderInformation title="Country" description={getCountry(address.country)} />
                              </Col>
                              <Col md={3} lg={2}>
                                <RenderInformation title="City" description={address.city} />
                              </Col>
                              <Col md={3} lg={2}>
                                <RenderInformation title="State" description={address.state} />
                              </Col>
                              <Col md={3} lg={2}>
                                <RenderInformation title="ZIP code" description={address.zip} />
                              </Col>
                            </Row>
                          </Card>
                        );
                      })}
                    </Fragment>
                  )}
                />
              </Card.Body>
            </Card>

            <Card className="border-0 p-4 page-section my-3">
              <Card.Header className="border-0 p-0 mb-4 bg-transparent text-start">
                <p className="fw-bold m-0 text-primary">Insurance Provider</p>
              </Card.Header>
              <Card.Body className="p-0">
                <Row className="gx-3 gy-4">
                  <Col md={4} lg={3}>
                    <RenderInformation title="Provider name" description={data.insurance_provide_name} />
                  </Col>
                  <Col md={4} lg={3}>
                    <RenderInformation title="Policy number" description={data.insurance_policy_number} />
                  </Col>
                  <Col md={4} lg={3}>
                    <RenderInformation title="Expiry date" date={data.insurance_expiry_date} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="border-0 p-4 page-section my-3">
              <Card.Header className="border-0 p-0 mb-4 bg-transparent text-start">
                <p className="fw-bold m-0 text-primary">Tax filling information</p>
              </Card.Header>
              <Card.Body className="p-0">
                <Row className="gx-3 gy-4">
                  <Col md={4} lg={3}>
                    <RenderInformation
                      title="Tax identification type"
                      description={data.get_tax_identity_type_display}
                    />
                  </Col>
                  <Col md={4} lg={3}>
                    <RenderInformation title="Tax payer ID" description={data.tax_payer_id} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="my-4 page-section">
              <Attachments
                {...attachments}
                uploadPermission={PERMISSIONS.PEOPLE}
                deletePermission={PERMISSIONS.PEOPLE}
                onDelete={handleAttachmentDelete}
                onUpload={handleAttachmentUpload}
                uploadInfo={{ module: 'vendors', folder: 'attachments' }}
              />
            </div>
          </PageContainer>
        );
      }}
    />
  );
};

export default VendorGeneralDetails;
