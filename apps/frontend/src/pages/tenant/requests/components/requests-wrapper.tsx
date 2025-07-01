import { ReactNode } from 'react';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { SearchInput } from 'components/search-input';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

interface IProps {
  children: ReactNode;
  handleCreateNewRecord: () => void;
}

const RequestsWrapper = ({ children, handleCreateNewRecord }: IProps) => {
  const [width] = useWindowSize();
  const { modifyCurrentPath } = useRedirect();

  const path = modifyCurrentPath('/requests', 'requests');

  return (
    <div className="component-margin-y">
      <div className="my-3">
        <Row className="gx-2 gy-4">
          <Col className="order-md-0 order-1">
            <ButtonGroup size={width <= 700 ? 'sm' : undefined} className={'flex-wrap'}>
              <NavLink
                id={`radio-requests`}
                className={'btn btn-primary fw-bold primary-tab px-4'}
                to={`${path}/open`}
                replace={true}
                end
              >
                Open
              </NavLink>
              <NavLink
                id={`radio-requests`}
                className={'btn btn-primary fw-bold primary-tab px-4'}
                to={`${path}/closed`}
                end
              >
                Closed
              </NavLink>
            </ButtonGroup>
          </Col>
          <Col lg={'auto'} md xs={12}>
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
                    Create new
                  </Button>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </div>
      {children}
    </div>
  );
};

export default RequestsWrapper;
