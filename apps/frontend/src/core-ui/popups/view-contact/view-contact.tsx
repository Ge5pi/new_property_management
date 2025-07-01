import { Button, Col, Row } from 'react-bootstrap';

import { Popup } from 'components/popup';

import { RenderInformation } from 'core-ui/render-information';

import { ISingleContact } from 'interfaces/ICommunication';

function ViewContact({ contact }: { contact: ISingleContact }) {
  const handleViewOnMapClick = () => {
    if (contact.street_address) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.street_address)}`,
        '_blank'
      );
    }
  };

  return (
    <Popup title="Contact details" openForPreview subtitle="reach out to this contact incase of any help needed">
      <div className="mx-4">
        <RenderInformation title="Name" description={contact.name} />
        <RenderInformation title="Category" description={contact.category_name} />

        <Row className="gx-sm-1 gx-0">
          <Col md={4}>
            <RenderInformation title="Primary Contact" phone={contact.primary_contact} />
          </Col>
          <Col md={4}>
            <RenderInformation title="Secondary contact" phone={contact.secondary_contact} />
          </Col>
        </Row>
        <RenderInformation title="Email" email={contact.email} />
        <RenderInformation title="Website" link={contact.website} />
        <RenderInformation title="Street address" description={contact.street_address} />

        <Button variant="outline-primary" onClick={handleViewOnMapClick} className="px-3">
          View on map
        </Button>
      </div>
    </Popup>
  );
}

export default ViewContact;
