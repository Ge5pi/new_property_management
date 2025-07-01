import { Fragment, useMemo } from 'react';
import { Badge, Button, Col, Container, Modal, Row, Stack } from 'react-bootstrap';

import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';
import { Avatar } from 'core-ui/user-avatar';

import { parseTime } from 'utils/functions';

import { CalendarFilterModule, ICalendarList } from 'interfaces/ICalendar';

import NewEvent from '../new-event/new-event';

import './view-event.styles.css';

interface IProps {
  event: ICalendarList;
}

const ViewEventModal = ({ event }: IProps) => {
  const assigned_to = useMemo(() => {
    if (event.assign_to_first_name && event.assign_to_last_name) {
      return `${event.assign_to_first_name} ${event.assign_to_last_name}`;
    }

    return event.assign_to_username ?? '*';
  }, [event]);

  const event_type_and_name = useMemo(() => {
    if (event.parent_property && event.parent_property_name) {
      return { event: 'Property', name: event.parent_property_name };
    }

    if (event.owner && event.owner_first_name && event.owner_last_name) {
      return { event: 'Owner', name: `${event.owner_first_name} ${event.owner_last_name}` };
    }

    if (event.tenant && event.tenant_first_name && event.tenant_last_name) {
      return { event: 'Tenant', name: `${event.tenant_first_name} ${event.tenant_last_name}` };
    }

    if (event.unit && event.unit_name) {
      return { event: 'Unit', name: event.unit_name };
    }

    return { event: '', name: '' };
  }, [event]);

  return (
    <Container fluid className="text-start">
      <Modal.Header className="mb-5">
        <div className="popup-title pe-5">
          <p className="mt-1">Event Details</p>
          <h3 className="text-capitalize">{event.title}</h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Row className="gx-3">
          <Col md={4} sm xs={12}>
            <RenderInformation desClass="m-0" title="Event type" description={event_type_and_name.event} />
          </Col>
          <Col sm xs={12}>
            <RenderInformation
              desClass="m-0"
              title={'Event For'}
              html={<span className="text-info">{event_type_and_name.name}</span>}
            />
          </Col>
        </Row>
        <div>
          <RenderInformation
            title="Assigned to"
            html={
              <Stack direction="horizontal">
                <Avatar name={assigned_to} size={30} showName={true} />
              </Stack>
            }
          />
        </div>

        <div className="bg-secondary p-4">
          <Row className="gx-3">
            <Col md={6} sm xs={12}>
              <RenderInformation title="Date" date={event.date} />
            </Col>
            {(event.start_time || event.end_time) && (
              <Col md={6} sm xs={12}>
                <RenderInformation
                  title="Timings"
                  html={
                    <div className="d-inline-flex align-items-center gap-2">
                      <span>{parseTime(event.start_time)}</span>
                      {event.end_time && (
                        <Fragment>
                          <span>-</span>
                          <span>{parseTime(event.end_time)}</span>
                        </Fragment>
                      )}
                    </div>
                  }
                />
              </Col>
            )}
          </Row>
          <RenderInformation desClass="m-0" title="Description" description={event.description} />
          {event.label && event.label_name && (
            <RenderInformation
              desClass="m-0"
              title="Label"
              html={
                <Badge pill bg="transparent" className="border border-primary border-opacity-50 text-muted border-1">
                  {event.label_name}
                </Badge>
              }
            />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="mt-2">
        <Button className="px-4 py-1 me-3" variant="light border-primary" onClick={() => SwalExtended.close()}>
          Cancel
        </Button>

        <Button
          variant="primary"
          className="px-4 py-1"
          onClick={() => {
            SweetAlert({
              size: 'lg',
              html: (
                <NewEvent
                  event={event}
                  eventFor={event_type_and_name.event.toUpperCase() as CalendarFilterModule}
                  update
                />
              ),
            }).fire({
              allowOutsideClick: () => !SwalExtended.isLoading(),
            });
          }}
        >
          Edit
        </Button>
      </Modal.Footer>
    </Container>
  );
};

export default ViewEventModal;
