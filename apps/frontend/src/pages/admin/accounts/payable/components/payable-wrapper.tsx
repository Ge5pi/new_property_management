import { MouseEventHandler, ReactNode } from 'react';
import { Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import FilterMenu from 'components/filter-menu/filter-menu';
import { SearchInput } from 'components/search-input';

import { CustomSelect, FilterInput } from 'core-ui/custom-select';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

interface IProps {
  handleCreateNewRecord?: MouseEventHandler<HTMLButtonElement> | undefined;
  children: ReactNode;
  createNewButtonTitle?: string;
}

const PayableWrapper = ({ children, handleCreateNewRecord, createNewButtonTitle }: IProps) => {
  const [width] = useWindowSize();

  const { modifyCurrentPath } = useRedirect();
  const path = modifyCurrentPath('/payable', 'payable');

  return (
    <div className="component-margin-y">
      <div className="my-3">
        <Row className="gx-2 gy-4">
          <Col className="order-sm-0 order-1">
            <ButtonGroup size={width <= 700 ? 'sm' : undefined} className={'flex-wrap'}>
              <NavLink
                id={`radio-receipts`}
                className={'btn btn-primary fw-bold primary-tab px-4'}
                to={path}
                replace={true}
                end
              >
                Bills
              </NavLink>
              <NavLink
                id={`radio-charges`}
                className={'btn btn-primary fw-bold primary-tab px-4'}
                to={`${path}/recurring`}
                end
              >
                Recurring
              </NavLink>
            </ButtonGroup>
          </Col>
          <Col lg={'auto'} sm xs={12}>
            <Row className="gx-2 gy-1">
              <Col xs={'auto'}>
                <FilterMenu>
                  <Row className="gx-sm-4 gx-0">
                    <Col lg={7}>
                      <label className="form-label-sm mb-2">Bill Status</label>
                      <Row className="gx-0">
                        <Col>
                          <Row className="gx-0">
                            <Form.Group as={Col} lg={'auto'} controlId="payableFilterFormAll">
                              <Form.Check
                                type="radio"
                                label="Active"
                                defaultChecked
                                className="small text-primary"
                                name="status"
                              />
                            </Form.Group>
                            <Form.Group as={Col} lg={'auto'} controlId="payableFilterFormClosed" className="ms-lg-4">
                              <Form.Check
                                type="radio"
                                label="Inactive"
                                defaultChecked
                                className="small text-primary"
                                name="status"
                              />
                            </Form.Group>
                            <Form.Group as={Col} lg={'auto'} controlId="payableFilterFormRenewals" className="ms-lg-4">
                              <Form.Check
                                type="radio"
                                label="All"
                                defaultChecked
                                className="small text-primary"
                                name="status"
                              />
                            </Form.Group>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={5}>
                      <CustomSelect
                        labelText="Payment type"
                        controlId="payableFilterFormPaymentType"
                        options={[]}
                        classNames={{
                          labelClass: 'form-label-sm',
                          wrapperClass: 'mx-sm-0 mx-1 mb-4',
                        }}
                        name="unit"
                      />
                    </Col>
                  </Row>
                  <Row className="gx-sm-4 gx-0">
                    <Col lg={7}>
                      <CustomSelect
                        labelText="Property"
                        controlId="payableFilterFormProperty"
                        options={[]}
                        classNames={{
                          labelClass: 'form-label-sm',
                          wrapperClass: 'mx-sm-0 mx-1 mb-4',
                        }}
                        name="property"
                      />
                    </Col>
                    <Col lg={5}>
                      <CustomSelect
                        labelText="Unit"
                        controlId="payableFilterFormUnit"
                        options={[]}
                        classNames={{
                          labelClass: 'form-label-sm',
                          wrapperClass: 'mx-sm-0 mx-1 mb-4',
                        }}
                        name="unit"
                      />
                    </Col>
                  </Row>
                  <Row className="gx-sm-4 gx-0">
                    <Col lg={7}>
                      <FilterInput
                        name="payer"
                        labelText="Payer"
                        controlId="payableFilterFormPayer"
                        placeholder="Select Payer"
                        options={[]}
                        classNames={{
                          labelClass: 'form-label-md',
                          wrapperClass: 'mb-4',
                        }}
                        labelKey="payer"
                        onSearch={function (): void {
                          throw new Error('Function not implemented.');
                        }}
                      />
                    </Col>
                    <Col lg={5}>
                      <CustomSelect
                        labelText="Gl Account"
                        controlId="payableFilterFormGLAccount"
                        options={[]}
                        classNames={{
                          labelClass: 'form-label-sm',
                          wrapperClass: 'mx-sm-0 mx-1 mb-4',
                        }}
                        name="unit"
                      />
                    </Col>
                  </Row>
                  <Row className="gx-sm-4 gx-0">
                    <Col lg={5}>
                      <Form.Group className="mb-3" controlId="ReceivableFormFromDate">
                        <Form.Label className="popup-form-labels">From date</Form.Label>
                        <Form.Control type="date" />
                      </Form.Group>
                    </Col>
                    <Col lg={5}>
                      <Form.Group className="mb-3" controlId="ReceivableFormToDate">
                        <Form.Label className="popup-form-labels">To date</Form.Label>
                        <Form.Control type="date" />
                      </Form.Group>
                    </Col>
                  </Row>
                </FilterMenu>
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

export default PayableWrapper;
