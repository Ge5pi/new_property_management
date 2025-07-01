import { Form } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { SwalExtended } from 'core-ui/sweet-alert';

import { renderFormError } from 'utils/functions';

import { IIDName } from 'interfaces/IGeneral';
import { ContactCategory } from 'interfaces/ISettings';

interface IProps {
  update?: boolean;
  inventory_type?: ContactCategory;
  createContactCategory?: GenericMutationTrigger<IIDName, ContactCategory>;
  updateContactCategory?: GenericMutationTrigger<Partial<ContactCategory>, ContactCategory>;
}

const ContactCategorySchema = Yup.object().shape({
  name: Yup.string().trim().required('This field is required!').min(1),
});

const NewContactCategoryModal = ({
  update = false,
  createContactCategory,
  inventory_type,
  updateContactCategory,
}: IProps) => {
  const formik = useFormik({
    initialValues: {
      name: inventory_type?.name ?? '',
    },
    validationSchema: ContactCategorySchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      if (update && inventory_type && Number(inventory_type.id) > 0) {
        updateContactCategory &&
          updateContactCategory({ ...values, id: Number(inventory_type.id) })
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
        createContactCategory &&
          createContactCategory(values)
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
      title={`${update ? 'Update' : 'Create'} contact category`}
      subtitle={`Fill out the details to ${update ? 'update existing' : 'create new'} contact category type`}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
      successButton={update ? 'Update' : 'Add'}
    >
      <Form.Group className="mb-3" controlId="NewContactCategoryName">
        <Form.Label className="popup-form-labels">Name</Form.Label>
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

export default NewContactCategoryModal;
