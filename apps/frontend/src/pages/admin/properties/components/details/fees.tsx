import { Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import { useGetPropertyByIdQuery, useUpdatePropertiesInformationMutation } from 'services/api/properties';

import { InformationSkeleton } from 'components/skeleton';

import { EditBtn } from 'core-ui/edit-button';
import { AdditionalFeeModal, LeaseFeeModal, ManagementFeeModal } from 'core-ui/popups/fee-modals';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { PERMISSIONS } from 'constants/permissions';
import { getValidID } from 'utils/functions';

const Fees = () => {
  return (
    <Row className="gy-3">
      <Col xs={12}>
        <ManagementFee />
      </Col>
      <Col xs={12}>
        <LeaseFees />
      </Col>
      <Col xs={12}>
        <AdditionalFees />
      </Col>
    </Row>
  );
};

const ManagementFee = () => {
  const { property: property_id } = useParams();
  // get property by id
  const property = useGetPropertyByIdQuery(getValidID(property_id));

  const [
    updateManagementFee,
    { isSuccess: isUpdateManagementFeeSuccess, isError: isUpdateManagementFeeError, error: updateManagementFeeError },
  ] = useUpdatePropertiesInformationMutation();
  useResponse({
    isSuccess: isUpdateManagementFeeSuccess,
    successTitle: 'Management Fee has been successfully updated!',
    isError: isUpdateManagementFeeError,
    error: updateManagementFeeError,
  });

  return (
    <ApiResponseWrapper
      {...property}
      showMiniError
      renderResults={data => {
        return (
          <Card className="border-0 page-section">
            <Card.Header className="border-0 py-3 bg-transparent text-start">
              <p className="fw-bold m-0 text-primary">Management Fee</p>
              <EditBtn
                className="position-absolute top-0 end-0 m-2"
                permission={PERMISSIONS.PROPERTY}
                onClick={() => {
                  SweetAlert({
                    size: 'lg',
                    html: (
                      <ManagementFeeModal
                        property={data}
                        id={data.id ?? -1}
                        updatePropertyDetails={updateManagementFee}
                      />
                    ),
                  }).fire({
                    allowOutsideClick: () => !SwalExtended.isLoading(),
                  });
                }}
              />
            </Card.Header>
            <Card.Body className="text-start">
              <Row className="g-3">
                <Col sm={6}>
                  <RenderInformation title="Commission Type" description={data.management_commission_type} />
                </Col>
                <Col sm={6}>
                  <RenderInformation
                    title="Management Fee Percent"
                    desClass="percentage-symbol"
                    description={data.management_fees_percentage}
                  />
                </Col>
                <Col sm={6}>
                  <RenderInformation
                    title="Min management Fee"
                    desClass="price-symbol"
                    description={data.management_fees_amount}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
      }}
    />
  );
};

const LeaseFees = () => {
  const { property: property_id } = useParams();
  // get property by id
  const property = useGetPropertyByIdQuery(getValidID(property_id));
  const [
    updateLeaseFee,
    { isSuccess: isUpdateLeaseFeeSuccess, isError: isUpdateLeaseFeeError, error: updateLeaseFeeError },
  ] = useUpdatePropertiesInformationMutation();
  useResponse({
    isSuccess: isUpdateLeaseFeeSuccess,
    successTitle: 'Lease Fee has been successfully updated!',
    isError: isUpdateLeaseFeeError,
    error: updateLeaseFeeError,
  });

  return (
    <ApiResponseWrapper
      {...property}
      showMiniError
      loadingComponent={
        <InformationSkeleton skeletonType="column" title={false} columnCount={3} sm={6}>
          <InformationSkeleton lines="single" />
        </InformationSkeleton>
      }
      renderResults={data => {
        return (
          <Card className="border-0 page-section">
            <Card.Header className="border-0 py-3 bg-transparent text-start">
              <p className="fw-bold m-0 text-primary">Lease Fees</p>
              <EditBtn
                className="position-absolute top-0 end-0 m-2"
                permission={PERMISSIONS.PROPERTY}
                onClick={() => {
                  SweetAlert({
                    size: 'lg',
                    html: <LeaseFeeModal updatePropertyDetails={updateLeaseFee} property={data} id={data.id ?? -1} />,
                  }).fire({
                    allowOutsideClick: () => !SwalExtended.isLoading(),
                  });
                }}
              />
            </Card.Header>
            <Card.Body className="text-start">
              <Row className="g-3">
                <Col sm={6}>
                  <RenderInformation title="Lease fee type" description={data.lease_fees_commission_type} />
                </Col>
                <Col sm={6}>
                  <RenderInformation
                    title="Lease Fee Percent"
                    desClass="percentage-symbol"
                    description={data.lease_fees_percentage}
                  />
                </Col>
                <Col sm={6}>
                  <RenderInformation
                    title="Lease fee Amount"
                    desClass="price-symbol"
                    description={data.lease_fees_amount}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
      }}
    />
  );
};

const AdditionalFees = () => {
  const { property: property_id } = useParams();
  // get property by id
  const property = useGetPropertyByIdQuery(getValidID(property_id));
  const [
    updateAdditionalFeeFee,
    {
      isSuccess: isUpdateAdditionalFeeFeeSuccess,
      isError: isUpdateAdditionalFeeFeeError,
      error: updateAdditionalFeeFeeError,
    },
  ] = useUpdatePropertiesInformationMutation();
  useResponse({
    isSuccess: isUpdateAdditionalFeeFeeSuccess,
    successTitle: 'Additional Fee Fee has been successfully updated!',
    isError: isUpdateAdditionalFeeFeeError,
    error: updateAdditionalFeeFeeError,
  });

  return (
    <ApiResponseWrapper
      {...property}
      showMiniError
      loadingComponent={
        <InformationSkeleton skeletonType="column" title={false} columnCount={3} sm={6}>
          <InformationSkeleton lines="single" />
        </InformationSkeleton>
      }
      renderResults={data => {
        return (
          <Card className="border-0 page-section">
            <Card.Header className="border-0 py-3 bg-transparent text-start">
              <p className="fw-bold m-0 text-primary">Additional Fees</p>
              <EditBtn
                className="position-absolute top-0 end-0 m-2"
                permission={PERMISSIONS.PROPERTY}
                onClick={() => {
                  SweetAlert({
                    size: 'lg',
                    html: (
                      <AdditionalFeeModal
                        updatePropertyDetails={updateAdditionalFeeFee}
                        property={data}
                        id={data.id ?? -1}
                      />
                    ),
                  }).fire({
                    allowOutsideClick: () => !SwalExtended.isLoading(),
                  });
                }}
              />
            </Card.Header>
            <Card.Body className="text-start">
              <Row className="g-3">
                <Col sm={6}>
                  <RenderInformation title="GL Account" description={data.additional_fees_gl_account} />
                </Col>
                <Col sm={6}>
                  <RenderInformation
                    title="Percentage"
                    desClass="percentage-symbol"
                    description={data.additional_fees_percentage}
                  />
                </Col>
                <Col sm={6}>
                  <RenderInformation title="Suppress" description={data.addition_fees_suppress ? 'Yes' : 'No'} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
      }}
    />
  );
};

export default Fees;
