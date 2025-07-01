import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

import { Popup } from 'components/popup';
import { TagsInput } from 'components/tags-input';

import { GeneralTags } from 'interfaces/ISettings';

const SettingsCategoryModal = () => {
  const [tags, setTags] = useState<Array<GeneralTags>>([]);

  const handleTags = (data: Array<GeneralTags>) => {
    setTags(prev => [...prev, ...data]);
  };

  return (
    <Popup title={'Add new violation category'} subtitle={'Add new category incase required'}>
      <Row className="gx-md-4 g-sm-3 gx-0 align-items-center">
        <Form.Group as={Col} xs={12} className="mb-3" controlId="SettingsCategoryFormTitle">
          <Form.Label className="popup-form-labels">Category Title</Form.Label>
          <Form.Control autoFocus type="text" placeholder="Enter Category Title" />
        </Form.Group>

        <Col xs={12} className="mb-3">
          <TagsInput
            name="tags"
            tags={tags}
            onCreate={handleTags}
            label={'Violation types'}
            controlID={'SettingsCategoryFormType'}
          />
        </Col>
      </Row>
    </Popup>
  );
};

export default SettingsCategoryModal;
