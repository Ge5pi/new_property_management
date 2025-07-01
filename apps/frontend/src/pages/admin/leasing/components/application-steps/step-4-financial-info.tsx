import { Fragment } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ErrorMessage, Field, FieldArray, getIn, useFormikContext } from 'formik';

import useResponse from 'services/api/hooks/useResponse';
import {
  useDeleteAdditionalIncomeMutation,
  useDeleteFinancialInformationMutation,
} from 'services/api/rental-applications';

import { AddBtn } from 'core-ui/add-another';
import { CustomSelect } from 'core-ui/custom-select';
import { DeleteBtn } from 'core-ui/delete-btn';
import { GroupedField } from 'core-ui/grouped-field';
import { InputPhone } from 'core-ui/input-phone';

import { PERMISSIONS } from 'constants/permissions';

import { IRentalFormContactDetails } from 'interfaces/IApplications';

import formFields from './form-fields';

import countries from 'data/countries.json';

interface IProps {
  isDisabled?: boolean;
  financeLoading?: boolean;
  incomeLoading?: boolean;
}

const Step04Financial = ({ isDisabled = false, financeLoading, incomeLoading }: IProps) => {
  const { values, touched, errors, handleBlur, handleChange, setFieldValue, setFieldTouched } =
    useFormikContext<IRentalFormContactDetails>();

  const {
    employer_name,
    employer_phone_number,
    employer_address,
    employment_country,
    employment_city,
    employment_zip_code,
    monthly_salary,
    position_held,
    years_worked,
    supervisor_name,
    supervisor_title,
    supervisor_email,
    financial_information,
    additional_income,
  } = formFields.formField;

  const { application: application_id } = useParams();
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

  const [deleteAdditionalInfo, { isError: isDeleteAdditionalInfoError, error: deleteAdditionalInfoError }] =
    useDeleteAdditionalIncomeMutation();
  useResponse({
    isError: isDeleteAdditionalInfoError,
    error: deleteAdditionalInfoError,
  });

  const deleteAdditional = (id: number | string) => {
    if (application_id && Number(application_id) > 0) {
      deleteAdditionalInfo({ id, rental_application: application_id });
    }
  };

  return (
    <div>
      <p className="fw-bold m-0 text-primary">Financial Information</p>
      <p className="small">Provide the financial details of the applicant</p>
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
                                disabled={isDisabled || financeLoading || incomeLoading}
                                name={bankNameFieldName}
                                as={Form.Control}
                                placeholder="Type here"
                                isInvalid={!!getIn(errors, bankNameFieldName) && getIn(touched, bankNameFieldName)}
                                isValid={getIn(touched, bankNameFieldName) && !getIn(errors, bankNameFieldName)}
                              />
                              <ErrorMessage className="text-danger" name={bankNameFieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="gx-sm-4 gx-0">
                          <Col>
                            <Form.Group className="mb-4" controlId={accountNameFieldName}>
                              <Form.Label className="form-label-md">Bank account name</Form.Label>
                              <Field
                                type="text"
                                disabled={isDisabled || financeLoading || incomeLoading}
                                name={accountNameFieldName}
                                as={Form.Control}
                                placeholder="Type here"
                                isInvalid={
                                  !!getIn(errors, accountNameFieldName) && getIn(touched, accountNameFieldName)
                                }
                                isValid={getIn(touched, accountNameFieldName) && !getIn(errors, accountNameFieldName)}
                              />
                              <ErrorMessage className="text-danger" name={accountNameFieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="gx-sm-4 gx-0">
                          <Col lg={4} md={6}>
                            <Form.Group className="mb-4" controlId={accountTypeFieldName}>
                              <Form.Label className="form-label-md">Bank account type</Form.Label>
                              <Field
                                type="text"
                                disabled={isDisabled || financeLoading || incomeLoading}
                                name={accountTypeFieldName}
                                as={Form.Control}
                                placeholder="Type here"
                                isInvalid={
                                  !!getIn(errors, accountTypeFieldName) && getIn(touched, accountTypeFieldName)
                                }
                                isValid={getIn(touched, accountTypeFieldName) && !getIn(errors, accountTypeFieldName)}
                              />
                              <ErrorMessage className="text-danger" name={accountTypeFieldName} component={Form.Text} />
                            </Form.Group>
                          </Col>
                          <Col lg={4} md={6}>
                            <Form.Group className="mb-4" controlId={accountNumberFieldName}>
                              <Form.Label className="form-label-md">Bank account number</Form.Label>
                              <Field
                                type="number"
                                disabled={isDisabled || financeLoading || incomeLoading}
                                name={accountNumberFieldName}
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
                            disabled={isDisabled || financeLoading || incomeLoading}
                            permission={PERMISSIONS.LEASING}
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
            {!isDisabled && (
              <AddBtn
                disabled={isDisabled || financeLoading || incomeLoading}
                permission={PERMISSIONS.LEASING}
                onClick={() => {
                  arrayHelpers.push({
                    [financial_information.bank.name]: '',
                    [financial_information.account_name.name]: '',
                    [financial_information.account_type.name]: '',
                    [financial_information.account_number.name]: '',
                  });
                }}
              />
            )}
          </div>
        )}
      />

      <p className="fw-bold m-0 text-primary">Income</p>
      <p className="small">Provide the income information</p>

      <Row className="gx-sm-4 gx-0">
        <Col lg={4} md={6}>
          <Form.Group className="mb-4" controlId="EmployerFormEmployeeName">
            <Form.Label className="form-label-md">Employer name</Form.Label>
            <Field
              disabled={isDisabled}
              name={employer_name.name}
              type="text"
              as={Form.Control}
              placeholder="Type Here..."
              isValid={touched.employer_name && !errors.employer_name}
              isInvalid={touched.employer_name && !!errors.employer_name}
            />
            <ErrorMessage className="text-danger" name={employer_name.name} component={Form.Text} />
          </Form.Group>
        </Col>
        <Col lg={4} md={6}>
          <Form.Group className="mb-4" controlId="EmployerFormEmployeePhone">
            <Form.Label className="form-label-md">Employer phone number</Form.Label>
            <InputPhone
              onBlur={handleBlur}
              disabled={isDisabled}
              name={employer_phone_number.name}
              value={values.employer_phone_number}
              onPhoneNumberChange={phone => setFieldValue(employer_phone_number.name, phone)}
              isValid={touched.employer_phone_number && !errors.employer_phone_number}
              isInvalid={touched.employer_phone_number && !!errors.employer_phone_number}
            />
            <ErrorMessage className="text-danger" name={employer_phone_number.name} component={Form.Text} />
          </Form.Group>
        </Col>
      </Row>
      <Row className="gx-sm-4 gx-0">
        <Col xs={12}>
          <Form.Group className="mb-4" controlId="EmployerFormEmployeeAddress">
            <Form.Label className="form-label-md">Employer address</Form.Label>
            <Field
              disabled={isDisabled}
              name={employer_address.name}
              type="text"
              as={Form.Control}
              placeholder="Type Here..."
              isValid={touched.employer_address && !errors.employer_address}
              isInvalid={touched.employer_address && !!errors.employer_address}
            />
            <ErrorMessage className="text-danger" name={employer_address.name} component={Form.Text} />
          </Form.Group>
        </Col>
      </Row>
      <Row className="gx-sm-4 gx-0">
        <Col md={6} lg={4}>
          <CustomSelect
            disabled={isDisabled}
            labelText={'Country'}
            onSelectChange={value => setFieldValue(employment_country.name, value)}
            onBlurChange={() => {
              setFieldTouched(employment_country.name, true);
            }}
            name={employment_country.name}
            controlId="RentalFinancialFormCountry"
            value={values.employment_country}
            options={countries}
            searchable
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-4',
            }}
            isValid={touched.employment_country && !errors.employment_country}
            isInvalid={touched.employment_country && !!errors.employment_country}
            error={errors.employment_country}
          />
        </Col>
        <Col md={6} lg={4}>
          <Form.Group className="mb-4" controlId="EmployerFormEmployeeCity">
            <Form.Label className="form-label-md">City</Form.Label>
            <Field
              disabled={isDisabled}
              name={employment_city.name}
              type="text"
              as={Form.Control}
              placeholder="Type Here..."
              isValid={touched.employment_city && !errors.employment_city}
              isInvalid={touched.employment_city && !!errors.employment_city}
            />
            <ErrorMessage className="text-danger" name={employment_city.name} component={Form.Text} />
          </Form.Group>
        </Col>
        <Col md={6} lg={4}>
          <Form.Group className="mb-4" controlId="EmployerFormEmployeeZip">
            <Form.Label className="form-label-md">Zip</Form.Label>
            <Field
              disabled={isDisabled}
              name={employment_zip_code.name}
              type="text"
              as={Form.Control}
              placeholder="Type Here..."
              isValid={touched.employment_zip_code && !errors.employment_zip_code}
              isInvalid={touched.employment_zip_code && !!errors.employment_zip_code}
            />
            <ErrorMessage className="text-danger" name={employment_zip_code.name} component={Form.Text} />
          </Form.Group>
        </Col>
      </Row>

      <Row className="gx-sm-4 gx-0">
        <Col lg={3} md={6} xs={12}>
          <GroupedField
            type="number"
            controlId="RentalHistoryFormMonthlySalary"
            wrapperClass="mb-4"
            labelClass="form-label-md"
            icon={'S'}
            position="end"
            label="Monthly Salary"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.monthly_salary}
            disabled={isDisabled}
            name={monthly_salary.name}
            placeholder="0.00"
            isValid={touched.monthly_salary && !errors.monthly_salary}
            isInvalid={touched.monthly_salary && !!errors.monthly_salary}
            error={<ErrorMessage className="text-danger" name={monthly_salary.name} component={Form.Text} />}
          />
        </Col>
        <Col lg={3} md={6} xs={12}>
          <Form.Group className="mb-4" controlId="EmployerFormHeld">
            <Form.Label className="form-label-md">Position held</Form.Label>
            <Field
              type="text"
              disabled={isDisabled}
              name={position_held.name}
              as={Form.Control}
              placeholder="Type Here..."
              isValid={touched.position_held && !errors.position_held}
              isInvalid={touched.position_held && !!errors.position_held}
            />
            <ErrorMessage className="text-danger" name={position_held.name} component={Form.Text} />
          </Form.Group>
        </Col>
      </Row>

      <Row className="gx-sm-4 gx-0">
        <Col lg={2} md={3} xs={12}>
          <Form.Group className="mb-4" controlId="EmployerFormYearsWorked">
            <Form.Label className="form-label-md">Years worked</Form.Label>
            <Field
              type="number"
              disabled={isDisabled}
              name={years_worked.name}
              as={Form.Control}
              placeholder="Type Here..."
              isValid={touched.years_worked && !errors.years_worked}
              isInvalid={touched.years_worked && !!errors.years_worked}
            />
            <ErrorMessage className="text-danger" name={years_worked.name} component={Form.Text} />
          </Form.Group>
        </Col>
      </Row>
      <Row className="gx-sm-4 gx-0">
        <Col lg={4} md={6} xs={12}>
          <Form.Group className="mb-4" controlId="EmployerFormSupervisorName">
            <Form.Label className="form-label-md">Supervisor name</Form.Label>
            <Field
              type="text"
              disabled={isDisabled}
              name={supervisor_name.name}
              as={Form.Control}
              placeholder="Type Here..."
              isValid={touched.supervisor_name && !errors.supervisor_name}
              isInvalid={touched.supervisor_name && !!errors.supervisor_name}
            />
            <ErrorMessage className="text-danger" name={supervisor_name.name} component={Form.Text} />
          </Form.Group>
        </Col>
        <Col lg={4} md={6} xs={12}>
          <Form.Group className="mb-4" controlId="EmployerFormSupervisorTitle">
            <Form.Label className="form-label-md">Supervisor title</Form.Label>
            <Field
              type="text"
              disabled={isDisabled}
              name={supervisor_title.name}
              as={Form.Control}
              placeholder="Type Here..."
              isValid={touched.supervisor_title && !errors.supervisor_title}
              isInvalid={touched.supervisor_title && !!errors.supervisor_title}
            />
            <ErrorMessage className="text-danger" name={supervisor_title.name} component={Form.Text} />
          </Form.Group>
        </Col>
        <Col lg={4} md={6} xs={12}>
          <Form.Group className="mb-4" controlId="EmployerFormSupervisorEmail">
            <Form.Label className="form-label-md">Supervisor email</Form.Label>
            <Field
              type="email"
              disabled={isDisabled}
              name={supervisor_email.name}
              as={Form.Control}
              placeholder="johndoe@example.com"
              isValid={touched.supervisor_email && !errors.supervisor_email}
              isInvalid={touched.supervisor_email && !!errors.supervisor_email}
            />
            <ErrorMessage className="text-danger" name={supervisor_email.name} component={Form.Text} />
          </Form.Group>
        </Col>
      </Row>

      <p className="fw-bold m-0 text-primary">Additional Income</p>
      <p className="small">Provide any additional income information if available</p>

      <FieldArray
        name={additional_income.name}
        render={arrayHelpers => (
          <div className="mb-5">
            <Fragment>
              {values.additional_income &&
                values.additional_income.map((_, index) => {
                  const monthlyIncomeFieldName = `additional_income[${index}].monthly_income`;
                  const incomeSourceFieldName = `additional_income[${index}].source_of_income`;

                  return (
                    <Card key={index} className="py-4 px-3 mb-4 position-relative bg-secondary">
                      <Card.Body>
                        <Row className="gx-sm-4 gx-0">
                          <Col lg={4} sm={6}>
                            <GroupedField
                              type="number"
                              controlId={monthlyIncomeFieldName}
                              wrapperClass="mb-4"
                              labelClass="form-label-md"
                              icon={'S'}
                              position="end"
                              label="Monthly Income"
                              disabled={isDisabled || financeLoading || incomeLoading}
                              name={monthlyIncomeFieldName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={_.monthly_income}
                              placeholder="0.00"
                              isInvalid={
                                !!getIn(errors, monthlyIncomeFieldName) && getIn(touched, monthlyIncomeFieldName)
                              }
                              isValid={getIn(touched, monthlyIncomeFieldName) && !getIn(errors, monthlyIncomeFieldName)}
                              error={
                                <ErrorMessage
                                  className="text-danger"
                                  name={monthlyIncomeFieldName}
                                  component={Form.Text}
                                />
                              }
                            />
                          </Col>
                          <Col lg={4} sm={6}>
                            <Form.Group className="mb-4" controlId={incomeSourceFieldName}>
                              <Form.Label className="form-label-md">Source of income</Form.Label>
                              <Field
                                type="text"
                                disabled={isDisabled || financeLoading || incomeLoading}
                                name={incomeSourceFieldName}
                                as={Form.Control}
                                placeholder="Type Here..."
                                isInvalid={
                                  !!getIn(errors, incomeSourceFieldName) && getIn(touched, incomeSourceFieldName)
                                }
                                isValid={getIn(touched, incomeSourceFieldName) && !getIn(errors, incomeSourceFieldName)}
                              />
                              <ErrorMessage
                                className="text-danger"
                                name={incomeSourceFieldName}
                                component={Form.Text}
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        {index > 0 && (
                          <DeleteBtn
                            disabled={isDisabled || financeLoading || incomeLoading}
                            permission={PERMISSIONS.LEASING}
                            onClick={() => {
                              _.id && deleteAdditional(_.id);
                              arrayHelpers.remove(index);
                            }}
                          />
                        )}
                      </Card.Body>
                    </Card>
                  );
                })}
            </Fragment>
            {!isDisabled && (
              <AddBtn
                disabled={isDisabled || financeLoading || incomeLoading}
                permission={PERMISSIONS.LEASING}
                onClick={() => {
                  arrayHelpers.push({
                    [additional_income.monthly_income.name]: '',
                    [additional_income.source_of_income.name]: '',
                  });
                }}
              />
            )}
          </div>
        )}
      />
    </div>
  );
};

export default Step04Financial;
