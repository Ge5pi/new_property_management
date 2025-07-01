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

const Step02Policies = ({ isDisabled }: { isDisabled?: boolean }) => {
  const { values, touched, setFieldTouched, errors } = useFormikContext<ILeaseTemplateWithObjects>();
  const { rules_and_policies } = formFields.formField;

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
      <p className="fw-bold m-0 text-primary">Rules & Policies</p>
      <p className="small">Defines set of rules for the properties</p>

      <FieldArray
        name={rules_and_policies.name}
        render={arrayHelpers => (
          <div>
            <Fragment>
              {values.rules_and_policies &&
                values.rules_and_policies.map((_, index) => {
                  const fieldName = `rules_and_policies[${index}].rule`;
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
                                value={_.rule}
                                field={
                                  <Field
                                    type="text"
                                    disabled={isDisabled}
                                    name={fieldName}
                                    as={Form.Control}
                                    placeholder="Type here"
                                    isInvalid={!!getIn(errors, fieldName) && getIn(touched, fieldName)}
                                    isValid={getIn(touched, fieldName) && !getIn(errors, fieldName)}
                                    onKeyDown={(e: KeyboardEvent) => {
                                      if (e.key === 'Enter') {
                                        e.stopPropagation();
                                        e.preventDefault();

                                        const inx = values.rules_and_policies ? values.rules_and_policies.length : 0;
                                        if (_.rule && !hasEmptyKey(values.rules_and_policies)) {
                                          addNewRow(
                                            arrayHelpers,
                                            fieldName,
                                            'rules_and_policies',
                                            rules_and_policies.rule.name
                                          );

                                          focusElement(`rules_and_policies[${inx}].rule`);
                                          return;
                                        }
                                        focusElement(`rules_and_policies[${inx - 1}].rule`);
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
              disabled={isDisabled}
              permission={PERMISSIONS.LEASING}
              onClick={() => {
                const inx = values.rules_and_policies ? values.rules_and_policies.length - 1 : 0;
                const fieldName = `rules_and_policies[${inx}].rule`;
                addNewRow(arrayHelpers, fieldName, 'rules_and_policies', rules_and_policies.rule.name);

                if (getIn(errors, fieldName)) {
                  focusElement(fieldName);
                  return;
                }
                focusElement(`rules_and_policies[${inx + 1}].rule`);
              }}
            />
          </div>
        )}
      />
    </div>
  );
};

export default Step02Policies;
