import { lazy } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import { useGetLeaseTemplateByIdQuery } from 'services/api/lease-templates';
import {
  useCreatePropertyAttachmentsMutation,
  useCreatePropertyUpcomingActivityMutation,
  useDeletePropertyAttachmentsMutation,
  useGetDefaultLeaseTemplateAttachmentsListQuery,
  useGetDefaultRenewalTemplateAttachmentsListQuery,
  useGetPropertyAttachmentsQuery,
  useGetPropertyByIdQuery,
  useGetPropertyUpcomingActivitiesQuery,
  useUpdatePropertiesInformationMutation,
} from 'services/api/properties';
import { useGetRentalTemplateByIdQuery } from 'services/api/rental-templates';

import { Log } from 'components/log';
import { Notes } from 'components/notes';
import PageContainer from 'components/page-container';

import { CustomSelect } from 'core-ui/custom-select';
import { EditBtn } from 'core-ui/edit-button';
import { ReturnIcon } from 'core-ui/icons';
import { LazyImage } from 'core-ui/lazy-image';
import {
  DefaultLeaseModal,
  DefaultRenewalModal,
  DefaultRenewalOptionsModal,
  RentalTemplateModal,
} from 'core-ui/popups/lease-modal';
import { PropertyModal } from 'core-ui/popups/properties';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

import { PERMISSIONS } from 'constants/permissions';
import { getIDFromObject, getValidID } from 'utils/functions';

import { IAttachments } from 'interfaces/IAttachments';
import { IPropertyAttachments, IPropertyUpcomingActivities } from 'interfaces/IProperties';
import { IUpcomingActivities } from 'interfaces/IUpcomingActivities';

const Amenities = lazy(() => import('../common/amenities/amenities'));
const UpcomingActivities = lazy(() => import('components/upcoming-activities/upcoming-activities'));

const PropertyGallery = lazy(() => import('./property-photos'));

const Fees = lazy(() => import('./fees'));
const LateFeePolicy = lazy(() => import('./late-fee'));

const FixedAssets = lazy(() => import('./fixed-assets'));
const UtilityBills = lazy(() => import('./utility-bills'));

const LeaseSettings = lazy(() => import('./lease-settings'));
const MaintenanceInformation = lazy(() => import('./maintenance-information'));

const OwnersFinancial = lazy(() => import('./owners-financial'));
const PropertyInformation = lazy(() => import('./property-information'));

const Attachments = lazy(() => import('components/attachments/attachments'));
const Units = lazy(() => import('../units/units'));

