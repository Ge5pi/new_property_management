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

const Step04General = ({ isDisabled }: { isDisabled?: boolean }) => {
  const { values, touched, errors, setFieldTouched } = useFormikContext<ILeaseTemplateWithObjects>();
  const { releasing_policies } = formFields.formField;

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
      <p className="fw-bold m-0 text-primary">Releasing Policies</p>
      <p className="small">Some common releasing policies</p>

      <FieldArray
        name={releasing_policies.name}
        render={arrayHelpers => (
          <div>
            <Fragment>
              {values.releasing_policies &&
                values.releasing_policies.map((_, index) => {
                  const fieldName = `releasing_policies[${index}].policy`;

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
                                value={_.policy}
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
                                        const inx = values.releasing_policies ? values.releasing_policies.length : 0;
                                        if (_.policy && !hasEmptyKey(values.releasing_policies)) {
                                          addNewRow(
                                            arrayHelpers,
                                            fieldName,
                                            'releasing_policies',
                                            releasing_policies.policy.name
                                          );

                                          focusElement(`releasing_policies[${inx}].policy`);
                                          return;
                                        }
                                        focusElement(`releasing_policies[${inx - 1}].policy`);
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
                const inx = values.releasing_policies ? values.releasing_policies.length - 1 : 0;
                const fieldName = `releasing_policies[${inx}].policy`;
                addNewRow(arrayHelpers, fieldName, 'releasing_policies', releasing_policies.policy.name);

                if (getIn(errors, fieldName)) {
                  focusElement(fieldName);
                  return;
                }
                focusElement(`releasing_policies[${inx + 1}].policy`);
              }}
            />
          </div>
        )}
      />
    </div>
  );
};

export default Step04General;
