import { Fragment, ReactNode, useMemo } from 'react';
import { Card, Col, ListGroup, OverlayTrigger, Row, Stack, Tooltip } from 'react-bootstrap';

import { clsx } from 'clsx';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { GenericQueryHookResult } from 'services/api/types/rtk-query';

import { BackButton } from 'components/back-button';
import { ItemDate, ItemPrice, ItemSlug, ItemStatus } from 'components/custom-cell';
import Skeleton, { InformationSkeleton, InlineSkeleton } from 'components/skeleton';
import SingleSkeleton from 'components/skeleton/skeleton';
import { SimpleTable } from 'components/table';

import { CalendarIcon, CheckMarkIcon, InfoIcon } from 'core-ui/icons';
import { LazyImage } from 'core-ui/lazy-image';

import { displayDate, formatPhoneNumber, formatPricing, getCountry, isNegativeNumber } from 'utils/functions';

import { IChargesAPI, IInvoicesAPI } from 'interfaces/IAccounting';
import { ILeaseForm } from 'interfaces/IApplications';
import { ILateFeePolicy, ISingleProperty } from 'interfaces/IProperties';
import { IBusinessInformation } from 'interfaces/ISettings';
import { ISingleTenant } from 'interfaces/ITenant';
import { ISingleUnit } from 'interfaces/IUnits';

declare type BusinessInformationType = GenericQueryHookResult<void, IBusinessInformation[]>;
declare type LeaseDetailsType = GenericQueryHookResult<number | string, ILeaseForm>;
declare type PrimaryTenantDetailsType = GenericQueryHookResult<number | string, ISingleTenant>;
declare type PropertyDetailsType = GenericQueryHookResult<number | string, ISingleProperty>;
declare type PropertyLateFeeDetailsType = GenericQueryHookResult<number | string, ILateFeePolicy>;
declare type UnitDetailsType = GenericQueryHookResult<number | string, ISingleUnit>;

declare type ListOfChargesType = GenericQueryHookResult<{ invoice?: string }, Array<IChargesAPI>>;
declare type ListOfArrearsType = GenericQueryHookResult<{ arrear_of?: string }, Array<IInvoicesAPI>>;

interface IProps {
  invoice: IInvoicesAPI;
  business_information: BusinessInformationType;
  lease: LeaseDetailsType;
  primary_tenant: PrimaryTenantDetailsType;
  property: PropertyDetailsType;
  late_fee: PropertyLateFeeDetailsType;
  unit: UnitDetailsType;
  charges: ListOfChargesType;
  arrears: ListOfArrearsType;
  invoice_path: string;
  PayNowButton?: ReactNode;
}

