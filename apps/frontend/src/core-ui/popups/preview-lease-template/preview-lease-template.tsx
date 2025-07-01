import { Fragment } from 'react';
import { Button, Card, Col, Row, Stack } from 'react-bootstrap';

import { clsx } from 'clsx';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetLeaseTemplateByIdQuery } from 'services/api/lease-templates';
import { useGetPropertyByIdQuery } from 'services/api/properties';

import { Popup } from 'components/popup';
import { Signature } from 'components/signature';

import { NewTabIcon } from 'core-ui/icons';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { HtmlDisplay, RenderInformation } from 'core-ui/render-information';
import { SwalExtended } from 'core-ui/sweet-alert';

import { getIDFromObject, getValidID } from 'utils/functions';

import { ISecondaryTenant, LeaseRentCycle, LeaseType } from 'interfaces/IApplications';

import { Step01Residence } from 'pages/admin/leasing/components/lease-steps';

interface ILeaseInputValues {
  start_date: string;
  end_date: string;
  lease_type: LeaseType;
  secondary_tenants: ISecondaryTenant[];
  gl_account: string;
  amount: number | string;
  rent_cycle?: LeaseRentCycle;
  description?: string;
  due_date: string;
  security_deposit_date: string;
  security_deposit_amount: number | string;
  charge_title: string;
  charge_description: string;
  charge_amount: string | number;
  charge_account: string;
}

interface IProps {
  property?: number;
  unit_name?: string;
  applicant_name?: string;
  lease: Partial<ILeaseInputValues>;
  lease_template_id?: number;
  type: 'update' | 'new' | 'renew' | 'preview';
}

const PreviewLeaseTemplate = (props: IProps) => {
  return (
    <Popup
      title={'Residency & Financial'}
      subtitle={'Verify information regarding the applicant'}
      onSubmit={() => SwalExtended.close({ isConfirmed: true, isDismissed: false, isDenied: false })}
      successButton={['renew', 'update'].includes(props.type) ? props.type : 'Save'}
      openForPreview={props.type === 'preview'}
    >
      <LeaseAgreement {...props} />
    </Popup>
  );
};

export default ProviderHOC(PreviewLeaseTemplate);

