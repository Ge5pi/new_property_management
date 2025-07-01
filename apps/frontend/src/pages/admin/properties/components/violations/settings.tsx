import { MouseEventHandler } from 'react';
import { Button, Card, Col, Row, Stack } from 'react-bootstrap';

import { clsx } from 'clsx';

import { TrashIcon } from 'core-ui/icons';
import { SettingsCategoryModal, SettingsViolationsModal } from 'core-ui/popups/violations';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

const Settings = () => {
  const handleCategoryCreate = () => {
    SweetAlert({
      html: <SettingsCategoryModal />,
    }).fire({
      allowOutsideClick: () => !SwalExtended.isLoading(),
    });
  };

  const handleStagesCreate = () => {
    SweetAlert({
      html: <SettingsViolationsModal />,
    }).fire({
      allowOutsideClick: () => !SwalExtended.isLoading(),
    });
  };

  return (
    <div className="container-fluid px-xl-4 page-section py-4">
      <Row className="align-items-center gx-3 gy-4">
        <Col>
          <p className="fw-bold fs-6">Violation Settings</p>
        </Col>
      </Row>

      <Row className="g-3 align-items-stretch">
        <Col lg={6}>
          <Card className="shadow-none">
            <Card.Header className="section-off-white">
              <Stack gap={2} className="justify-content-between" direction="horizontal">
                <div>
                  <Card.Title className="fw-bold fs-6 m-0">Categories</Card.Title>
                  <Card.Text className="small text-primary">Add or update the violation categories</Card.Text>
                </div>
                <Button variant={'primary'} size="sm" className="btn-search-adjacent-sm" onClick={handleCategoryCreate}>
                  Add New
                </Button>
              </Stack>
            </Card.Header>
            <Card.Body className="settings-violations">
              <SettingsItem title="Demo category Name" description="Type : 03" onClick={handleCategoryCreate} />
              <SettingsItem title="Demo category Name" description="Type : 01" onClick={handleCategoryCreate} />
              <SettingsItem title="Demo category Name" description="Type : 05" onClick={handleCategoryCreate} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="shadow-none">
            <Card.Header className="section-off-white">
              <Stack gap={2} className="justify-content-between" direction="horizontal">
                <div>
                  <Card.Title className="fw-bold fs-6 m-0">Stages</Card.Title>
                  <Card.Text className="small text-primary">
                    Bellow is the list of violation stages incase {"there's"} any
                  </Card.Text>
                </div>
                <Button variant={'primary'} size="sm" className="btn-search-adjacent-sm" onClick={handleStagesCreate}>
                  Add New
                </Button>
              </Stack>
            </Card.Header>
            <Card.Body className="settings-violations">
              <SettingsItem
                title="Demo category Name"
                stage={1}
                description="Template here"
                onClick={handleStagesCreate}
              />
              <SettingsItem
                title="Demo category Name"
                stage={2}
                description="Template here"
                onClick={handleStagesCreate}
              />
              <SettingsItem
                title="Demo category Name"
                stage={3}
                description="Template here"
                onClick={handleStagesCreate}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

interface ISettingsItem {
  title: string;
  description: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  stage?: number;
}

const SettingsItem = ({ title = '', description = '', stage = -1, onClick }: ISettingsItem) => {
  return (
    <Card className="single-section-item my-3" onClick={onClick}>
      <Card.Body>
        <Row className="gx-0 align-items-center justify-content-between single-info-item">
          <Col sm={'auto'} xs={12}>
            <Card.Title className="small fw-bold mb-1">{title}</Card.Title>
            <Card.Subtitle
              className={clsx('mt-1 small mb-1', { 'text-primary': stage > 0 }, { 'text-muted': stage <= 0 })}
            >
              <Stack direction="horizontal" gap={1}>
                {stage && stage > 0 && (
                  <>
                    <span>Stage No. {stage}</span>
                    <div className="vr" />
                  </>
                )}
                {description}
              </Stack>
            </Card.Subtitle>
          </Col>
          <Col xs={'auto'} className="single-info-item-wrap">
            <Button variant="transparent" className="p-1 bg-transparent" onClick={e => e.stopPropagation()} size={'sm'}>
              <TrashIcon />
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Settings;
