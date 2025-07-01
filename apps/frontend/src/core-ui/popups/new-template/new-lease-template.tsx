import { Col, Form, Row } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { SwalExtended } from 'core-ui/sweet-alert';

import { renderFormError } from 'utils/functions';

import { ISingleLeaseTemplate } from 'interfaces/IApplications';

interface IProps {
  update?: boolean;
  template?: ISingleLeaseTemplate;
  createTemplate?: GenericMutationTrigger<ISingleLeaseTemplate, ISingleLeaseTemplate>;
  updateTemplate?: GenericMutationTrigger<Partial<ISingleLeaseTemplate>, ISingleLeaseTemplate>;
}

const LeaseTemplateSchema = Yup.object().shape({
  name: Yup.string().trim().required('This field is required!'),
  description: Yup.string().trim().min(5),
});

const NewLeaseTemplateModal = ({ update = false, createTemplate, updateTemplate, template }: IProps) => {
  const formik = useFormik({
    initialValues: {
      name: template?.name ?? '',
      description: template?.description ?? '',
    },
    validationSchema: LeaseTemplateSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      if (update && template && Number(template.id) > 0) {
        updateTemplate &&
          updateTemplate({ ...values, id: template.id })
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
          createTemplate(values)
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
      </div>
    </Popup>
  );
};

export default NewLeaseTemplateModal;
