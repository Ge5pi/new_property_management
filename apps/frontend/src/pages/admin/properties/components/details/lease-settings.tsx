import { Fragment, MouseEventHandler, useCallback } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import { getSignedURL } from 'api/core';

import { FilePreview } from 'components/file-attachments';

import { EditBtn } from 'core-ui/edit-button';
import { RenderInformation } from 'core-ui/render-information';

import { PERMISSIONS } from 'constants/permissions';
import { rentalApplicationSteps } from 'constants/steps';

import { IRentalTemplate } from 'interfaces/IApplications';
import { IAttachments } from 'interfaces/IAttachments';

interface IProps {
  sectionName: string;
  template?: {
    title: string;
    description: string;
    files?: Array<IAttachments>;
    rental_application?: IRentalTemplate;
  };
  term?: string;
  parent_id?: number;
  chargeBy?: number;
  additionalFee?: string | number;
  onEdit?: MouseEventHandler<HTMLButtonElement> | undefined;
}

const LeaseSettings = ({
  sectionName = '',
  parent_id,
  template,
  term = '',
  chargeBy = 0,
  additionalFee = '',
  onEdit,
}: IProps) => {
  const handleAttachmentClick = useCallback((file: string, id?: number) => {
    if (file && id) {
      getSignedURL(file).then(response => {
        if (response.data && response.data.url) {
          window.open(response.data.url, '_blank');
        }
      });
    }
  }, []);

  return (
    <Card className="min-h-100">
      <Card.Header className="border-0 py-3 bg-transparent text-start">
        <p className="fw-bold m-0 text-primary">{sectionName}</p>
        <EditBtn className="position-absolute top-0 end-0 m-2" permission={PERMISSIONS.PROPERTY} onClick={onEdit} />
      </Card.Header>
      <Card.Body className="text-start">
        {template ? (
          <Fragment>
            <Card.Subtitle className="fw-medium text-primary">{template.title}</Card.Subtitle>
            <Card.Text>{template.description}</Card.Text>
            {template.files && template.files.length > 0 && (
              <Row className="gy-3 gx-1">
                {template.files?.map((item, inx) => (
                  <Col lg={6} key={inx}>
                    <FilePreview
                      name={item.name}
                      fileType={item.file_type}
                      onClick={() => handleAttachmentClick(item.file, parent_id)}
                    />
                  </Col>
                ))}
              </Row>
            )}
            {template.rental_application && (
              <div className="small">
                <div className="fw-medium text-opacity-50">
                  <span className="me-2">Steps include:</span>
                  {Object.keys(template.rental_application).flatMap(k =>
                    rentalApplicationSteps
                      .filter(
                        r =>
                          r.name === k &&
                          template.rental_application &&
                          template.rental_application[k as keyof IRentalTemplate]
                      )
                      .map(f => (
                        <span className="fw-bold mx-1" key={f.name}>
                          {f.label},
                        </span>
                      ))
                  )}
                </div>
              </div>
            )}
          </Fragment>
        ) : (
          <Row className="g-3">
            <Col lg={4} md={6}>
              <RenderInformation title="Term" description={term} />
            </Col>
            <Col lg={8} md={6}>
              <RenderInformation title="Charge by" desClass="price-symbol" description={chargeBy} />
            </Col>
            <Col xs={12}>
              <RenderInformation title="Additional Fee" desClass="price-symbol" description={additionalFee} />
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default LeaseSettings;
