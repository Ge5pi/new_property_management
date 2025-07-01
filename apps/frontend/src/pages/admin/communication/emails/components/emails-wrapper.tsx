import { MouseEventHandler, ReactNode } from 'react';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { SearchInput } from 'components/search-input';

import { ExportIcon } from 'core-ui/icons';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

interface IProps {
  handleCreateNewRecord?: MouseEventHandler<HTMLButtonElement> | undefined;
  children: ReactNode;
  createNewButtonTitle?: string;
}

const EmailsWrapper = ({ children, handleCreateNewRecord, createNewButtonTitle }: IProps) => {
  const [width] = useWindowSize();

  const { modifyCurrentPath } = useRedirect();
  const path = modifyCurrentPath('/emails', 'emails');

  return (
    <div>
      <div className="my-3">
        <Row className="gx-2 gy-4">
          <Col className="order-sm-0 order-1">
            <ButtonGroup size={width <= 700 ? 'sm' : undefined} className={'flex-wrap'}>
              <NavLink
                id={`radio-types-categories`}
                className={'btn btn-primary fw-bold primary-tab px-4'}
                to={path}
                replace={true}
                end
              >
                Email
              </NavLink>
              <NavLink
                id={`radio-general`}
                className={'btn btn-primary fw-bold primary-tab px-4'}
                to={`${path}/template`}
                end
              >
                Template
              </NavLink>
            </ButtonGroup>
          </Col>
          <Col lg={'auto'} sm xs={12}>
            <Row className="gx-2 gy-1">
              <Col>
                <Button
                  variant={'outline-primary'}
                  size="sm"
                  className="btn-search-adjacent-sm"
                  onClick={handleCreateNewRecord}
                >
                  <ExportIcon /> <span className="ms-2">Export</span>
                </Button>
              </Col>
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
                    {createNewButtonTitle ?? 'Create new'}
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

export default EmailsWrapper;
