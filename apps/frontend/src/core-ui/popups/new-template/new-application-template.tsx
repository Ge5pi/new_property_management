import { Col, Form, Row } from 'react-bootstrap';

import { getIn, useFormik } from 'formik';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { SwalExtended } from 'core-ui/sweet-alert';

import { rentalApplicationSteps } from 'constants/steps';
import { renderFormError } from 'utils/functions';

import { IRentalTemplate } from 'interfaces/IApplications';

interface IProps {
  update?: boolean;
  template?: IRentalTemplate;
  createTemplate?: GenericMutationTrigger<IRentalTemplate, IRentalTemplate>;
  updateTemplate?: GenericMutationTrigger<Partial<IRentalTemplate>, IRentalTemplate>;
}

const TemplateSchema = Yup.object().shape({
  name: Yup.string().trim().required('This field is required!'),
  description: Yup.string().trim().min(5),
  steps: Yup.object().shape(
    {
      general_info: Yup.boolean().when(
        ['personal_details', 'rental_history', 'financial_info', 'dependents_info', 'other_info'],
        {
          is: (
            personal_details: boolean,
            rental_history: boolean,
            financial_info: boolean,
            dependents_info: boolean,
            other_info: boolean
          ) => personal_details || rental_history || financial_info || dependents_info || other_info,
          then: schema => schema.notRequired(),
          otherwise: schema => schema.oneOf([true], 'At least one needs to be checked'),
        }
      ),
      personal_details: Yup.boolean().when(
        ['general_info', 'rental_history', 'financial_info', 'dependents_info', 'other_info'],
        {
          is: (
            general_info: boolean,
            rental_history: boolean,
            financial_info: boolean,
            dependents_info: boolean,
            other_info: boolean
          ) => general_info || rental_history || financial_info || dependents_info || other_info,
          then: schema => schema.notRequired(),
          otherwise: schema => schema.oneOf([true], 'At least one needs to be checked'),
        }
      ),
      rental_history: Yup.boolean().when(
        ['personal_details', 'general_info', 'financial_info', 'dependents_info', 'other_info'],
        {
          is: (
            personal_details: boolean,
            general_info: boolean,
            financial_info: boolean,
            dependents_info: boolean,
            other_info: boolean
          ) => personal_details || general_info || financial_info || dependents_info || other_info,
          then: schema => schema.notRequired(),
          otherwise: schema => schema.oneOf([true], 'At least one needs to be checked'),
        }
      ),
      financial_info: Yup.boolean().when(
        ['personal_details', 'rental_history', 'general_info', 'dependents_info', 'other_info'],
        {
          is: (
            personal_details: boolean,
            rental_history: boolean,
            general_info: boolean,
            dependents_info: boolean,
            other_info: boolean
          ) => personal_details || rental_history || general_info || dependents_info || other_info,
          then: schema => schema.notRequired(),
          otherwise: schema => schema.oneOf([true], 'At least one needs to be checked'),
        }
      ),
      dependents: Yup.boolean().when(
        ['personal_details', 'rental_history', 'financial_info', 'general_info', 'other_info'],
        {
          is: (
            personal_details: boolean,
            rental_history: boolean,
            financial_info: boolean,
            general_info: boolean,
            other_info: boolean
          ) => personal_details || rental_history || financial_info || general_info || other_info,
          then: schema => schema.notRequired(),
          otherwise: schema => schema.oneOf([true], 'At least one needs to be checked'),
        }
      ),
      other_info: Yup.boolean().when(
        ['personal_details', 'rental_history', 'financial_info', 'dependents_info', 'general_info'],
        {
          is: (
            personal_details: boolean,
            rental_history: boolean,
            financial_info: boolean,
            dependents_info: boolean,
            general_info: boolean
          ) => personal_details || rental_history || financial_info || dependents_info || general_info,
          then: schema => schema.notRequired(),
          otherwise: schema => schema.oneOf([true], 'At least one needs to be checked'),
        }
      ),
    },
    [
      ['general_info', 'personal_details'],
      ['general_info', 'rental_history'],
      ['general_info', 'financial_info'],
      ['general_info', 'dependents_info'],
      ['general_info', 'other_info'],

      ['personal_details', 'rental_history'],
      ['personal_details', 'financial_info'],
      ['personal_details', 'dependents_info'],
      ['personal_details', 'other_info'],

      ['rental_history', 'financial_info'],
      ['rental_history', 'dependents_info'],
      ['rental_history', 'other_info'],

      ['financial_info', 'dependents_info'],
      ['financial_info', 'other_info'],

      ['dependents_info', 'other_info'],
    ]
  ),
});

