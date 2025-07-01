import { Col, Form, InputGroup, Row } from 'react-bootstrap';

import { GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { CustomSelect } from 'core-ui/custom-select';

import { ISingleProperty } from 'interfaces/IProperties';

interface IProps {
  id: string | number;
  property?: ISingleProperty;
  updatePropertyDetails?: GenericMutationTrigger<Partial<ISingleProperty>, ISingleProperty>;
}

const PropertyInformationModal = ({ id, property, updatePropertyDetails }: IProps) => {
  console.log('Still Needs to Complete: ', id, property, updatePropertyDetails);

  return (
    <Popup title={'Property Information'} subtitle={'Update property information'}>
      <Row className="gy-md-0 gy-3 gx-md-2 gx-sm-2 gx-0">
        <Col md={8} sm={6}>
          <Form.Group className="mx-sm-0 mx-0 mb-4" controlId="PropertyInformationFormDescription">
            <Form.Label className="popup-form-labels">Description</Form.Label>
            <Form.Control type="text" placeholder="Enter description here" />
          </Form.Group>
        </Col>
        <Col md={4} sm={6}>
          <CustomSelect
            name="portfolio"
            labelText="Portfolio"
            controlId={`PropertyInformationFormPortfolio`}
            placeholder={`Choose Portfolio`}
            options={[]}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mx-sm-0 mx-0 mb-4',
            }}
          />
        </Col>
      </Row>
      <Row className="gy-md-0 gy-3 gx-md-2 gx-sm-2 gx-0">
        <Col md={8} sm={6}>
          <CustomSelect
            name="tax_authority"
            labelText="Tax Authority"
            controlId={`PropertyInformationFormTaxAuthority`}
            placeholder={`Choose Tax Authority`}
            options={[]}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mx-sm-0 mx-0 mb-4',
            }}
          />
        </Col>
        <Col md={4} sm={6}>
          <Form.Group className="mx-sm-0 mx-0 mb-4" controlId="PropertyInformationFormTaxLocationCode">
            <Form.Label className="popup-form-labels">Renters Tax location code</Form.Label>
            <Form.Control type="number" min={0} placeholder="001502" />
          </Form.Group>
        </Col>
      </Row>
      <Row className="gy-md-0 gy-3 gx-md-2 gx-sm-2 gx-0">
        <Col md={5} sm={5}>
          <Form.Group className="mx-sm-0 mx-0 mb-4" controlId="PropertyInformationFormOwnerLicense">
            <Form.Label className="popup-form-labels">Owner License</Form.Label>
            <Form.Control type="text" placeholder="Enter Owner License number" />
          </Form.Group>
        </Col>
        <Col md={3} sm={3}>
          <Form.Group className="mx-sm-0 mx-0 mb-4" controlId="PropertyInformationFormYearBuilt">
            <Form.Label className="popup-form-labels">Year Build</Form.Label>
            <Form.Control type="number" min={0} placeholder="1989" />
          </Form.Group>
        </Col>
        <Col md={4} sm={4}>
          <CustomSelect
            name="class"
            labelText="Class"
            controlId={`PropertyInformationFormClass`}
            placeholder={`Choose Class`}
            options={[]}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mx-sm-0 mx-0 mb-4',
            }}
          />
        </Col>
      </Row>
      <Row className="gy-md-0 gy-3 gx-md-2 gx-sm-2 gx-0">
        <Col xl={3} lg={4} sm={6}>
          <Form.Group className="mx-sm-0 mx-0 mb-4" controlId="PropertyInformationFormStartDate">
            <Form.Label className="popup-form-labels">Management start date</Form.Label>
            <Form.Control type="date" defaultValue={new Date().toISOString().substring(0, 10)} />
          </Form.Group>
        </Col>
        <Col xl={3} lg={4} sm={6}>
          <Form.Group className="mx-sm-0 mx-0 mb-4" controlId="PropertyInformationFormEndDate">
            <Form.Label className="popup-form-labels">Management end date</Form.Label>
            <Form.Control type="date" defaultValue={new Date().toISOString().substring(0, 10)} />
          </Form.Group>
        </Col>
        <Col xl={6} lg={4} sm={6}>
          <CustomSelect
            name="management_end_reason"
            labelText="Management end reason"
            controlId={`PropertyInformationFormManagementEndReason`}
            options={[
              { label: 'Owner sold', value: 'Owner sold' },
              { label: 'Management company terminated', value: 'Management company terminated' },
              { label: 'Management company concerns', value: 'Management company concerns' },
              { label: 'Maintenance', value: 'Maintenance' },
              { label: 'Owner moved in', value: 'Owner moved in' },
              { label: 'Other', value: 'Other' },
            ]}
            defaultValue={'Owner sold'}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mx-sm-0 mx-0 mb-4',
            }}
          />
        </Col>
        <Col xl={3} lg={4} sm={6}>
          <Form.Group className="mx-sm-0 mx-0 mb-4" controlId="PropertyInformationFormNSFFee">
            <Form.Label className="popup-form-labels">NSF Fee</Form.Label>
            <InputGroup className="input-with-icon position-relative mb-3">
              <Form.Control min="0" type="number" step={0.01} placeholder="0.00" />
              <InputGroup.Text className="position-absolute end-0 bg-transparent border-0 top-50 translate-middle-y">
                $
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
    </Popup>
  );
};

export default PropertyInformationModal;
