import { Form } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Popup } from 'components/popup';

import { GroupedField } from 'core-ui/grouped-field';
import { SwalExtended } from 'core-ui/sweet-alert';

import { displayDate } from 'utils/functions';

import { ILabor } from 'interfaces/IWorkOrders';

interface IProps {
  addLabor?: (data: ILabor) => Promise<{ data: ILabor } | { error: unknown }>;
  updateLabor?: (id: string | number, data: ILabor) => Promise<{ data: ILabor } | { error: unknown }>;
  labor?: ILabor;
  update?: boolean;
}

const LaborSchema = Yup.object().shape({
  title: Yup.string().trim().required('This field is required!').min(1),
  description: Yup.string().trim().required('This field is required!'),
  hours: Yup.number().positive().required(`This field is required!`),
});

const LaborModal = ({ addLabor, updateLabor, labor, update = false }: IProps) => {
  const formik = useFormik({
    initialValues: {
      title: labor?.title ?? '',
      description: labor?.description ?? '',
      date: labor?.date ?? '',
      hours: labor?.hours ?? '',
    },
    validationSchema: LaborSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      if (update && labor && labor.id) {
        updateLabor &&
          updateLabor(labor.id, {
            ...values,
            hours: Number(values.hours),
          }).then(() => SwalExtended.close());
      } else {
        addLabor &&
          addLabor({ ...values, date: displayDate(new Date(), 'YYYY-MM-DD') } as ILabor).then(() =>
            SwalExtended.close()
          );
      }
    },
  });

  const { handleSubmit, handleChange, touched, values, isSubmitting, handleReset, handleBlur, errors } = formik;

  return (
    <Popup
      title={'Labor Creation Form'}
      subtitle={'Add details of labor to add'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
    >
      <Form.Group className="mb-3" controlId="LaborFormItemName">
        <Form.Label className="popup-form-labels">Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name here."
          name="title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          isValid={touched.title && !errors.title}
          isInvalid={touched.title && !!errors.title}
        />
        <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
      </Form.Group>

      <GroupedField
        icon={'hr'}
        position={'end'}
        name="hours"
        controlId="LaborFormAmount"
        label="Hours"
        value={values.hours}
        onChange={handleChange}
        onBlur={handleBlur}
        isValid={touched.hours && !errors.hours}
        isInvalid={touched.hours && !!errors.hours}
        type="number"
        step={0.01}
        placeholder="0.00"
        error={errors.hours}
      />

      <Form.Group className="mb-3" controlId="LaborFormDescription">
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
    </Popup>
  );
};

export default LaborModal;
