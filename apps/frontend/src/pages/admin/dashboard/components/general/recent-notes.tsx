import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetNotesQuery } from 'services/api/notes';

import { HScroll } from 'core-ui/h-scroll';
import { NewTabIcon } from 'core-ui/icons';

import { ISingleNote } from 'interfaces/ICommunication';

function RecentNotes() {
  const recentNotes = useGetNotesQuery({ size: 10 });

  return (
    <div className="page-section p-4 overflow-auto">
      <ApiResponseWrapper
        {...recentNotes}
        showMiniError
        renderResults={data => {
          const notes: Array<ISingleNote | string> = [...data.results];
          if (data.count > 12) {
            notes.push('record-view-all');
          }

          return (
            <HScroll
              headerTitle="Recent Notes"
              arrowsPos={{ show: 'head', position: 'end' }}
              scrollContainerClassName="row gy-3 gx-sm-3 gx-0 align-items-stretch flex-nowrap"
              itemClassName="col-lg-5 col-md-7 col-sm col-12"
            >
              {notes.map(item =>
                typeof item === 'string' ? (
                  <Link key={item} to={`/admin/communication/notes`}>
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
                  <Card key={item.id} className="my-2 item-hover" style={{ minHeight: 'calc(100% - 1rem)' }}>
                    <Card.Body className="border border-opacity-50 p-3">
                      <p className="fw-medium mb-0">{item.title}</p>
                      <p className="text-gray">{item.associated_property_name}</p>
                      <p
                        className="fw-medium mb-0"
                        style={{
                          height: 50,
                          overflow: 'hidden',
                          margin: 0,
                        }}
                      >
                        {item.description}
                      </p>
                      <Link
                        className="btn btn-link link-primary px-1 btn-sm"
                        to={`/admin/communication/notes/details/${item.id}`}
                      >
                        Learn More
                      </Link>
                    </Card.Body>
                  </Card>
                )
              )}
            </HScroll>
          );
        }}
      />
    </div>
  );
}

export default RecentNotes;
