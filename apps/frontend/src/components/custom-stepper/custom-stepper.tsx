import { Children, Fragment, MouseEventHandler, ReactNode } from 'react';
import { Collapse } from 'react-bootstrap';

import { clsx } from 'clsx';

import { StepClearIcon } from 'core-ui/icons';

import { useWindowSize } from 'hooks/useWindowSize';

import './custom-stepper.styles.css';

interface IProps {
  steps: Array<string> | Array<{ label: string; key?: string }>;
  active: number;
  actions?: ReactNode;
  onStepClick?: MouseEventHandler<HTMLElement>;
  className?: string;
  randomSteps?: boolean;
  nameAsLabel?: boolean;
  flipStepNumber?: boolean;
  children?: ReactNode;
}

const CustomStepper = ({
  steps,
  active,
  children,
  actions,
  className,
  randomSteps,
  nameAsLabel,
  onStepClick,
  flipStepNumber,
}: IProps) => {
  const arrayChildren = Children.toArray(children);

  const [width] = useWindowSize();

  const handleStepClick: MouseEventHandler<HTMLElement> = ev => {
    const dataKey = ev.currentTarget.dataset['step'];
    if (dataKey && Number(dataKey) > 0 && onStepClick) {
      if (dataKey.toString() !== active.toString()) {
        onStepClick(ev);
      }
    }
  };

  return steps.length > 0 ? (
    <div>
      <ul className={clsx('CustomStepper-stepper', className)}>
        {steps.map((step, indx) => (
          <li
            className={clsx('CustomStepper-stepper__step', { 'stepper-active': indx + 1 === active })}
            key={indx}
            data-step={indx + 1}
            onClick={handleStepClick}
          >
            <div className="CustomStepper-label small">
              <div
                className={clsx(
                  { 'sticky-top bg-white': width <= 991.98 },
                  { 'cursor-pointer': onStepClick && indx + 1 !== active }
                )}
                style={{ zIndex: 1022 }}
              >
                <div className={clsx('CustomStepper-stepper__step__index', { 'mb-3': nameAsLabel })}>
                  {!randomSteps ? (
                    <Fragment>
                      {nameAsLabel ? (
                        <Fragment>
                          {active !== -1 && indx + 1 < active ? (
                            <div
                              className={clsx(
                                { 'flex-row-reverse': flipStepNumber },
                                'd-inline-flex align-items-center'
                              )}
                            >
                              <span className="text-truncate CustomStepper-stepper__step__label">
                                {typeof step === 'string' ? step : step.label}
                              </span>
                              <StepClearIcon />
                            </div>
                          ) : (
                            <div
                              className={clsx(
                                { 'flex-row-reverse': flipStepNumber },
                                'd-inline-flex align-items-center'
                              )}
                            >
                              <span className="text-truncate CustomStepper-stepper__step__label">
                                {typeof step === 'string' ? step : step.label}
                              </span>
                              <span className="CustomStepper-stepper__step__index_digit">{indx + 1}</span>
                            </div>
                          )}
                        </Fragment>
                      ) : (
                        <Fragment>
                          {active !== -1 && indx + 1 < active ? (
                            <div
                              className={clsx(
                                { 'flex-row-reverse': flipStepNumber },
                                'd-inline-flex align-items-center'
                              )}
                            >
                              Steps <StepClearIcon />
                            </div>
                          ) : (
                            <div
                              className={clsx(
                                { 'flex-row-reverse': flipStepNumber },
                                'd-inline-flex align-items-center'
                              )}
                            >
                              Steps <span className="CustomStepper-stepper__step__index_digit">{indx + 1}</span>
                            </div>
                          )}
                        </Fragment>
                      )}
                    </Fragment>
                  ) : (
                    <Fragment>
                      {nameAsLabel ? (
                        <div
                          className={clsx({ 'flex-row-reverse': flipStepNumber }, 'd-inline-flex align-items-center')}
                        >
                          <span className="CustomStepper-stepper__step__index_digit">{indx + 1}</span>
                          <span className="text-truncate CustomStepper-stepper__step__label">
                            {typeof step === 'string' ? step : step.label}
                          </span>
                        </div>
                      ) : (
                        <div
                          className={clsx({ 'flex-row-reverse': flipStepNumber }, 'd-inline-flex align-items-center')}
                        >
                          Steps <span className="CustomStepper-stepper__step__index_digit">{indx + 1}</span>
                        </div>
                      )}
                    </Fragment>
                  )}
                </div>
                {!nameAsLabel && (
                  <p className="text-truncate CustomStepper-stepper__step__label">
                    {typeof step === 'string' ? step : step.label}
                  </p>
                )}
              </div>
              {width < 991.98 && (
                <div>
                  <Collapse in={indx + 1 === active}>
                    <div className="CustomStepperItem px-0" id={`CustomStepperItem_Index_${indx}`}>
                      {arrayChildren[indx]}
                    </div>
                  </Collapse>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <hr />
      {width >= 991.98 &&
        Children.map(arrayChildren, (child, index) => {
          return (
            <Collapse key={index} in={index + 1 === active}>
              <div className="CustomStepperItem" id={`CustomStepperItem_Index_${index}`}>
                {child}
              </div>
            </Collapse>
          );
        })}

      {actions && steps.length > 0 && (
        <div
          className="CustomStepper-stepper_actions_buttons sticky-bottom bg-white mt-2 py-2"
          style={{ zIndex: 1023 }}
        >
          {actions}
        </div>
      )}
    </div>
  ) : (
    <div className="text-danger">
      <p className="text-center">Something went wrong... Form unable to initialized, No or Invalid Steps found!</p>
    </div>
  );
};

export default CustomStepper;