const RentalInvoiceDetail = ({ invoice, invoice_path, PayNowButton, ...props }: IProps) => {
  const { arrears, business_information, charges, late_fee, lease, property, primary_tenant, unit } = props;

  const charges_record = useMemo(() => charges.data ?? [], [charges]);
  const arrears_record = useMemo(() => arrears.data ?? [], [arrears]);

  const charges_columns = useMemo(
    () => [
      {
        Header: 'Charge Title',
        accessor: 'title',
      },
      {
        Header: 'Charge Date',
        accessor: 'created_at',
        Cell: ItemDate,
      },
      {
        Header: 'Charge Amount',
        accessor: 'amount',
        Cell: ItemPrice,
      },
    ],
    []
  );

  const arrears_columns = useMemo(
    () => [
      {
        Header: 'Invoice Number',
        accessor: 'slug',
        Cell: ItemSlug,
      },
      {
        Header: 'Rent Month',
        accessor: 'created_at',
        Cell: ItemDate,
      },
      {
        Header: 'Rent Cycle',
        accessor: 'rent_cycle',
      },
      {
        Header: 'Rent Amount',
        accessor: 'rent_amount',
        Cell: ItemPrice,
      },
      {
        Header: 'Due date',
        accessor: 'due_date',
        Cell: ItemDate,
      },
      {
        Header: 'Late fee',
        accessor: 'p_l_fee',
        Cell: ItemPrice,
      },
    ],
    []
  );

  return (
    <Fragment>
      <div>
        <div>
          <BackButton />
          <h1 className="fw-bold h4 mt-1 mb-3 text-primary">Invoice Details</h1>
        </div>

        <Card className="border-0 p-0 page-section mb-3">
          <Card.Header className="bg-white border-0 p-4">
            <Row className="justify-content-between">
              <Col xs={12} xxl={4} md={5} sm className="order-sm-1 order-2">
                <ApiResponseWrapper
                  {...business_information}
                  hideIfNoResults
                  showError={false}
                  loadingComponent={
                    <Fragment>
                      <InlineSkeleton className="m-1 rounded-2 ratio ratio-1x1" style={{ width: 100, height: 100 }} />
                      <InformationSkeleton />
                    </Fragment>
                  }
                  renderResults={business => {
                    const profile = business.find(b => Number(b.id) === Number(invoice.business_information));
                    if (profile) {
                      return (
                        <Fragment>
                          {profile.logo && (
                            <div className="w-75 mb-3">
                              <Card.Img as={LazyImage} src={profile.logo as string} size="4x3" />
                            </div>
                          )}
                          <h2 className="fs-5 fw-bold mb-2">Business Details</h2>
                          <div className="mb-2">
                            <div>
                              <span className="fw-medium">{profile.name}</span>
                            </div>
                            <div>Building / Office # {profile.building_or_office_number}</div>
                            <div>
                              {profile.street}, {profile.city}, {profile.postal_code}, {getCountry(profile.country)}
                            </div>
                            <div>
                              Email:
                              <a
                                className="mx-1 link link-info"
                                href={`mailto:${profile.primary_email}`}
                                rel="noreferrer"
                                target="_blank"
                              >
                                {profile.primary_email}
                              </a>
                            </div>
                            <div>
                              Phone:
                              <a
                                className="mx-1 link link-info"
                                href={`tel:${profile.phone_number}`}
                                rel="noreferrer"
                                target="_blank"
                              >
                                {formatPhoneNumber(profile.phone_number)}
                              </a>
                            </div>
                          </div>
                        </Fragment>
                      );
                    }

                    return <Fragment />;
                  }}
                />
              </Col>
              <Col xs="auto" sm={5} lg={4} className="small order-sm-2 order-1">
                {!invoice.arrear_of && invoice.status === 'UNPAID' && PayNowButton && (
                  <div className="my-5"> {PayNowButton} </div>
                )}
                <ul className="list-unstyled my-3">
                  <li className="text-muted fs-6 mb-2">
                    <span className="fw-bold">Invoice: </span>
                    <span className="text-uppercase">{invoice.slug}</span>
                  </li>
                  <li className="text-muted">
                    <span className="fw-bold">Issued Date: </span>
                    <span className="d-inline-flex align-items-center gap-1">
                      {displayDate(invoice.created_at)} <CalendarIcon size="20" color="#ABABAB" />
                    </span>
                  </li>
                  <li className="text-muted">
                    <span className="fw-bold">Payment Date: </span>
                    <span className="d-inline-flex align-items-center gap-1">
                      {displayDate(invoice.due_date)} <CalendarIcon size="20" color="#ABABAB" />
                    </span>
                  </li>
                  {invoice.status && invoice.get_status_display && (
                    <li className="text-muted">
                      <span className="me-1 fw-bold">Status:</span>
                      <span className="d-inline-block fw-bold">
                        <ItemStatus
                          value={{
                            statusFor: 'page',
                            iconPosition: 'end',
                            displayValue: invoice.get_status_display,
                            status: invoice.status,
                            className: {
                              UNPAID: 'text-warning',
                              NOT_VERIFIED: 'text-info',
                              VERIFIED: 'text-success',
                              REJECTED: 'text-danger',
                            },
                          }}
                        />
                      </span>
                    </li>
                  )}
                </ul>
              </Col>
            </Row>
          </Card.Header>

          <hr className="mx-4" />
          <Card.Body className="px-4">
            <Row className="justify-content-between my-4">
              <Col xs={12} sm={6} md={4}>
                <ApiResponseWrapper
                  {...primary_tenant}
                  hideIfNoResults
                  showError={false}
                  loadingComponent={<InformationSkeleton />}
                  renderResults={tenant_info => (
                    <div>
                      <h2 className="fs-5 fw-bold mb-2">Bill to</h2>
                      <div className="mb-2">
                        <div>
                          <span className="fw-medium">
                            {tenant_info.first_name} {tenant_info.last_name}
                          </span>
                        </div>
                        <div>{tenant_info.address}</div>
                        <div>
                          Email:
                          <a
                            className="mx-1 link link-info"
                            href={`mailto:${tenant_info.email}`}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {tenant_info.email}
                          </a>
                        </div>
                        <div>
                          Phone:
                          <a
                            className="mx-1 link link-info"
                            href={`tel:${tenant_info.phone_number}`}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {formatPhoneNumber(tenant_info.phone_number)}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </Col>
              <Col xs={12} sm={5} md={4}>
                <ul className="list-unstyled my-3">
                  <li className="text-primary fs-6 mb-2 text-uppercase">
                    <span className="fw-bold">Rent Details </span>
                  </li>
                  <li className="text-primary">
                    <span className="fw-medium">Rent Cycle: </span>
                    <span className="d-inline-block">{invoice.rent_cycle}</span>
                  </li>
                  <ApiResponseWrapper
                    {...lease}
                    hideIfNoResults
                    showError={false}
                    loadingComponent={
                      <Fragment>
                        <li className="text-primary">
                          <span className="fw-medium">Lease Start Date: </span>
                          <InlineSkeleton xs={3} className="mx-2" />
                        </li>
                        <li className="text-primary">
                          <span className="fw-medium">Lease End Date: </span>
                          <InlineSkeleton xs={3} className="mx-2" />
                        </li>
                      </Fragment>
                    }
                    renderResults={lease_details => (
                      <Fragment>
                        <li className="text-primary">
                          <span className="fw-medium">Lease Start Date: </span>
                          <span className="d-inline-flex align-items-center gap-1">
                            {displayDate(lease_details.start_date)} <CalendarIcon size="20" color="#ABABAB" />
                          </span>
                        </li>
                        <li className="text-primary">
                          <span className="fw-medium">Lease End Date: </span>
                          <span className="d-inline-flex align-items-center gap-1">
                            {displayDate(lease_details.end_date)} <CalendarIcon size="20" color="#ABABAB" />
                          </span>
                        </li>
                      </Fragment>
                    )}
                  />
                </ul>
              </Col>
            </Row>

            <ApiResponseWrapper
              {...property}
              showMiniError
              hideIfNoResults
              loadingComponent={
                <Card className="item-hover shadow-sm border justify-content-between">
                  <Card.Body className="py-2">
                    <Row className="gx-0 align-items-center">
                      <Col xs={'auto'}>
                        <InlineSkeleton className="m-1 rounded-2 ratio ratio-1x1" style={{ width: 70, height: 70 }} />
                      </Col>
                      <Col sm xs={'auto'}>
                        <div className="mx-3">
                          <SingleSkeleton xs={4} className="mb-2 mt-3" />
                          <Skeleton xs={2} className="mb-2" />
                          <div className="small fw-medium pe-lg-4 pe-md-5 pe-1 pt-0 pb-3 text-start">
                            <SingleSkeleton xs={8} className="mb-2" />
                          </div>
                        </div>
                      </Col>
                      <Col xxl={2} md={3} xs={12}>
                        <div className="mx-sm-3 mx-1">
                          <InformationSkeleton lines="single" />
                        </div>
                      </Col>
                      <Col xxl={2} md={3} xs={12}>
                        <div className="mx-sm-3 text-end mx-1">
                          <InformationSkeleton lines="single" />
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              }
              renderResults={property_details => (
                <Fragment>
                  <Card className="item-hover shadow-sm border justify-content-between">
                    <Card.Body className="py-2">
                      <Row className="gx-2 align-items-center">
                        <Col xs={'auto'}>
                          <div className="">
                            <LazyImage
                              src={property_details.cover_picture}
                              wrapperClass="m-1 rounded-2 border border-dark"
                              wrapperStyle={{ width: 70, height: 70 }}
                            />
                          </div>
                        </Col>
                        <Col md xs={12}>
                          <div className="">
                            <p className="fw-bold mt-3 mb-1">{property_details.name}</p>
                            <ApiResponseWrapper
                              {...unit}
                              hideIfNoResults
                              showError={false}
                              loadingComponent={<Skeleton xs={8} />}
                              renderResults={unit_info => (
                                <Card.Subtitle className="small text-muted mb-1">{unit_info.name}</Card.Subtitle>
                              )}
                            />
                            <Card.Text className="small fw-medium pe-lg-4 pe-md-5 pe-1 pt-0 pb-3 text-start w-75">
                              {property_details.address}
                            </Card.Text>
                          </div>
                        </Col>
                        <Col xxl={2} xl={3} md={'auto'} xs={6}>
                          <div className="mx-md-5">
                            <p className="fw-light mb-1">Rent Cycle</p>
                            <p className="text-primary fw-medium">{invoice.rent_cycle}</p>
                          </div>
                        </Col>
                        <Col xxl={2} xl={3} md={'auto'} xs={6}>
                          <div className="text-md-end">
                            <p className="fw-light mb-1">Rent Amount</p>
                            <p className="text-primary fw-medium">
                              <span
                                className={clsx(
                                  {
                                    '-ive':
                                      isNegativeNumber(invoice.total_paid_amount) ||
                                      isNegativeNumber(invoice.payable_amount),
                                  },
                                  'price-symbol'
                                )}
                              >
                                {invoice.status === 'VERIFIED' || invoice.status === 'NOT_VERIFIED'
                                  ? formatPricing(invoice.total_paid_amount)
                                  : formatPricing(invoice.payable_amount)}
                              </span>
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Fragment>
              )}
            />

            <div className="my-3">
              <div className="mb-3">
                <SimpleTable
                  {...charges}
                  clickable
                  showTotal
                  data={charges_record}
                  searchable={false}
                  columns={charges_columns}
                  pageHeader={<p className="fs-5 fw-bold m-0 text-primary">Charges</p>}
                />
              </div>

              <div className="mb-2">
                <SimpleTable
                  {...arrears}
                  clickable
                  showTotal
                  data={arrears_record}
                  searchable={false}
                  columns={arrears_columns}
                  pageHeader={<p className="fs-5 fw-bold m-0 text-primary">Arrears</p>}
                  onRowClick={row => {
                    if (row.original) {
                      const arrear = row.original;
                      if ('id' in arrear) {
                        window.open(invoice_path + '/' + arrear.id + '/details', '_blank');
                      }
                    }
                  }}
                />
              </div>
            </div>

            <Row className="justify-content-between gy-3 my-2">
              <Col xs={12} md={4}>
                {invoice.payable_late_fee && (
                  <Fragment>
                    <ul className="list-unstyled my-3">
                      <li className="text-primary fs-6 mb-2 text-uppercase">
                        <span className="fw-bold">Late Fee Details</span>
                      </li>
                      <li className="text-primary">
                        <span className="fw-medium">Late fee Amount: </span>
                        <span
                          className={clsx(
                            {
                              '-ive':
                                isNegativeNumber(invoice.payed_late_fee) || isNegativeNumber(invoice.payable_late_fee),
                            },
                            'd-inline-block price-symbol'
                          )}
                        >
                          {invoice.status === 'NOT_VERIFIED' || invoice.status === 'VERIFIED'
                            ? formatPricing(invoice.payed_late_fee)
                            : formatPricing(invoice.payable_late_fee)}
                        </span>
                      </li>
                      <li className="text-primary">
                        <span className="fw-medium">Will be applied after: </span>
                        <span className="d-inline-flex align-items-center gap-1">
                          {displayDate(invoice.due_date)} <CalendarIcon size="20" color="#ABABAB" />
                        </span>
                      </li>
                      <ApiResponseWrapper
                        {...late_fee}
                        hideIfNoResults
                        showError={false}
                        loadingComponent={
                          <li className="text-primary">
                            <span className="fw-medium">Will be applied: </span>
                            <InlineSkeleton xs={3} className="mx-2" />
                          </li>
                        }
                        renderResults={late_fee_data => (
                          <li className="text-primary">
                            {late_fee_data.charge_daily_late_fees && (
                              <Fragment>
                                <span className="fw-medium">Will be applied: </span>
                                <span className="d-inline-block">Daily</span>
                              </Fragment>
                            )}
                          </li>
                        )}
                      />
                    </ul>
                  </Fragment>
                )}
              </Col>

              <Col md={4}>
                <ListGroup>
                  <ListGroup.Item className="pt-0">
                    <div className="m-0">
                      <p className="fw-bold m-0 text-primary bg-primary text-white px-3 py-2">Summary</p>

                      <Stack className="justify-content-between mt-2 px-3" direction="horizontal">
                        <p className="m-0 small fw-medium">Rent Amount</p>
                        <p
                          className={clsx(
                            {
                              '-ive': isNegativeNumber(invoice.rent_amount),
                            },
                            'm-0 small fw-medium price-symbol'
                          )}
                        >
                          {formatPricing(invoice.rent_amount)}
                        </p>
                      </Stack>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-3">
                    <Stack className="justify-content-between" direction="horizontal">
                      <p className="m-0 small fw-medium">Charges</p>
                      <p
                        className={clsx(
                          {
                            '-ive': isNegativeNumber(invoice.total_charges_amount),
                          },
                          'm-0 small fw-medium price-symbol'
                        )}
                      >
                        {formatPricing(invoice.total_charges_amount)}
                      </p>
                    </Stack>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-3">
                    <Stack className="justify-content-between" direction="horizontal">
                      <p className="m-0 small fw-medium">Late fee</p>
                      <p
                        className={clsx(
                          {
                            '-ive':
                              isNegativeNumber(invoice.payed_late_fee) || isNegativeNumber(invoice.payable_late_fee),
                          },
                          'm-0 small fw-medium price-symbol'
                        )}
                      >
                        {invoice.is_late_fee_applicable && invoice.payable_late_fee
                          ? invoice.status === 'NOT_VERIFIED' || invoice.status === 'VERIFIED'
                            ? formatPricing(invoice.payed_late_fee)
                            : formatPricing(invoice.payable_late_fee)
                          : Number(0).toFixed(2)}
                      </p>
                    </Stack>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-3">
                    <Stack className="justify-content-between" direction="horizontal">
                      <p className="m-0 small fw-medium">Arrears</p>
                      <p
                        className={clsx(
                          {
                            '-ive': isNegativeNumber(invoice.arrears_amount),
                          },
                          'm-0 small fw-medium price-symbol'
                        )}
                      >
                        {formatPricing(invoice.arrears_amount)}
                      </p>
                    </Stack>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-3">
                    <Stack className="justify-content-between" direction="horizontal">
                      <p className="m-0 small fw-medium">Total</p>
                      <div className="m-0 small fw-medium">
                        {invoice.status === 'VERIFIED' || invoice.status === 'NOT_VERIFIED' ? (
                          <span className="d-inline-flex gap-2">
                            <span
                              className={clsx(
                                {
                                  '-ive': isNegativeNumber(invoice.total_paid_amount),
                                },
                                'price-symbol'
                              )}
                            >
                              {formatPricing(invoice.total_paid_amount)}
                            </span>
                            <OverlayTrigger
                              overlay={tooltipProps => (
                                <Tooltip
                                  {...tooltipProps}
                                  arrowProps={{ style: { display: 'none' } }}
                                  id={`invoice-status-tooltip`}
                                >
                                  {invoice.get_status_display}
                                </Tooltip>
                              )}
                            >
                              <div>
                                {invoice.status === 'VERIFIED' ? (
                                  <CheckMarkIcon size="18" />
                                ) : (
                                  <InfoIcon color="#3360d4" size="18" />
                                )}
                              </div>
                            </OverlayTrigger>
                          </span>
                        ) : (
                          <span
                            className={clsx(
                              {
                                '-ive': isNegativeNumber(invoice.payable_amount),
                              },
                              'price-symbol'
                            )}
                          >
                            {formatPricing(invoice.payable_amount)}
                          </span>
                        )}
                      </div>
                    </Stack>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </Fragment>
  );
};

export default RentalInvoiceDetail;
