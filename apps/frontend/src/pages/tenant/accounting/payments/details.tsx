import { Fragment } from 'react';
import { Card, Col, Row, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { clsx } from 'clsx';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetBankAccountByIdQuery } from 'services/api/bank-accounts';
import { useGetPaymentsAttachmentsQuery } from 'services/api/payments';
import { useGetTenantInvoiceByIdQuery } from 'services/api/tenants/accounts';
import { useGetTenantPaymentsByIdQuery } from 'services/api/tenants/payments';

import { AttachmentsForViewTable } from 'components/attachments';
import { BackButton } from 'components/back-button';
import PageContainer from 'components/page-container';
import { InformationSkeleton } from 'components/skeleton';

import { CheckMarkIcon, DotIcon } from 'core-ui/icons';
import { RenderInformation } from 'core-ui/render-information';

import { formatPricing, getIDFromObject, getValidID, isNegativeNumber } from 'utils/functions';

import { ChargeStatus } from 'interfaces/IAccounting';

const Details = () => {
  const { id: payment_id } = useParams();

  const payment = useGetTenantPaymentsByIdQuery(getValidID(payment_id));
  const invoice = useGetTenantInvoiceByIdQuery(getIDFromObject('invoice', payment.data));
  const bank = useGetBankAccountByIdQuery(getIDFromObject('account', payment.data));

  return (
    <PageContainer>
      <Stack className="justify-content-between flex-wrap mb-3" direction="horizontal">
        <div>
          <BackButton />
          <h1 className="fw-bold h4 mt-1">Payment Details</h1>
        </div>
      </Stack>
      <ApiResponseWrapper
        {...payment}
        renderResults={data => {
          return (
            <Fragment>
              <Card className="border-0 p-4 page-section mb-3">
                <Card.Header className="border-0 bg-transparent">
                  <h6 className="fw-bold m-0 text-primary fs-5">
                    Rental Invoice <span className="text-uppercase">({data.invoice_slug})</span>
                  </h6>
                  <p className="m-0">
                    Payment Method: <span className="fw-bold">{data.get_payment_method_display}</span>
                  </p>
                </Card.Header>

                <Card.Body>
                  <Row className="justify-content-between align-items-center">
                    <Col md={8}>
                      <ApiResponseWrapper
                        {...invoice}
                        showError={false}
                        loadingComponent={
                          <InformationSkeleton columnCount={4} skeletonType="column" sm={6} lg={4}>
                            <InformationSkeleton skeletonType="text-description" lines="single" />
                          </InformationSkeleton>
                        }
                        renderResults={inv_data => (
                          <Row className="gx-3 gy-2 flex-fill">
                            <Col sm={6} lg={4}>
                              <RenderInformation title="Date" date={inv_data.due_date} />
                            </Col>
                            <Col sm={6} lg={4}>
                              <RenderInformation title="Paid Date" date={data.payment_date} />
                            </Col>
                            <Col lg={12}>
                              <RenderInformation
                                title="Payer (Tenant name)"
                                description={`${inv_data.tenant_first_name} ${inv_data.tenant_last_name}`}
                              />
                            </Col>
                            <Col lg={12}>
                              <RenderInformation title="Remarks" description={data.remarks} />
                            </Col>
                          </Row>
                        )}
                      />
                    </Col>
                    <Col md={1}>
                      <hr className="vertical-rule d-none d-md-block" />
                    </Col>
                    <Col md={3}>
                      <div className="text-center">
                        <p className="fs-5 fw-bold m-0 text-primary">
                          <span className={clsx({ '-ive': isNegativeNumber(data.amount) }, 'price-symbol')}>
                            {formatPricing(data.amount)}
                          </span>
                        </p>
                        <p className="fw-medium">Amount</p>
                        {data.status &&
                          ((data.status as ChargeStatus) === 'VERIFIED' ? (
                            <Stack direction="horizontal" className="align-items-center justify-content-center" gap={2}>
                              <CheckMarkIcon />
                              <p className="text-success fw-bold m-0">Amount Paid</p>
                            </Stack>
                          ) : (
                            <Stack direction="horizontal" className="align-items-center justify-content-center" gap={2}>
                              <p className="text-info fw-medium m-0 text-capitalize">{data.get_status_display}</p>
                              <DotIcon color="#3360D4" />
                            </Stack>
                          ))}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <ApiResponseWrapper
                {...bank}
                showError={false}
                hideIfNoResults
                loadingComponent={
                  <Card>
                    <Card.Header className="border-0 bg-transparent">
                      <h6 className="fw-bold m-0 text-primary fs-5">Bank Details</h6>
                      <p className="small">Information about the paying bank</p>
                    </Card.Header>
                    <Card.Body>
                      <InformationSkeleton columnCount={3} skeletonType="column" sm={6}>
                        <InformationSkeleton skeletonType="text-description" lines="single" />
                      </InformationSkeleton>
                    </Card.Body>
                  </Card>
                }
                renderResults={bank_data => (
                  <Card className="border-0 p-3 page-section mb-3">
                    <Card.Header className="border-0 bg-transparent">
                      <h6 className="fw-bold m-0 text-primary fs-5">Bank Details</h6>
                      <p className="small">Information about the paying bank</p>
                    </Card.Header>
                    <Card.Body>
                      <Row className="gx-3 gy-2">
                        <Col md={12}>
                          <RenderInformation title="Bank Name" date={bank_data.bank_name} />
                        </Col>
                        <Col md={4} lg={3}>
                          <RenderInformation title="Account Title" date={bank_data.account_title} />
                        </Col>
                        <Col md={4} lg={3}>
                          <RenderInformation title="Account Number" description={bank_data.account_number} />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}
              />

              <PaymentAttachments />
            </Fragment>
          );
        }}
      />
    </PageContainer>
  );
};

export default Details;

const PaymentAttachments = () => {
  const { id: payment_id } = useParams();
  const { data = [], ...attachments } = useGetPaymentsAttachmentsQuery(getValidID(payment_id));
  return <AttachmentsForViewTable {...attachments} data={data} />;
};
