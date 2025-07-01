import { Fragment } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';

import { ErrorMessage, Field, FieldArray, getIn, useFormikContext } from 'formik';

import useResponse from 'services/api/hooks/useResponse';
import { useDeleteFinancialInformationMutation } from 'services/api/rental-applications';

import { AddBtn } from 'core-ui/add-another';
import { DeleteBtn } from 'core-ui/delete-btn';

import { PERMISSIONS } from 'constants/permissions';

import { IRentalFormContactDetails } from 'interfaces/IApplications';

import formFields from './form-fields';

interface IProps {
  application_id: number | string;
  formLoading?: boolean;
}

const BankAccountsDetails = ({ application_id, formLoading }: IProps) => {
  const { values, touched, errors, isValid, isSubmitting, handleSubmit, dirty } =
    useFormikContext<IRentalFormContactDetails>();

  const { financial_information } = formFields.formField;

  const [deleteFinancialInfo, { isError: isDeleteFinancialInfoError, error: deleteFinancialInfoError }] =
    useDeleteFinancialInformationMutation();
  useResponse({
    isError: isDeleteFinancialInfoError,
    error: deleteFinancialInfoError,
  });

  const deleteFinancial = (id: number | string) => {
    if (application_id && Number(application_id) > 0) {
      deleteFinancialInfo({ id, rental_application: application_id });
    }
  };

  return (
    <div>
      <Card className="border-0 p-4 page-section mb-3">
        <Card.Header className="border-0 p-0 bg-transparent text-start">
          <div>
            <p className="fw-bold m-0 text-primary">Financial Information</p>
            <p className="small">Provide the financial details of the applicant</p>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          <FieldArray
            name={financial_information.name}
            render={arrayHelpers => (
              <div className="mb-5">
                <Fragment>
                  {values.financial_information &&
                    values.financial_information.map((_, index) => {
                      const bankNameFieldName = `financial_information[${index}].bank`;
                      const accountNameFieldName = `financial_information[${index}].name`;
                      const accountTypeFieldName = `financial_information[${index}].account_type`;
                      const accountNumberFieldName = `financial_information[${index}].account_number`;

                      return (
                        <Card key={index} className="py-4 px-3 mb-4 position-relative bg-secondary">
                          <Card.Body>
                            <Row className="gx-sm-4 gx-0">
                              <Col>
                                <Form.Group className="mb-4" controlId={bankNameFieldName}>
                                  <Form.Label className="form-label-md">Bank Name</Form.Label>
                                  <Field
                                    type="text"
                                    disabled={formLoading}
                                    name={bankNameFieldName}
                                    as={Form.Control}
                                    placeholder="Type here"
                                    isInvalid={!!getIn(errors, bankNameFieldName) && getIn(touched, bankNameFieldName)}
                                    isValid={getIn(touched, bankNameFieldName) && !getIn(errors, bankNameFieldName)}
                                  />
                                  <ErrorMessage
                                    className="text-danger"
                                    name={bankNameFieldName}
                                    component={Form.Text}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row className="gx-sm-4 gx-0">
                              <Col>
                                <Form.Group className="mb-4" controlId={accountNameFieldName}>
                                  <Form.Label className="form-label-md">Bank account name</Form.Label>
                                  <Field
                                    type="text"
                                    name={accountNameFieldName}
                                    disabled={formLoading}
                                    as={Form.Control}
                                    placeholder="Type here"
                                    isInvalid={
                                      !!getIn(errors, accountNameFieldName) && getIn(touched, accountNameFieldName)
                                    }
                                    isValid={
                                      getIn(touched, accountNameFieldName) && !getIn(errors, accountNameFieldName)
                                    }
                                  />
                                  <ErrorMessage
                                    className="text-danger"
                                    name={accountNameFieldName}
                                    component={Form.Text}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row className="gx-sm-4 gx-0">
                              <Col lg={4} md={6}>
                                <Form.Group className="mb-4" controlId={accountTypeFieldName}>
                                  <Form.Label className="form-label-md">Bank account type</Form.Label>
                                  <Field
                                    type="text"
                                    name={accountTypeFieldName}
                                    disabled={formLoading}
                                    as={Form.Control}
                                    placeholder="Type here"
                                    isInvalid={
                                      !!getIn(errors, accountTypeFieldName) && getIn(touched, accountTypeFieldName)
                                    }
                                    isValid={
                                      getIn(touched, accountTypeFieldName) && !getIn(errors, accountTypeFieldName)
                                    }
                                  />
                                  <ErrorMessage
                                    className="text-danger"
                                    name={accountTypeFieldName}
                                    component={Form.Text}
                                  />
                                </Form.Group>
                              </Col>
                              <Col lg={4} md={6}>
                                <Form.Group className="mb-4" controlId={accountNumberFieldName}>
                                  <Form.Label className="form-label-md">Bank account number</Form.Label>
                                  <Field
                                    type="number"
                                    name={accountNumberFieldName}
                                    disabled={formLoading}
                                    as={Form.Control}
                                    placeholder="Type here"
                                    isInvalid={
                                      !!getIn(errors, accountNumberFieldName) && getIn(touched, accountNumberFieldName)
                                    }
                                    isValid={
                                      getIn(touched, accountNumberFieldName) && !getIn(errors, accountNumberFieldName)
                                    }
                                  />
                                  <ErrorMessage
                                    className="text-danger"
                                    name={accountNumberFieldName}
                                    component={Form.Text}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            {index > 0 && (
                              <DeleteBtn
                                disabled={formLoading}
                                permission={PERMISSIONS.PEOPLE}
                                onClick={() => {
                                  _.id && deleteFinancial(_.id);
                                  arrayHelpers.remove(index);
                                }}
                              />
                            )}
                          </Card.Body>
                        </Card>
                      );
                    })}
                </Fragment>
                <AddBtn
                  permission={PERMISSIONS.PEOPLE}
                  disabled={!isValid || isSubmitting || formLoading}
                  loading={isSubmitting}
                  onClick={() => {
                    if (isValid && dirty) {
                      handleSubmit();
                    }
                    if (!isSubmitting) {
                      arrayHelpers.push({
                        [financial_information.bank.name]: '',
                        [financial_information.account_name.name]: '',
                        [financial_information.account_type.name]: '',
                        [financial_information.account_number.name]: '',
                      });
                    }
                  }}
                >
                  {dirty && isValid ? 'Save Changes' : 'Add Another'}
                </AddBtn>
              </div>
            )}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default BankAccountsDetails;
