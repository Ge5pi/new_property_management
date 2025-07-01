import { Form } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { SwalExtended } from 'core-ui/sweet-alert';

import { renderFormError } from 'utils/functions';

import { IVendorType } from 'interfaces/IPeoples';

interface IProps {
  update?: boolean;
  vendorType?: IVendorType;
  createVendorType?: GenericMutationTrigger<IVendorType, IVendorType>;
  updateVendorType?: GenericMutationTrigger<Partial<IVendorType>, IVendorType>;
}

const VendorTypeSchema = Yup.object().shape({
  name: Yup.string().trim().required('This field is required!'),
  description: Yup.string().trim().required('This field is required!').min(5),
});

const NewType = ({ update = false, vendorType, updateVendorType, createVendorType }: IProps) => {
  const formik = useFormik({
    initialValues: {
      name: vendorType?.name ?? '',
      description: vendorType?.description ?? '',
    },
    validationSchema: VendorTypeSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      if (update && vendorType && Number(vendorType.id) > 0) {
        updateVendorType &&
          updateVendorType({ ...values, id: vendorType.id })
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
        createVendorType &&
          createVendorType(values)
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

  const { handleSubmit, touched, values, isSubmitting, handleReset, handleBlur, handleChange, errors } = formik;

  return (
    <Popup
      title={`${update ? 'Edit' : 'Add new'} vendor type`}
      subtitle={`Fill out the information below to ${update ? 'update' : 'add a new'} vendor type`}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
    >
      <div className="mx-md-0 mx-sm-1 text-start">
        <Form.Group className="mb-4" controlId="VendorTypeFormName">
          <Form.Label className="form-label-md">Title</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            placeholder="Enter Item name here..."
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.name && !errors.name}
            isInvalid={touched.name && !!errors.name}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4" controlId="VendorTypeFormDescription">
          <Form.Label className="popup-form-labels">Description</Form.Label>
          <Form.Control
            placeholder="Some description here"
            as="textarea"
            rows={5}
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

export default NewType;
