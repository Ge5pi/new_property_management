import { Card, Col, Row, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetChargeAttachmentsQuery } from 'services/api/charges';
import { useGetTenantChargesByIdQuery } from 'services/api/tenants/accounts';

import { AttachmentsForViewTable } from 'components/attachments';
import { BackButton } from 'components/back-button';
import PageContainer from 'components/page-container';

import { RenderInformation } from 'core-ui/render-information';
import { Avatar } from 'core-ui/user-avatar';

import { getValidID } from 'utils/functions';

const ChargeDetails = () => {
  const { charge: charge_id } = useParams();
  const charge = useGetTenantChargesByIdQuery(getValidID(charge_id));

  return (
    <ApiResponseWrapper
      {...charge}
      renderResults={data => {
        return (
          <PageContainer>
            <Stack className="justify-content-between flex-wrap mb-3" direction="horizontal">
              <div>
                <BackButton />
                <h1 className="fw-bold h4 mt-1">
                  Charges <span className="text-uppercase">{data.slug}</span>
                </h1>
              </div>
            </Stack>

            <Card className="border-0 py-2 page-section mb-4">
              <Card.Body className="px-4">
                <div className="mb-4">
                  <h2 className="fs-5 fw-bold text-primary mb-0">{data.title}</h2>
                  <p>{data.get_charge_type_display}</p>
                </div>

                <Row className="mb-3">
                  <Col xs={12} md={8} className="border-end">
                    <Row>
                      <Col xs={12}>
                        <RenderInformation title="Charge date" date={data.created_at} />
                      </Col>
                      <Col xs={12} md={4}>
                        <RenderInformation title="Property" description={data.property_name} />
                      </Col>
                      <Col xs={12} md={4}>
                        <RenderInformation title="Unit" description={data.unit_name} />
                      </Col>
                      <Col xs={12}>
                        <RenderInformation
                          title="Payer (Tenant name)"
                          html={
                            <Avatar name={`${data.tenant_first_name} ${data.tenant_last_name}`} showName size={30} />
                          }
                        />
                      </Col>
                      <Col xs={12} md={10}>
                        <RenderInformation title="Description" description={data.description} />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <ChargeAttachments />
          </PageContainer>
        );
      }}
    />
  );
};

const ChargeAttachments = () => {
  const { charge: charge_id } = useParams();
  const { data = [], ...attachments } = useGetChargeAttachmentsQuery(getValidID(charge_id));

  return <AttachmentsForViewTable {...attachments} data={data} />;
};

export default ChargeDetails;
