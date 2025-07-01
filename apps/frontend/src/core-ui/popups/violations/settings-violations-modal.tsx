import { Col, Form, Row } from 'react-bootstrap';

import { Popup } from 'components/popup';

import { CustomSelect } from 'core-ui/custom-select';

const SettingsViolationsModal = () => {
  return (
    <Popup title={'Add New Violation Stage'} subtitle={'Fill in the information to add a new stage'}>
      <Row className="gx-md-4 g-sm-3 gx-0 align-items-center">
        <Form.Group as={Col} xs={12} className="mb-3" controlId="SettingsViolationsFormName">
          <Form.Label className="popup-form-labels">Stage Name</Form.Label>
          <Form.Control autoFocus type="text" placeholder="Enter Stage Name" />
        </Form.Group>

        <Col xs={12} className="mb-3">
          <Row className="g-1">
            <Col sm={4}>
              <CustomSelect
                name="stage_number"
                labelText="Stage Number"
                controlId={`SettingsViolationsFormStageNumber`}
                options={[
                  { label: '1', value: 1 },
                  { label: '2', value: 2 },
                  { label: '3', value: 3 },
                  { label: '4', value: 4 },
                ]}
                classNames={{
                  labelClass: 'popup-form-labels',
                  wrapperClass: 'mb-3',
                }}
              />
            </Col>
            <Col>
              <CustomSelect
                name="template"
                labelText="Template"
                controlId={`SettingsViolationsFormTemplate`}
                placeholder={`Select`}
                options={[]}
                classNames={{
                  labelClass: 'popup-form-labels',
                  wrapperClass: 'mb-3',
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Popup>
  );
};

export default SettingsViolationsModal;
