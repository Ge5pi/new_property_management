import { Fragment, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetTenantInvoiceByIdQuery } from 'services/api/tenants/accounts';

import { BackButton } from 'components/back-button';
import PageContainer from 'components/page-container';

import { CustomSelect } from 'core-ui/custom-select';
import { RenderInformation } from 'core-ui/render-information';
import { Avatar } from 'core-ui/user-avatar';

import { getValidID, isPositiveNumber } from 'utils/functions';

import { ITenantPayments, TenantPaymentType } from 'interfaces/IAccounting';

import PaymentWithBank from './payment-with-bank';
import PaymentWithStripe from './payment-with-stripe';

interface IProps {
  tenant_payment?: ITenantPayments;
  update?: boolean;
}

//Todo:
function PaymentCRUD({ update, tenant_payment }: IProps) {
  const { invoice_id } = useParams();
  const invoice = useGetTenantInvoiceByIdQuery(getValidID(invoice_id));

  const [payment_method, setPaymentMethod] = useState<TenantPaymentType>(
    tenant_payment && tenant_payment.payment_method ? tenant_payment.payment_method : 'CARD'
  );

  return (
    <div className="my-3">
      <BackButton />
      <h1 className="fw-bold h4 mt-1">Make Payment</h1>
      <PageContainer>
        <ApiResponseWrapper
          {...invoice}
          renderResults={inv_data => (
            <div className="container-fluid page-section pt-4 pb-3">
              <Card className="border-0">
                <Card.Header className="border-0 px-md-3 px-0  bg-transparent text-start">
                  <p className="fw-bold m-0 text-primary">Payment Form</p>
                  <p className="small">Fill out the form to make payment</p>
                </Card.Header>
                <Card.Body className="px-md-3 px-0 text-start">
                  <Row className="mb-2">
                    <Col lg={3}>
                      <RenderInformation title="Title" description={inv_data.slug} desClass="text-uppercase fw-bold" />
                    </Col>
                    <Col lg={3}>
                      <RenderInformation title="Date" date={inv_data.due_date} />
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={3}>
                      <RenderInformation title="Amount" description={inv_data.payable_amount} desClass="price-symbol" />
                    </Col>
                    <Col lg={3}>
                      <RenderInformation
                        title="Payer"
                        html={
                          <Avatar
                            name={`${inv_data.tenant_first_name} ${inv_data.tenant_last_name}`}
                            size={30}
                            showName
                          />
                        }
                      />
                    </Col>
                  </Row>
                  {inv_data.status === 'UNPAID' ? (
                    <Fragment>
                      <Row className="gx-0 gy-3 border-top mt-3 pt-3">
                        <Col xxl={6} lg={7} xs={12}>
                          <CustomSelect
                            controlId="PaymentFormType"
                            labelText="Payment Method"
                            options={[
                              {
                                label: 'Card',
                                value: 'CARD',
                              },
                              {
                                label: 'Bank',
                                value: 'BANK_TRANSFER',
                              },
                            ]}
                            classNames={{
                              labelClass: 'popup-form-labels',
                              wrapperClass: 'mb-3',
                            }}
                            placeholder="Select"
                            name="payment_method"
                            value={payment_method}
                            onSelectChange={value => setPaymentMethod(value as TenantPaymentType)}
                          />
                        </Col>
                      </Row>
                      {isPositiveNumber(inv_data.payable_amount) && isPositiveNumber(inv_data.id) && (
                        <Row>
                          {payment_method === 'BANK_TRANSFER' && (
                            <Col xs={12}>
                              <PaymentWithBank
                                update={update}
                                tenant_payment={tenant_payment}
                                amount={Number(inv_data.payable_amount)}
                                invoice_id={Number(inv_data.id)}
                              />
                            </Col>
                          )}
                          {payment_method === 'CARD' && (
                            <Col lg={7} xs={12}>
                              <PaymentWithStripe
                                payment_id={tenant_payment?.id}
                                amount={Number(inv_data.payable_amount)}
                                invoice={Number(inv_data.id)}
                              />
                            </Col>
                          )}
                        </Row>
                      )}
                    </Fragment>
                  ) : (
                    <Row>
                      <Col xs={12}>
                        <p className="text-info fw-medium my-5 text-center">
                          Pay has been already processed <br />
                          <span className="d-flex flex-row gap-2 align-items-center justify-content-center">
                            <span>
                              <span className="fw-bold text-primary me-1">Payment Status:</span>
                              <span className="fw-bold">{inv_data.get_status_display}</span>
                            </span>
                            {tenant_payment && (
                              <span>
                                <span className="fw-bold text-primary me-1">Payment Method:</span>
                                <span className="fw-bold text-capitalize">
                                  {tenant_payment.payment_method.toLowerCase().replaceAll('_', ' ')}
                                </span>
                              </span>
                            )}
                          </span>
                        </p>
                      </Col>
                    </Row>
                  )}
                </Card.Body>
              </Card>
            </div>
          )}
        />
      </PageContainer>
    </div>
  );
}

export default PaymentCRUD;
