import { Form } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { SwalExtended } from 'core-ui/sweet-alert';

import { renderFormError } from 'utils/functions';

import { IIDName } from 'interfaces/IGeneral';
import { PropertyType } from 'interfaces/ISettings';

interface IProps {
  update?: boolean;
  property_type?: PropertyType;
  createPropertyType?: GenericMutationTrigger<IIDName, PropertyType>;
  updatePropertyType?: GenericMutationTrigger<Partial<PropertyType>, PropertyType>;
}

const PropertyTypeSchema = Yup.object().shape({
  name: Yup.string().trim().required('This field is required!').min(1),
});

const NewPropertyTypeModal = ({ update = false, updatePropertyType, property_type, createPropertyType }: IProps) => {
  const formik = useFormik({
    initialValues: {
      name: property_type?.name ?? '',
    },
    validationSchema: PropertyTypeSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      if (update && property_type && Number(property_type.id) > 0) {
        updatePropertyType &&
          updatePropertyType({ ...values, id: Number(property_type.id) })
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
        createPropertyType &&
          createPropertyType(values)
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
      title={`${update ? 'Update' : 'Add'} Property Type`}
      subtitle={`Fill out the details to ${update ? 'update existing' : 'create new'} property type`}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
      successButton={update ? 'Update' : 'Add'}
    >
      <Form.Group className="mb-3" controlId="NewTypesPropertyTitle">
        <Form.Label className="popup-form-labels">Title</Form.Label>
        <Form.Control
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

export default NewPropertyTypeModal;
