import { MouseEventHandler, ReactNode } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

interface IGalleryWrapper {
  onUpload?: MouseEventHandler<HTMLButtonElement> | undefined;
  children: ReactNode;
}

const ImageGalleryWrapper = ({ onUpload, children }: IGalleryWrapper) => {
  return (
    <Row className="mt-1 gx-3 align-items-stretch">
      <Col xs={12}>
        <Card className="border-0">
          <Card.Header className="border-0 pt-3 bg-transparent text-start">
            <Row className="g-0 align-items-center flex-wrap">
              <Col>
                <p className="fw-bold m-0 text-primary">Image Gallery</p>
              </Col>
              <Col xs={'auto'}>
                <Button variant="link" size="sm" onClick={onUpload} className="ms-2 link-info">
                  Upload photos
                </Button>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="overflow-hidden text-start pt-0">{children}</Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ImageGalleryWrapper;
