import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { clsx } from 'clsx';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetTenantsAnnouncementsQuery } from 'services/api/tenants/announcements';

import { HScroll } from 'core-ui/h-scroll';
import { NewTabIcon } from 'core-ui/icons';
import { HtmlDisplay } from 'core-ui/render-information';

import { displayDate } from 'utils/functions';

import { ISingleAnnouncement } from 'interfaces/ICommunication';

function Announcements() {
  const tenantAnnouncements = useGetTenantsAnnouncementsQuery({ size: 10 });

  return (
    <div className="page-section p-4 min-h-100 overflow-auto">
      <ApiResponseWrapper
        {...tenantAnnouncements}
        showMiniError
        renderResults={data => {
          const announcements: Array<ISingleAnnouncement | string> = [...data.results];
          if (data.count > 12) {
            announcements.push('record-view-all');
          }

          return (
            <HScroll
              scrollWithWheel
              headerTitle="Announcements"
              arrowsPos={{ show: 'head', position: 'end' }}
              scrollContainerClassName="row gy-3 gx-lg-3 gx-md-1 gx-sm-3 gx-1 flex-nowrap"
              itemClassName={clsx({
                'col-12 col-xxl-6 col-lg-8 col-md-12 col-sm-8 col-12': announcements.length > 0,
                'col-12': announcements.length <= 0,
              })}
            >
              {announcements.length <= 0 ? (
                <Card className="my-2 border-0" style={{ minHeight: 'calc(100% - 1rem)' }}>
                  <Card.Body className="position-relative py-5">
                    <div className="d-flex flex-column gap-2 position-absolute top-50 start-50 translate-middle align-items-center justify-content-center">
                      No Record Found
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                announcements.map(item =>
                  typeof item === 'string' ? (
                    <Link key={item} to={`/tenant/announcements`}>
                      <Card className="my-2 item-hover" style={{ minHeight: 'calc(100% - 1rem)' }}>
                        <Card.Body className="position-relative border border-opacity-50 p-3">
                          <div className="d-flex flex-column gap-2 position-absolute top-50 start-50 translate-middle align-items-center justify-content-center">
                            <NewTabIcon width={32} height={32} />
                            View all
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  ) : (
                    <Card key={item.id} className="my-2 item-hover">
                      <Card.Body className="border border-opacity-50 p-0 d-flex">
                        <div className="d-flex align-items-center bg-dark bg-opacity-10 p-2">
                          <OverlayTrigger
                            overlay={tooltipProps => (
                              <Tooltip
                                {...tooltipProps}
                                arrowProps={{ style: { display: 'none' } }}
                                id={`announcement-date-tooltip`}
                              >
                                {displayDate(item.expiry_date)}
                              </Tooltip>
                            )}
                          >
                            <div className="p-2">
                              <p className="fw-bold m-0 lh-1">{displayDate(item.expiry_date, 'Do')}</p>
                              <p className="mb-1">{displayDate(item.expiry_date, 'MMM')}</p>
                            </div>
                          </OverlayTrigger>
                        </div>
                        <div className="flex-fill p-2">
                          <HtmlDisplay
                            value={item.body}
                            title={item.title}
                            disableMargin
                            className="p-0 border-0 small m-0"
                            disablePadding
                            style={{
                              height: 30,
                              overflow: 'hidden',
                              margin: 0,
                            }}
                            titleClass="fw-bold"
                          />
                          <Link
                            className="btn btn-link link-primary mx-1 px-1 btn-sm"
                            to={`/tenant/announcements/details/${item.id}`}
                          >
                            Learn More
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  )
                )
              )}
            </HScroll>
          );
        }}
      />
    </div>
  );
}

export default Announcements;