declare type StepsType = {
  general_info: boolean;
  personal_details: boolean;
  rental_history: boolean;
  financial_info: boolean;
  dependents_info: boolean;
  other_info: boolean;
};

const NewApplicationTemplateModal = ({ template, update = false, createTemplate, updateTemplate }: IProps) => {
  const formik = useFormik({
    initialValues: {
      name: template?.name ?? '',
      description: template?.description ?? '',
      steps: {
        general_info: template?.general_info ?? false,
        personal_details: template?.personal_details ?? false,
        rental_history: template?.rental_history ?? false,
        financial_info: template?.financial_info ?? false,
        dependents_info: template?.dependents_info ?? false,
        other_info: template?.other_info ?? false,
      } as StepsType,
    },
    validationSchema: TemplateSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      const data = {
        ...values,
        ...values.steps,
      };

      if (update && template && Number(template.id) > 0) {
        updateTemplate &&
          updateTemplate({ ...data, id: template.id })
            .then(result => {
              if (result.data) {
                SwalExtended.close();
              } else {
                const error = result.error as BaseQueryError;
                if (error.status === 400 && error.data) {
                  renderFormError(error.data, setFieldError);
                }
              }
            })
            .finally(() => {
              setSubmitting(false);
              SwalExtended.hideLoading();
            });
      } else {
        createTemplate &&
          createTemplate(data)
            .then(result => {
              if (result.data) {
                SwalExtended.close();
              } else {
                const error = result.error as BaseQueryError;
                if (error.status === 400 && error.data) {
                  renderFormError(error.data, setFieldError);
                }
              }
            })
            .finally(() => {
              setSubmitting(false);
              SwalExtended.hideLoading();
            });
      }
    },
  });

  const { handleSubmit, handleChange, touched, values, isSubmitting, handleReset, handleBlur, errors } = formik;

  return (
    <Popup
      title={`${update ? 'Update' : 'Add'} new template`}
      subtitle="Fill out the information below to make a template"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
    >
      <div className="mx-md-0 mx-sm-1 text-start">
        <Row className="gap-3 mb-4">
          <Col md={8}>
            <Form.Group controlId="NewTemplateFormName">
              <Form.Label className="popup-form-labels">Template name</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                placeholder="Template Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.name && !errors.name}
                isInvalid={touched.name && !!errors.name}
              />

              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="NewTemplateFormDescription" className="mb-4">
          <Form.Label className="popup-form-labels">Description</Form.Label>
          <Form.Control
            placeholder="Some test here..."
            as="textarea"
            rows={4}
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.description && !errors.description}
            isInvalid={touched.description && !!errors.description}
          />

          <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="NewTemplateFormPersonalDetails">
          <Form.Label className="popup-form-labels">Section to include</Form.Label>
          {rentalApplicationSteps.map(({ name, label }) => (
            <Form.Group key={name} controlId={`NewTemplateFormSteps${name}`}>
              <Form.Check
                type="checkbox"
                label={label}
                className="small text-primary mb-2"
                name={`steps.${name}`}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!getIn(errors, `steps.${name}`) && getIn(touched, `steps.${name}`)}
                defaultChecked={Boolean(values.steps[name as keyof StepsType])}
              />
            </Form.Group>
          ))}
          <Form.Control.Feedback type="invalid" className={errors.steps ? 'd-block' : 'd-none'}>
            At least one needs to be checked
          </Form.Control.Feedback>
        </Form.Group>
      </div>
    </Popup>
  );
};

export default NewApplicationTemplateModal;
