import { Form } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { SwalExtended } from 'core-ui/sweet-alert';

import { renderFormError } from 'utils/functions';

import { IIDName } from 'interfaces/IGeneral';
import { GeneralTags } from 'interfaces/ISettings';

interface IProps {
  update?: boolean;
  general_tag?: GeneralTags;
  createGeneralTag?: GenericMutationTrigger<IIDName, GeneralTags>;
  updateGeneralTag?: GenericMutationTrigger<Partial<GeneralTags>, GeneralTags>;
}

const GeneralLabelSchema = Yup.object().shape({
  name: Yup.string().trim().required('This field is required!').min(1),
});
const NewTagsModal = ({ update = false, createGeneralTag, general_tag, updateGeneralTag }: IProps) => {
  const formik = useFormik({
    initialValues: {
      name: general_tag?.name ?? '',
    },
    validationSchema: GeneralLabelSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      if (update && general_tag && Number(general_tag.id) > 0) {
        updateGeneralTag &&
          updateGeneralTag({ ...values, id: Number(general_tag.id) })
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
        createGeneralTag &&
          createGeneralTag(values)
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
      title={`${update ? 'Update' : 'Add'} new tag`}
      subtitle={`${update ? 'Update current' : 'Add a suitable'} title for the tag`}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
      successButton={update ? 'Update' : 'Add'}
    >
      <Form.Group className="mb-3" controlId="NewTagTitle">
        <Form.Label className="popup-form-labels">Title</Form.Label>
        <Form.Control
          autoFocus
          type="text"
          placeholder="Enter a tag name"
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

export default NewTagsModal;
