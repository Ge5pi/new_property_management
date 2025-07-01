import { Form } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { SwalExtended } from 'core-ui/sweet-alert';

import { renderFormError } from 'utils/functions';

import { IIDName } from 'interfaces/IGeneral';
import { GeneralLabels } from 'interfaces/ISettings';

interface IProps {
  update?: boolean;
  general_label?: GeneralLabels;
  createGeneralLabel?: GenericMutationTrigger<IIDName, GeneralLabels>;
  updateGeneralLabel?: GenericMutationTrigger<Partial<GeneralLabels>, GeneralLabels>;
}

const GeneralLabelSchema = Yup.object().shape({
  name: Yup.string().trim().required('This field is required!').min(1),
});

const NewLabelModal = ({ update = false, createGeneralLabel, general_label, updateGeneralLabel }: IProps) => {
  const formik = useFormik({
    initialValues: {
      name: general_label?.name ?? '',
    },
    validationSchema: GeneralLabelSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      if (update && general_label && Number(general_label.id) > 0) {
        updateGeneralLabel &&
          updateGeneralLabel({ ...values, id: Number(general_label.id) })
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
        createGeneralLabel &&
          createGeneralLabel(values)
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
      title={`${update ? 'Update' : 'Add'} new label`}
      subtitle={`${update ? 'Update current' : 'Enter a suitable'} title for the label`}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
      successButton={update ? 'Update' : 'Add'}
    >
      <Form.Group className="mb-3" controlId="NewLabelTitle">
        <Form.Label className="popup-form-labels">Title</Form.Label>
        <Form.Control
          autoFocus
          type="text"
          placeholder="Enter a label name"
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

export default NewLabelModal;
