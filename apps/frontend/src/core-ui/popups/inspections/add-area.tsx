import { Form } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { SwalExtended } from 'core-ui/sweet-alert';

import { renderFormError } from 'utils/functions';

import { IInspectionArea } from 'interfaces/IInspections';

interface IProps {
  update?: boolean;
  inspection: string | number;
  area?: IInspectionArea;
  createInspectionArea?: GenericMutationTrigger<IInspectionArea, IInspectionArea>;
  updateInspectionArea?: GenericMutationTrigger<Partial<IInspectionArea>, IInspectionArea>;
}

const InspectionAreaSchema = Yup.object().shape({
  name: Yup.string().trim().required('This field is required!').min(1),
});

const AddArea = ({ inspection, area, update = false, createInspectionArea, updateInspectionArea }: IProps) => {
  const formik = useFormik({
    initialValues: {
      name: area?.name ?? '',
    },
    validationSchema: InspectionAreaSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      if (update && Number(inspection) > 0 && area && area.id) {
        updateInspectionArea &&
          updateInspectionArea({ ...values, id: area.id, inspection: Number(inspection) })
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
        if (Number(inspection) > 0) {
          createInspectionArea &&
            createInspectionArea({ ...values, inspection: Number(inspection) })
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
      }
    },
  });

  const { handleSubmit, handleChange, touched, values, isSubmitting, handleReset, handleBlur, errors } = formik;

  return (
    <Popup title={'Add new area'} onSubmit={handleSubmit} isSubmitting={isSubmitting} onReset={handleReset}>
      <Form.Group className="mb-3" controlId="InspectionAreaFormName">
        <Form.Label className="popup-form-labels">Area Name</Form.Label>
        <Form.Control
          autoFocus
          type="text"
          placeholder="Enter a name of the the area"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          isValid={touched.name && !errors.name}
          isInvalid={touched.name && !!errors.name}
        />
        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
      </Form.Group>
    </Popup>
  );
};

export default AddArea;
