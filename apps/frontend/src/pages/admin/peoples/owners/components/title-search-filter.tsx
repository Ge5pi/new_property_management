import { MouseEventHandler } from 'react';
import { Button, Col, Row } from 'react-bootstrap';

import { SearchInput } from 'components/search-input';

interface IProps {
  routeName: string;
  handleCreateNewRecord?: MouseEventHandler<HTMLButtonElement> | undefined;
}

const TitleSearchFilter = ({ routeName, handleCreateNewRecord }: IProps) => {
  return (
    <div className="component-margin-y">
      <Row className="gx-2 gy-4">
        <Col className="order-sm-0 order-1">
          <h1 className="fw-bold h4 text-capitalize">{routeName}</h1>
        </Col>
        <Col lg={'auto'} sm xs={12}>
          <Row className="gx-2 gy-1">
            <Col>
              <Row className="gx-2 gy-1">
                <Col>
                  <SearchInput size="sm" />
                </Col>
                {handleCreateNewRecord && (
                  <Col xs={'auto'}>
                    <Button
                      variant={'primary'}
                      size="sm"
                      className="btn-search-adjacent-sm"
                      onClick={handleCreateNewRecord}
                    >
                      Create Owner
                    </Button>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default TitleSearchFilter;
