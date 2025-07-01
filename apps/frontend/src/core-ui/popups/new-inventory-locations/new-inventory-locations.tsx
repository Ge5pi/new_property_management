import { Form } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { SwalExtended } from 'core-ui/sweet-alert';

import { renderFormError } from 'utils/functions';

import { IIDName } from 'interfaces/IGeneral';
import { InventoryLocations } from 'interfaces/ISettings';

interface IProps {
  update?: boolean;
  inventory_location?: InventoryLocations;
  createInventoryLocation?: GenericMutationTrigger<IIDName, InventoryLocations>;
  updateInventoryLocation?: GenericMutationTrigger<Partial<InventoryLocations>, InventoryLocations>;
}

const InventoryLocationSchema = Yup.object().shape({
  name: Yup.string().trim().required('This field is required!').min(1),
});

const NewInventoryLocationsModal = ({
  update = false,
  createInventoryLocation,
  inventory_location,
  updateInventoryLocation,
}: IProps) => {
  const formik = useFormik({
    initialValues: {
      name: inventory_location?.name ?? '',
    },
    validationSchema: InventoryLocationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      if (update && inventory_location && Number(inventory_location.id) > 0) {
        updateInventoryLocation &&
          updateInventoryLocation({ ...values, id: Number(inventory_location.id) })
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
        createInventoryLocation &&
          createInventoryLocation(values)
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
      title={`${update ? 'Update' : 'Add'} Inventory Location`}
      subtitle={`${update ? 'Update current' : 'Enter a suitable'} name of an inventory location`}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
      successButton={update ? 'Update' : 'Add'}
    >
      <Form.Group className="mb-3" controlId="NewInventoryLocationTitle">
        <Form.Label className="popup-form-labels">Title</Form.Label>
        <Form.Control
          autoFocus
          type="text"
          placeholder="Enter a name of the the location"
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

export default NewInventoryLocationsModal;