const DetailPage = () => {
  const [width] = useWindowSize();
  const { currentPath, modifyCurrentPath } = useRedirect();
  const { property: property_id } = useParams();

  // get property by id
  const property = useGetPropertyByIdQuery(getValidID(property_id));
  const property_attachments = useGetPropertyAttachmentsQuery(getValidID(property_id));

  const lease_attachments = useGetDefaultLeaseTemplateAttachmentsListQuery(getValidID(property_id));
  const renewal_attachments = useGetDefaultRenewalTemplateAttachmentsListQuery(getValidID(property_id));

  const { data: renewal_template } = useGetLeaseTemplateByIdQuery(
    getIDFromObject('default_lease_renewal_template', property.data)
  );

  const { data: lease_template } = useGetLeaseTemplateByIdQuery(
    getIDFromObject('default_lease_template', property.data)
  );

  const { data: rental_template } = useGetRentalTemplateByIdQuery(
    getIDFromObject('rental_application_template', property.data)
  );

  // update property information
  const [
    updatePropertyInformation,
    { isSuccess: isUpdatePropertyInfoSuccess, isError: isUpdatePropertyInfoError, error: updatePropertyInfoError },
  ] = useUpdatePropertiesInformationMutation();
  useResponse({
    isSuccess: isUpdatePropertyInfoSuccess,
    successTitle: 'Record has been successfully updated!',
    isError: isUpdatePropertyInfoError,
    error: updatePropertyInfoError,
  });

  // create attachment
  const [
    createPropertyAttachments,
    { isSuccess: isCreateAttachmentSuccess, isError: isCreateAttachmentError, error: isAttachmentError },
  ] = useCreatePropertyAttachmentsMutation();
  useResponse({
    isSuccess: isCreateAttachmentSuccess,
    successTitle: 'Your file has been successfully uploaded!',
    isError: isCreateAttachmentError,
    error: isAttachmentError,
  });

  const [
    deletePropertyAttachments,
    { isSuccess: isDeleteAttachmentSuccess, isError: isDeleteAttachmentError, error: deleteAttachmentError },
  ] = useDeletePropertyAttachmentsMutation();

  useResponse({
    isSuccess: isDeleteAttachmentSuccess,
    successTitle: 'Your file has been successfully deleted!',
    isError: isDeleteAttachmentError,
    error: deleteAttachmentError,
  });

  const handleAttachmentDelete = async (row: object) => {
    const attachment = row as IPropertyAttachments;
    if (attachment.id && attachment.parent_property) {
      await deletePropertyAttachments(attachment.id);
      return Promise.resolve('delete successful');
    }

    return Promise.reject('Incomplete data found');
  };

  const handleAttachmentUpload = async (data: IAttachments) => {
    if (!isNaN(Number(property_id)) && Number(property_id) > 0) {
      return await createPropertyAttachments({ ...data, parent_property: Number(property_id) });
    }
    return Promise.reject('Incomplete data found');
  };

  const handleNoteSubmit = async (value: string) => {
    if (!isNaN(Number(property_id)) && Number(property_id) > 0) {
      updatePropertyInformation({ notes: value, id: Number(property_id) });
    }
  };

  const unitsPath = modifyCurrentPath('/units', 'details');
  const upcoming_activities = useGetPropertyUpcomingActivitiesQuery(getValidID(property_id));

  const [
    createUpcomingActivity,
    {
      isSuccess: isCreateUpcomingActivitySuccess,
      isError: isCreateUpcomingActivityError,
      error: createUpcomingActivityError,
    },
  ] = useCreatePropertyUpcomingActivityMutation();

  useResponse({
    isSuccess: isCreateUpcomingActivitySuccess,
    successTitle: 'New Upcoming Activity has been added',
    isError: isCreateUpcomingActivityError,
    error: createUpcomingActivityError,
  });
  const handleUpcomingActivity = async (values: IUpcomingActivities) => {
    if (!isNaN(Number(property_id)) && Number(property_id) > 0) {
      return await createUpcomingActivity({
        ...values,
        parent_property: Number(property_id),
      } as IPropertyUpcomingActivities);
    }

    return Promise.reject('Incomplete data found');
  };

  const handleRefetchOnClose = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const popup = urlParams.get('popup');
    if (popup && Boolean(popup)) {
      const timer = setTimeout(() => {
        if (popup && Boolean(popup)) {
          window.close();
        }

        clearTimeout(timer);
      }, 1000);
    }
  };

  const currentPage = currentPath.includes('associations') ? 'association' : 'property';
  return (
    <ApiResponseWrapper
      {...property}
      renderResults={data => {
        return (
          <PageContainer>
            <div className="container-fluid page-section pt-5 pb-3">
              <Row className="gx-3 gy-4 align-items-stretch">
                <Col xxl={width <= 1600 ? 4 : 3} lg={4}>
                  <Card className="align-items-center p-3 min-h-100">
                    <Card.Img as={LazyImage} border src={data.cover_picture} size="16x9" />
                    <Card.Body className="ps-0 w-100 pe-lg-4 pe-md-5 pe-1 pt-0 pb-3 text-start">
                      <Card.Title className="fw-bold text-capitalize">{data.name}</Card.Title>
                      <Card.Subtitle className="text-capitalize small mb-3">{data.property_type_name}</Card.Subtitle>
                      <Card.Text className="text-primary fw-medium">{data.address}</Card.Text>
                    </Card.Body>
                    <EditBtn
                      className="position-absolute bottom-0 end-0 m-2"
                      permission={PERMISSIONS.PROPERTY}
                      onClick={() => {
                        SweetAlert({
                          size: 'xl',
                          html: <PropertyModal update={true} property={data} currentRoute={currentPage} />,
                        }).fire({
                          allowOutsideClick: () => !SwalExtended.isLoading(),
                        });
                      }}
                    />
                  </Card>
                </Col>
                <Col xl lg={8}>
                  <UpcomingActivities
                    {...upcoming_activities}
                    permission={PERMISSIONS.PROPERTY}
                    createUpcomingActivity={handleUpcomingActivity}
                  />
                </Col>
              </Row>
              <Row className="mt-1 gx-3 gy-4 align-items-stretch">
                <Col lg={7} md={6}>
                  <PropertyInformation currentRoute={currentPage} />
                </Col>
                <Col lg={5} md={6}>
                  <Amenities from="properties" data={data} />
                </Col>
              </Row>
            </div>

            <div className="container-fluid page-section my-4">
              <Row className="mt-1 g-3 align-items-stretch">
                <Col xs={12}>
                  <Card className="border-0">
                    <Card.Header className="border-0 px-2 py-3 bg-transparent text-start">
                      <Row className="gx-0 align-items-center py-1 flex-wrap">
                        <Col>
                          <p className="fw-bold m-0 text-primary">Units</p>
                        </Col>
                        <Col xs={'auto'}>
                          <Link to={unitsPath} className="btn btn-link link-info">
                            Go to units
                          </Link>
                        </Col>
                      </Row>
                    </Card.Header>
                    <Card.Body className="px-2 text-start pt-0">
                      <div className="units-wrapper table-responsive">
                        <Units isMain={false} />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>

            <div className="container-fluid page-section my-4">
              <Row className="mt-1 g-3 align-items-stretch">
                <Col xs={12}>
                  <Card className="border-0">
                    <Card.Header className="border-0 px-2 py-3 bg-transparent text-start">
                      <Row className="gx-0 align-items-center py-1 flex-wrap">
                        <Col>
                          <p className="fw-bold m-0 text-primary">Lease settings</p>
                        </Col>
                      </Row>
                    </Card.Header>
                    <Card.Body className="px-2 text-start pt-0">
                      <Row className="g-3 align-items-stretch">
                        <Col md={6}>
                          <LeaseSettings
                            sectionName="Default Lease template"
                            parent_id={data.id}
                            template={{
                              title: lease_template?.name ?? '',
                              description: data.default_lease_agenda ?? '',
                              files: lease_attachments.data,
                            }}
                            onEdit={() => {
                              if (!lease_attachments.isLoading && lease_attachments.data) {
                                SweetAlert({
                                  size: 'xl',
                                  html: (
                                    <DefaultLeaseModal
                                      property={data}
                                      files={lease_attachments.data}
                                      lease_template={lease_template}
                                    />
                                  ),
                                })
                                  .fire({
                                    allowOutsideClick: () => !SwalExtended.isLoading(),
                                  })
                                  .then(handleRefetchOnClose);
                              }
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <LeaseSettings
                            sectionName="Default Renewal Template"
                            parent_id={data.id}
                            template={{
                              title: renewal_template?.name ?? '',
                              description: data.default_lease_renewal_agenda ?? '',
                              files: renewal_attachments.data,
                            }}
                            onEdit={() => {
                              if (!renewal_attachments.isLoading && renewal_attachments.data) {
                                SweetAlert({
                                  size: 'xl',
                                  html: (
                                    <DefaultRenewalModal
                                      property={data}
                                      files={renewal_attachments.data}
                                      renewal_template={renewal_template}
                                    />
                                  ),
                                })
                                  .fire({
                                    allowOutsideClick: () => !SwalExtended.isLoading(),
                                  })
                                  .then(handleRefetchOnClose);
                              }
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <LeaseSettings
                            sectionName="Rental Application Template"
                            template={{
                              title: rental_template?.name ?? '',
                              description: rental_template?.description ?? '',
                              rental_application: rental_template,
                            }}
                            onEdit={() => {
                              if (data.id && Number(data.id) > 0) {
                                SweetAlert({
                                  html: (
                                    <RentalTemplateModal
                                      property_id={data.id}
                                      rental_application_template={rental_template}
                                      updatePropertyDetails={updatePropertyInformation}
                                    />
                                  ),
                                })
                                  .fire({
                                    allowOutsideClick: () => !SwalExtended.isLoading(),
                                  })
                                  .then(handleRefetchOnClose);
                              }
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <LeaseSettings
                            sectionName="Default Renewal Options"
                            term={data.default_renewal_terms}
                            chargeBy={data.default_renewal_charge_by}
                            additionalFee={data.default_renewal_additional_fee}
                            onEdit={() => {
                              SweetAlert({
                                html: (
                                  <DefaultRenewalOptionsModal
                                    property={data}
                                    id={data.id ?? -1}
                                    updatePropertyDetails={updatePropertyInformation}
                                  />
                                ),
                              }).fire({
                                allowOutsideClick: () => !SwalExtended.isLoading(),
                              });
                            }}
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
            <div className="my-4">
              <Row className="mt-1 g-3 align-items-stretch">
                <Col lg={7} md={6}>
                  <OwnersFinancial />
                </Col>
                <Col lg={5} md={6}>
                  <Fees />
                </Col>
              </Row>
            </div>

            <div className="my-4">
              <Row className="mt-1 g-3 align-items-stretch">
                <Col lg={7} md={6}>
                  <LateFeePolicy late_fee_id={data.late_fee_policy} />
                </Col>
                <Col lg={5} md={6}>
                  <Card className="border-0 min-h-100 page-section">
                    <Card.Header className="border-0 px-2 py-3 bg-transparent text-start">
                      <p className="fw-bold m-0 text-primary">Keys</p>
                    </Card.Header>
                    <Card.Body className="text-start border-bottom">
                      <Row>
                        <Col xs={6}>
                          <p className="fw-medium mb-0">ID-1233</p>
                        </Col>
                        <Col xs={6}>
                          <Row className="gx-0 justify-content-end flex-nowrap">
                            <Col xs={'auto'}>
                              <Link to={''} className="btn btn-sm btn-link link-info">
                                Checkout
                              </Link>
                            </Col>
                            <Col xs={'auto'}>
                              <Link to={''} className="btn btn-sm btn-link link-info">
                                Return <ReturnIcon />
                              </Link>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <p className="mb-1 text-primary">Some Description over here</p>
                      <p className="mb-1 text-primary">Availability : Yes</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>

            <div className="my-4">
              <Row className="mt-1 gx-3 align-items-stretch">
                <Col xs={12}>
                  <MaintenanceInformation />
                </Col>
              </Row>
            </div>

            <div className="my-4">
              <Row className="mt-1 gx-3 align-items-stretch">
                <Col xs={12}>
                  <FixedAssets />
                </Col>
              </Row>
            </div>

            <div className="my-4">
              <Row className="mt-1 gx-3 align-items-stretch">
                <Col xs={12}>
                  <UtilityBills />
                </Col>
              </Row>
            </div>

            <div className="my-4">
              <Row className="mt-1 gx-3 gy-lg-0 gy-3 align-items-stretch">
                <Col lg={7} md={6}>
                  <Card className="border-0 min-h-100 page-section">
                    <Card.Header className="border-0 py-3 bg-transparent text-start">
                      <p className="fw-bold m-0 text-primary">Bank Account</p>
                    </Card.Header>
                    <Card.Body className="text-start border-bottom">
                      <Card.Subtitle className="fw-medium text-primary mb-1">Cash GL account</Card.Subtitle>
                      <Card.Text>15548898 98956565 6566</Card.Text>

                      <Row className="g-0">
                        <Col xl={6} lg={8}>
                          <CustomSelect
                            name="bank_account"
                            labelText="Bank Account"
                            controlId="BankFormAccount"
                            options={[
                              {
                                label: '15454589 98598956 6566',
                                value: '15454589 98598956 6566',
                              },
                            ]}
                            defaultValue={'15454589 98598956 6566'}
                            classNames={{
                              labelClass: 'text-primary fw-medium',
                              wrapperClass: 'mb-4',
                            }}
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={5} md={6}>
                  <Card className="border-0 min-h-100 page-section">
                    <Card.Header className="border-0 py-3 bg-transparent text-start">
                      <p className="fw-bold m-0 text-primary">Property Groups</p>
                    </Card.Header>
                    <Card.Body className="text-start px-0">
                      <div className="text-primary">
                        {data.property_groups?.map(group => (
                          <div className="fw-medium amenities" key={group.id}>
                            <span className="text-truncate">{group?.name}</span>
                          </div>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>

            <div className="my-4 page-section">
              <PropertyGallery />
            </div>

            <div className="my-4 page-section">
              <Attachments
                {...property_attachments}
                uploadPermission={PERMISSIONS.PROPERTY}
                deletePermission={PERMISSIONS.PROPERTY}
                onDelete={handleAttachmentDelete}
                onUpload={handleAttachmentUpload}
                uploadInfo={{ module: 'properties', folder: 'attachments' }}
              />
            </div>

            <div className="container-fluid page-section my-4">
              <Row className="mt-1 g-0 align-items-stretch">
                <Col xs={12}>
                  <Card className="border-0">
                    <Card.Header className="border-0 px-2 py-3 bg-transparent text-start">
                      <p className="fw-bold m-0 text-primary">Notes</p>
                      <span className="small text-muted">
                        Write down all relevant information and quick notes for your help over here
                      </span>
                    </Card.Header>
                    <Card.Body className="px-2 text-start pt-0 pb-4">
                      <Notes
                        initialValue={data.notes}
                        onNoteSubmit={handleNoteSubmit}
                        controlID={'PropertyNoteInput'}
                        label={'Notes'}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>

            <div className="container-fluid page-section my-4">
              <Row className="mt-1 g-0 align-items-stretch">
                <Col xs={12}>
                  <Card className="border-0">
                    <Card.Header className="border-0 px-2 py-3 bg-transparent text-start">
                      <p className="fw-bold m-0 text-primary">Audit Log</p>
                    </Card.Header>
                    <Card.Body className="px-2 text-start pt-0">
                      <Log logs={[]} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </PageContainer>
        );
      }}
    />
  );
};

export default DetailPage;
