import { Children, MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Form, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { Formik } from 'formik';

import useResponse from 'services/api/hooks/useResponse';
import { useUpdateLeaseTemplateMutation } from 'services/api/lease-templates';
import { BaseQueryError } from 'services/api/types/rtk-query';

import { CustomStepper } from 'components/custom-stepper';

import { CheckMarkIcon, NextIcon, PrevIcon } from 'core-ui/icons';
import { Notify } from 'core-ui/toast';

import { leaseTemplateSteps } from 'constants/steps';
import { populateDynamicField, renderFormError } from 'utils/functions';

import { ISingleLeaseTemplate } from 'interfaces/IApplications';

import {
  Step01Residence,
  Step02Policies,
  Step03Responsibilities,
  Step04General,
  Step05SignAccept,
} from 'pages/admin/leasing/components/lease-steps';

import formValidation from './form-validation';

interface IProps {
  lease_template: ISingleLeaseTemplate;
}

const LeaseSteps = ({ lease_template }: IProps) => {
  const { template: lease_id } = useParams();
  const [updateLeaseTemplate, { isError: isUpdateLeaseTemplateError, error: updateLeaseTemplateError }] =
    useUpdateLeaseTemplateMutation();

  useResponse({
    isError: isUpdateLeaseTemplateError,
    error: updateLeaseTemplateError,
  });

  const [validationSchema, setValidationSchema] = useState<unknown[]>([]);
  const [currentValidationSchema, setCurrentValidationSchema] = useState<unknown>();

  const [index, setIndex] = useState(1);

  const isLastStep = index === leaseTemplateSteps.length;

  const GetSteps = useMemo(() => {
    const steps: {
      [key: string]: JSX.Element;
    } = {
      residency_and_financial: <Step01Residence />,
      policies_and_procedures: <Step02Policies />,
      responsibilities: <Step03Responsibilities />,
      general: <Step04General />,
      sign_and_accept: <Step05SignAccept />,
    };

    const leaseSteps: JSX.Element[] = [];

    Object.keys(steps).forEach(
      key => leaseTemplateSteps.find(step => step.name === key) && leaseSteps.push(steps[key])
    );

    const validateSchema: unknown[] = [];
    Object.keys(formValidation).forEach(
      key =>
        leaseTemplateSteps.find(step => step.name === key) && validateSchema.push(formValidation[key as keyof unknown])
    );

    setValidationSchema(validateSchema);

    return Children.toArray(leaseSteps);
  }, []);

  const handleStepClick: MouseEventHandler<HTMLElement> = ev => {
    const dataKey = ev.currentTarget.dataset['step'];
    setIndex(Number(dataKey));
  };

  const prevButton = () => {
    setIndex(prev => prev - 1);
  };

  const nextButton = () => {
    if (!isLastStep) setIndex(prev => prev + 1);
  };

  useEffect(() => {
    setCurrentValidationSchema(validationSchema[index - 1]);
  }, [index, validationSchema]);

  return (
    <Card className="border-0">
      <Card.Body className="px-0 text-start">
        <Formik
          initialValues={{
            right_of_inspection: lease_template.right_of_inspection ?? false,
            conditions_of_moving_out: populateDynamicField('condition', lease_template.conditions_of_moving_out),
            condition_of_premises: populateDynamicField('condition', lease_template.condition_of_premises),
            releasing_policies: populateDynamicField('policy', lease_template.releasing_policies),
            rules_and_policies: populateDynamicField('rule', lease_template.rules_and_policies),
            final_statement: lease_template.final_statement ?? '',
          }}
          enableReinitialize
          validationSchema={currentValidationSchema}
          onSubmit={(values, { setSubmitting, setFieldError, setTouched }) => {
            if (lease_id && Number(lease_id) > 0) {
              const data: ISingleLeaseTemplate = {
                ...values,
                id: lease_id,
                name: lease_template.name,
                description: lease_template.description,
                conditions_of_moving_out: values.conditions_of_moving_out
                  .map(num => num['condition'])
                  .filter(f => f !== ''),
                condition_of_premises: values.condition_of_premises.map(num => num['condition']).filter(f => f !== ''),
                releasing_policies: values.releasing_policies.map(num => num['policy']).filter(f => f !== ''),
                rules_and_policies: values.rules_and_policies.map(num => num['rule']).filter(f => f !== ''),
              };

              updateLeaseTemplate(data)
                .then(result => {
                  if (result.data) {
                    if (isLastStep) {
                      Notify.show({
                        title: 'Changes Saved!',
                        type: 'success',
                      });
                    } else {
                      setIndex(prev => prev + 1);
                    }
                  } else {
                    const error = result.error as BaseQueryError;
                    if (error.status === 400 && error.data) {
                      renderFormError(error.data, setFieldError);
                    }
                  }
                })
                .finally(() => {
                  setTouched({});
                  setSubmitting(false);
                });
            }
          }}
        >
          {({ isSubmitting, handleSubmit, setTouched }) => (
            <Form className="text-start" noValidate onSubmit={handleSubmit}>
              <CustomStepper
                active={index}
                steps={leaseTemplateSteps}
                randomSteps
                nameAsLabel
                onStepClick={ev => {
                  if (!isSubmitting) {
                    handleStepClick(ev);
                    setTouched({});
                  }
                }}
                actions={
                  <LeaseTemplateButtons
                    prevButton={prevButton}
                    isSubmitting={isSubmitting}
                    nextButton={e => {
                      if (index === 1) {
                        e.preventDefault();
                        setTouched({});
                        nextButton();
                      }
                    }}
                    currentItem={index}
                    totalItems={leaseTemplateSteps.length}
                  />
                }
              >
                {GetSteps}
              </CustomStepper>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

interface IStepActions {
  prevButton?: MouseEventHandler<HTMLButtonElement>;
  nextButton?: MouseEventHandler<HTMLButtonElement>;
  isSubmitting?: boolean;
  currentItem: number;
  totalItems: number;
}

const LeaseTemplateButtons = ({ currentItem, isSubmitting, nextButton, prevButton, totalItems }: IStepActions) => {
  return (
    <Row className="gx-0 justify-content-end">
      {Number(currentItem) > 1 && (
        <Col xs={'auto'}>
          <OverlayTrigger
            overlay={tooltipProps => (
              <Tooltip {...tooltipProps} id={`tooltip-prev`}>
                Previous Step
              </Tooltip>
            )}
          >
            <Button
              size={'lg'}
              variant={'outline-light'}
              className="d-inline-flex align-items-center btn-next-prev mx-2 px-0"
              disabled={isSubmitting}
              onClick={prevButton}
            >
              <PrevIcon />
            </Button>
          </OverlayTrigger>
        </Col>
      )}
      <Col xs={'auto'}>
        <OverlayTrigger
          overlay={tooltipProps => (
            <Tooltip {...tooltipProps} id={`tooltip-next`}>
              {Number(currentItem) === Number(totalItems) ? 'Save Changes' : 'Next Step'}
            </Tooltip>
          )}
        >
          <Button
            size={'lg'}
            type={'submit'}
            variant={'outline-light'}
            className="d-inline-flex align-items-center btn-next-prev mx-2 px-0"
            onClick={nextButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : Number(currentItem) === Number(totalItems) ? (
              <CheckMarkIcon />
            ) : (
              <NextIcon />
            )}
          </Button>
        </OverlayTrigger>
      </Col>
    </Row>
  );
};

export default LeaseSteps;
