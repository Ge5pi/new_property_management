import { Card, Col, Row } from 'react-bootstrap';

import { clsx } from 'clsx';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetPropertyLateFeeInformationQuery } from 'services/api/properties';

import { InformationSkeleton } from 'components/skeleton';

import { EditBtn } from 'core-ui/edit-button';
import { LateFeeModal } from 'core-ui/popups/fee-modals';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { PERMISSIONS } from 'constants/permissions';
import { getValidID } from 'utils/functions';

const LateFeePolicy = ({ late_fee_id }: { late_fee_id?: number | string }) => {
  const lateFee = useGetPropertyLateFeeInformationQuery(getValidID(late_fee_id));

  return (
    <ApiResponseWrapper
      {...lateFee}
      showMiniError
      loadingComponent={
        <InformationSkeleton skeletonType="column" title={false} columnCount={5} sm={6}>
          <InformationSkeleton lines="single" />
        </InformationSkeleton>
      }
      renderResults={data => {
        return (
          <Card className="border-0 page-section">
            <Card.Header className="border-0 py-3 bg-transparent text-start">
              <p className="fw-bold m-0 text-primary">Late fee policy</p>
              <EditBtn
                className="position-absolute top-0 end-0 m-2"
                permission={PERMISSIONS.PROPERTY}
                onClick={() => {
                  if (late_fee_id) {
                    SweetAlert({
                      size: 'xl',
                      html: <LateFeeModal late_fee_policy={data} late_id={late_fee_id} />,
                    }).fire({
                      allowOutsideClick: () => !SwalExtended.isLoading(),
                    });
                  }
                }}
              />
            </Card.Header>
            <Card.Body className="text-start">
              <Row className="g-3">
                <Col sm={6}>
                  <RenderInformation title={'Effective on'} date={data?.start_date} />
                </Col>
                <Col sm={6}>
                  <RenderInformation
                    title={'Daily Late Fee'}
                    desClass={clsx(
                      { 'price-symbol': data?.late_fee_type === 'flat' },
                      { 'percentage-symbol': data?.late_fee_type === 'percentage' }
                    )}
                    description={data?.base_amount_fee}
                  />
                </Col>
                <Col sm={6}>
                  <RenderInformation title={'Eligible Charges'} description={data?.get_eligible_charges_display} />
                </Col>
                <Col sm={6}>
                  <RenderInformation
                    title={'Maximum Late Fee Limit'}
                    desClass="price-symbol"
                    description={data?.daily_amount_per_month_max}
                  />
                </Col>
                <Col sm={6}>
                  <RenderInformation
                    title={'Grace Period'}
                    description={
                      data.grace_period && data.grace_period_type !== 'no_grace_period'
                        ? data.grace_period_type === 'number_of_days'
                          ? `Tenants have ${data?.grace_period} days until they are charges a late fee`
                          : data.grace_period_type === 'till_date_of_month' &&
                            `Tenants have until ${data?.grace_period} day of the following month`
                        : 'Tenants have no grace period'
                    }
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

export default LateFeePolicy;