export const LeaseAgreement = ({ property, lease, type, unit_name, applicant_name, lease_template_id }: IProps) => {
  const { refetch, ...property_record } = useGetPropertyByIdQuery(getValidID(property));
  const lease_template = useGetLeaseTemplateByIdQuery(
    lease_template_id && lease_template_id > 0
      ? lease_template_id
      : type === 'renew'
        ? getIDFromObject('default_lease_renewal_template', property_record.data)
        : getIDFromObject('default_lease_template', property_record.data)
  );

  const handleLeaseTemplate = () => {
    const popup = window.open(
      `/admin/properties/${property}/details?popup=true#:~:text=unknown-,Lease,-settings`,
      '_blank'
    );
    if (popup) {
      const timer = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(timer);
          refetch();
        }
      }, 500);
    }
  };

  return (
    <ApiResponseWrapper
      {...property_record}
      showMiniError
      renderResults={property_data => (
        <Fragment>
          <ApiResponseWrapper
            {...lease_template}
            showMiniError
            renderIfNoResult={
              <Card className="border-0 p-4">
                <Card.Header className="p-0 border-0 bg-transparent text-center">
                  <Card.Subtitle className="text-muted text-center mb-2">
                    No {type === 'renew' ? 'Renewal' : ''} lease template found
                  </Card.Subtitle>
                  <Card.Text className="fs-6">
                    Please Select A Template For:
                    <span className="fw-bold mx-1">{property_data.name ?? 'Selected Property'}</span>
                  </Card.Text>
                  <Button
                    className="btn btn-link link-info d-inline-flex align-items-center"
                    onClick={handleLeaseTemplate}
                  >
                    Open Property
                    <span className="mx-1">
                      <NewTabIcon />
                    </span>
                  </Button>
                </Card.Header>
              </Card>
            }
            renderResults={template => (
              <div>
                <Card className="border-0 shadow-none border-bottom">
                  <Card.Body className="px-0">
                    <Step01Residence
                      lease={{ ...lease, amount: Number(lease.amount) }}
                      property_unit_name={`${property_data.name} - ${unit_name}`}
                      late_fee_amount={property_data.late_fee_base_amount}
                      tenant_name={applicant_name}
                    />
                  </Card.Body>
                </Card>
                <div className="page-break auto" />
                {template.rules_and_policies && (
                  <Card className="border-0 shadow-none border-bottom my-4">
                    <Card.Body className="px-0">
                      <Card.Title className="fw-bold">Policies & Procedures</Card.Title>
                      <Card.Subtitle>set of rules for the property</Card.Subtitle>
                      <ol className="my-4">
                        {template.rules_and_policies.map((p, ix) => (
                          <li className="my-2" key={ix}>
                            {p}
                          </li>
                        ))}
                      </ol>
                    </Card.Body>
                  </Card>
                )}
                <div className="page-break auto" />
                <Card className="border-0 shadow-none border-bottom my-4">
                  {template.condition_of_premises && (
                    <Card.Body className="px-0">
                      <Card.Title className="fw-bold">Responsibilities</Card.Title>
                      <Card.Subtitle>Conditions based on which charges can be done</Card.Subtitle>
                      <ol className="my-4">
                        {template.condition_of_premises.map((p, ix) => (
                          <li className="my-2" key={ix}>
                            {p}
                          </li>
                        ))}
                      </ol>
                    </Card.Body>
                  )}

                  <div className="page-break auto" />
                  <Card.Body className="px-0">
                    <RenderInformation
                      title="Right to Inspection"
                      html={
                        <Stack direction="horizontal" gap={4} className="flex-wrap">
                          <div className="form-check">
                            <span
                              className={clsx('form-check-input', {
                                'checked-mark checked-mark-green': template.right_of_inspection,
                              })}
                            ></span>
                            <span className="form-check-label">Yes</span>
                          </div>
                          <div className="form-check">
                            <span
                              className={clsx('form-check-input', {
                                'checked-mark checked-mark-green': !template.right_of_inspection,
                              })}
                            ></span>
                            <span className="form-check-label">No</span>
                          </div>
                        </Stack>
                      }
                    />
                  </Card.Body>

                  {template.conditions_of_moving_out && (
                    <Card.Body className="px-0">
                      <div className="page-break auto" />
                      <Card.Subtitle>Under what conditions moving out is applicable</Card.Subtitle>
                      <ol className="my-4">
                        {template.conditions_of_moving_out.map((p, ix) => (
                          <li className="my-2" key={ix}>
                            {p}
                          </li>
                        ))}
                      </ol>
                    </Card.Body>
                  )}
                </Card>
                {template.releasing_policies && (
                  <Card className="border-0 shadow-none border-bottom my-4">
                    <div className="page-break auto" />
                    <Card.Body className="px-0">
                      <Card.Title className="fw-bold">General</Card.Title>
                      <Card.Subtitle>Some common releasing policies</Card.Subtitle>
                      <ol className="my-4">
                        {template.releasing_policies.map((p, ix) => (
                          <li className="my-2" key={ix}>
                            {p}
                          </li>
                        ))}
                      </ol>
                    </Card.Body>
                  </Card>
                )}

                <div>
                  {template.final_statement && (
                    <Card className="border-0 shadow-none border-bottom my-4">
                      <div className="page-break auto" />
                      <Card.Body className="px-0">
                        <Card.Title className="fw-bold">Sign & accept</Card.Title>
                        <HtmlDisplay
                          disableMargin
                          className="border-0 px-0 no-spacing-print"
                          value={template.final_statement}
                          title="Final Statement"
                          titleClass="mt-4"
                        />
                      </Card.Body>
                    </Card>
                  )}

                  <div className="page-break auto" />
                  <Card className="border-0 shadow-none border-bottom my-4">
                    <Card.Body className="px-0">
                      <Card.Title className="fw-bold">Signatures</Card.Title>
                      <Row className="gx-sm-4 gx-0 my-4">
                        <Col sm={8} md={5} xxl={4}>
                          <Signature
                            readOnly
                            useImage={false}
                            controlID="LeasePreviewFormOwner"
                            showSavedSignature={false}
                            labelText="Owner"
                          />
                        </Col>
                        <Col sm={8} md={5} xxl={4}>
                          <Signature
                            readOnly
                            useImage={false}
                            value={applicant_name}
                            controlID="LeasePreviewFormTenant"
                            showSavedSignature={false}
                            labelText="Tenant"
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            )}
          />
        </Fragment>
      )}
    />
  );
};
