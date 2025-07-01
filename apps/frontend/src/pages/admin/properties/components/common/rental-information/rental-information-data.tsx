import { useMemo } from 'react';
import { Card, Col, OverlayTrigger, Row, Stack, Tooltip } from 'react-bootstrap';
import { Fragment } from 'react/jsx-runtime';

import { skipToken } from '@reduxjs/toolkit/query';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetListOfGeneralTagsQuery } from 'services/api/system-preferences';

import { InformationSkeleton, InlineSkeleton } from 'components/skeleton';

import { BathroomIcon, BedIcon, InfoIcon } from 'core-ui/icons';
import { RenderInformation } from 'core-ui/render-information';

import { ISingleUnitType, IUnitTypeIndependentFields } from 'interfaces/IUnits';

interface IProps extends IUnitTypeIndependentFields {
  unit_type: ISingleUnitType;
}

const RentalInformationData = ({
  unit_type,
  market_rent,
  application_fee,
  effective_date,
  estimate_turn_over_cost,
  future_market_rent,
}: IProps) => {
  const tags = useGetListOfGeneralTagsQuery(unit_type && unit_type.tags ? unit_type.tags : skipToken);
  const rent = useMemo(() => {
    if (!market_rent) return unit_type.market_rent;
    return market_rent;
  }, [market_rent, unit_type]);

  const fee = useMemo(() => {
    if (!application_fee) return unit_type.application_fee;
    return application_fee;
  }, [application_fee, unit_type]);

  const rental_date = useMemo(() => {
    if (!effective_date) return unit_type.effective_date;
    return effective_date;
  }, [effective_date, unit_type]);

  const turnover_cost = useMemo(() => {
    if (!estimate_turn_over_cost) return unit_type.estimate_turn_over_cost;
    return estimate_turn_over_cost;
  }, [estimate_turn_over_cost, unit_type]);

  const future_rent = useMemo(() => {
    if (!future_market_rent) return unit_type.future_market_rent;
    return future_market_rent;
  }, [future_market_rent, unit_type]);

  return (
    <Fragment>
      <Card.Body className="text-start">
        <Row className="gx-0">
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Bathroom" description={unit_type.bath_rooms} icon={<BathroomIcon />} />
          </Col>
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Bedroom" description={unit_type.bed_rooms} icon={<BedIcon />} />
          </Col>
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Square feet" description={unit_type.square_feet} desClass="sqrFeet-symbol" />
          </Col>
        </Row>

        <Row className="gx-0">
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Market rent" desClass="price-symbol" description={rent} />
          </Col>
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Future Market rent" desClass="price-symbol" description={future_rent} />
          </Col>
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Effective date" date={rental_date} />
          </Col>
        </Row>

        <Row className="gx-0">
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Application Fee" desClass="price-symbol" description={fee} />
          </Col>
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Estimated Turnover cost" desClass="price-symbol" description={turnover_cost} />
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer className="border-0 bg-transparent">
        <ApiResponseWrapper
          {...tags}
          hideIfNoResults
          showError={false}
          loadingComponent={
            <InformationSkeleton skeletonType="column" title={false} columnCount={4} xs={'auto'}>
              <InlineSkeleton bg="placeholder" className="px-5 py-2 d-inline-block" />
            </InformationSkeleton>
          }
          renderResults={tags => {
            return (
              <div className="mb-4">
                <Stack direction="horizontal" gap={1}>
                  {tags
                    .filter(d => d.id)
                    .map(item => (
                      <span key={item.id} className="mb-3 py-2 px-3 fw-medium badge rounded-pill bg-dark me-1">
                        {item.name}
                      </span>
                    ))}
                  {unit_type.tags && tags.length !== unit_type.tags.length && (
                    <OverlayTrigger
                      overlay={tooltipProps => (
                        <Tooltip
                          {...tooltipProps}
                          arrowProps={{ style: { display: 'none' } }}
                          id={`tags-not-found-tooltip`}
                        >
                          Some tags were skipped because no record was found with given ID
                        </Tooltip>
                      )}
                    >
                      <span className="text-danger">
                        <InfoIcon size="10px" />
                      </span>
                    </OverlayTrigger>
                  )}
                </Stack>
              </div>
            );
          }}
        />
      </Card.Footer>
    </Fragment>
  );
};

export default RentalInformationData;
