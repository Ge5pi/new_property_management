import { Fragment } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

import { ErrorMessage, Field, FieldArray, FieldArrayRenderProps, FormikValues, getIn, useFormikContext } from 'formik';

import { AddBtn } from 'core-ui/add-another';
import { DeleteBtn } from 'core-ui/delete-btn';
import InputWithTextPreview from 'core-ui/input-text-preview/input-text-preview';

import { PERMISSIONS } from 'constants/permissions';
import { hasEmptyKey } from 'utils/functions';

import { ILeaseTemplateWithObjects } from 'interfaces/IApplications';

import formFields from './form-fields';

const Step03Responsibilities = ({ isDisabled }: { isDisabled?: boolean }) => {
  const { values, touched, errors, setFieldValue, setFieldTouched } = useFormikContext<ILeaseTemplateWithObjects>();

  const { condition_of_premises, conditions_of_moving_out, right_of_inspection } = formFields.formField;

  const addNewRow = (
    arrayHelpers: FieldArrayRenderProps,
    fieldName: string,
    keyName: keyof ILeaseTemplateWithObjects,
    key: keyof FormikValues
  ) => {
    if (getIn(errors, fieldName)) {
      if (keyName in errors) {
        setFieldTouched(fieldName, true);
      }
      return;
    }

    arrayHelpers.push({ [key]: '' });
  };

  const focusElement = (fieldName: string) => {
    const timer = setTimeout(() => {
      const nextElem = document.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement;
      if (nextElem) nextElem.focus();
      clearTimeout(timer);
    }, 0);
  };

  return (
    <div>
      <p className="fw-bold m-0 text-primary">Conditions of premises and alternations</p>
      <p className="small">Conditions based on which changes can be done</p>

      <FieldArray
        name={condition_of_premises.name}
        render={arrayHelpers => (
          <div>
            <Fragment>
              {values.condition_of_premises &&
                values.condition_of_premises.map((_, index) => {
                  const fieldName = `condition_of_premises[${index}].condition`;

                  return (
                    <Row key={index} className="gx-sm-4 gx-0">
                      <Col sm={8} md={5} xxl={4}>
                        <Form.Group className="mb-4" controlId={fieldName}>
                          <Row className="g-1 align-items-baseline">
                            <Col xs={'auto'}>
                              <Form.Label className="form-label-md mb-0">{`${index + 1}.`}</Form.Label>
                            </Col>
                            <Col sm={10} xs>
                              <InputWithTextPreview
                                fieldName={fieldName}
                                value={_.condition}
                                field={
                                  <Field
                                    type="text"
                                    name={fieldName}
                                    disabled={isDisabled}
                                    as={Form.Control}
                                    placeholder="Type here"
                                    isInvalid={!!getIn(errors, fieldName) && getIn(touched, fieldName)}
                                    isValid={getIn(touched, fieldName) && !getIn(errors, fieldName)}
                                    onKeyDown={(e: KeyboardEvent) => {
                                      if (e.key === 'Enter') {
                                        e.stopPropagation();
                                        e.preventDefault();

                                        const inx = values.condition_of_premises
                                          ? values.condition_of_premises.length
                                          : 0;
                                        if (_.condition && !hasEmptyKey(values.condition_of_premises)) {
                                          addNewRow(
                                            arrayHelpers,
                                            fieldName,
                                            'condition_of_premises',
                                            condition_of_premises.condition.name
                                          );
                                          focusElement(`condition_of_premises[${inx}].condition`);
                                          return;
                                        }
                                        focusElement(`condition_of_premises[${inx - 1}].condition`);
                                      }
                                    }}
                                  />
                                }
                              />
                              <ErrorMessage className="text-danger" name={fieldName} component={Form.Text} />
                            </Col>

                            {index > 0 && (
                              <Col xs={'auto'} className="py-1">
                                <DeleteBtn
                                  permission={PERMISSIONS.LEASING}
                                  disabled={isDisabled}
                                  onClick={() => arrayHelpers.remove(index)}
                                />
                              </Col>
                            )}
                          </Row>
                        </Form.Group>
                      </Col>
                    </Row>
                  );
                })}
            </Fragment>
            <AddBtn
              permission={PERMISSIONS.LEASING}
              disabled={isDisabled}
              onClick={() => {
                const inx = values.condition_of_premises ? values.condition_of_premises.length - 1 : 0;
                const fieldName = `condition_of_premises[${inx}].condition`;
                addNewRow(arrayHelpers, fieldName, 'condition_of_premises', condition_of_premises.condition.name);

                if (getIn(errors, fieldName)) {
                  focusElement(fieldName);
                  return;
                }
                focusElement(`condition_of_premises[${inx + 1}].condition`);
              }}
            />
          </div>
        )}
      />

      <Row className="gx-0 my-5">
        <Col xs={12}>
          <Form.Label className="form-label-md">Right of Inspection</Form.Label>
        </Col>
        <Form.Group as={Col} xs={'auto'} controlId="InspectionLeaseTemplateFormY">
          <Form.Check
            type="radio"
            label="Yes"
            className="small text-primary"
            value="yes"
            checked={values.right_of_inspection === true}
            name={right_of_inspection.name}
            onChange={() => setFieldValue(right_of_inspection.name, true)}
            onBlur={() => setFieldTouched(right_of_inspection.name)}
            isInvalid={touched.right_of_inspection && !!errors.right_of_inspection}
          />
        </Form.Group>
        <Form.Group as={Col} xs="auto" className="ms-4" controlId="InspectionLeaseTemplateFormN">
          <Form.Check
            type={'radio'}
            label="No"
            value="no"
            checked={values.right_of_inspection === false}
            className="small text-primary"
            name={right_of_inspection.name}
            onChange={() => setFieldValue(right_of_inspection.name, false)}
            onBlur={() => setFieldTouched(right_of_inspection.name)}
            isInvalid={touched.right_of_inspection && !!errors.right_of_inspection}
          />
        </Form.Group>
      </Row>

      <p className="fw-bold m-0 text-primary">Conditions of moving out</p>
      <p className="small">Under what circumstances moving out is applicable</p>

      <FieldArray
        name={conditions_of_moving_out.name}
        render={arrayHelpers => (
          <div>
            <Fragment>
              {values.conditions_of_moving_out &&
                values.conditions_of_moving_out.map((_, index) => {
                  const fieldName = `conditions_of_moving_out[${index}].condition`;

                  return (
                    <Row key={index} className="gx-sm-4 gx-0">
                      <Col sm={8} md={5} xxl={4}>
                        <Form.Group className="mb-4" controlId={fieldName}>
                          <Row className="g-1 align-items-baseline">
                            <Col xs={'auto'}>
                              <Form.Label className="form-label-md mb-0">{`${index + 1}.`}</Form.Label>
                            </Col>
                            <Col sm={10} xs>
                              <InputWithTextPreview
                                fieldName={fieldName}
                                value={_.condition}
                                field={
                                  <Field
                                    type="text"
                                    name={fieldName}
                                    as={Form.Control}
                                    placeholder="Type here"
                                    isInvalid={!!getIn(errors, fieldName) && getIn(touched, fieldName)}
                                    isValid={getIn(touched, fieldName) && !getIn(errors, fieldName)}
                                    onKeyDown={(e: KeyboardEvent) => {
                                      if (e.key === 'Enter') {
                                        e.stopPropagation();
                                        e.preventDefault();

                                        const inx = values.conditions_of_moving_out
                                          ? values.conditions_of_moving_out.length
                                          : 0;
                                        if (_.condition && !hasEmptyKey(values.conditions_of_moving_out)) {
                                          addNewRow(
                                            arrayHelpers,
                                            fieldName,
                                            'conditions_of_moving_out',
                                            conditions_of_moving_out.condition.name
                                          );
                                          focusElement(`conditions_of_moving_out[${inx}].condition`);
                                          return;
                                        }
                                        focusElement(`conditions_of_moving_out[${inx - 1}].condition`);
                                      }
                                    }}
                                  />
                                }
                              />
                              <ErrorMessage className="text-danger" name={fieldName} component={Form.Text} />
                            </Col>

                            {index > 0 && (
                              <Col xs={'auto'} className="py-1">
                                <DeleteBtn
                                  permission={PERMISSIONS.LEASING}
                                  onClick={() => arrayHelpers.remove(index)}
                                />
                              </Col>
                            )}
                          </Row>
                        </Form.Group>
                      </Col>
                    </Row>
                  );
                })}
            </Fragment>
            <AddBtn
              permission={PERMISSIONS.LEASING}
              onClick={() => {
                const inx = values.conditions_of_moving_out ? values.conditions_of_moving_out.length - 1 : 0;
                const fieldName = `conditions_of_moving_out[${inx}].condition`;
                addNewRow(arrayHelpers, fieldName, 'conditions_of_moving_out', conditions_of_moving_out.condition.name);

                if (getIn(errors, fieldName)) {
                  focusElement(fieldName);
                  return;
                }
                focusElement(`conditions_of_moving_out[${inx + 1}].condition`);
              }}
            />
          </div>
        )}
      />
    </div>
  );
};

export default Step03Responsibilities;
