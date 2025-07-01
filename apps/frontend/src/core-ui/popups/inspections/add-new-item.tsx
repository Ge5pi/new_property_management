import { Col, Form, Row } from 'react-bootstrap';

import { clsx } from 'clsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { SwalExtended } from 'core-ui/sweet-alert';

import { renderFormError } from 'utils/functions';

import { IInspectionAreaItem, InspectionCondition } from 'interfaces/IInspections';

interface IProps {
  update?: boolean;
  area: string | number;
  item?: IInspectionAreaItem;
  createInspectionAreaItem?: GenericMutationTrigger<IInspectionAreaItem, IInspectionAreaItem>;
  updateInspectionAreaItem?: GenericMutationTrigger<Partial<IInspectionAreaItem>, IInspectionAreaItem>;
}

const InspectionAreaItemSchema = Yup.object().shape({
  name: Yup.string().trim().required('This field is required!').min(1),
  condition: Yup.string().required('This field is required!').oneOf(['OKAY', 'NOT_OKAY']),
});

const AddNewItem = ({ area, item, update = false, createInspectionAreaItem, updateInspectionAreaItem }: IProps) => {
  const formik = useFormik({
    initialValues: {
      name: item?.name ?? '',
      condition: item?.condition ?? 'OKAY',
    },
    validationSchema: InspectionAreaItemSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      const data = {
        ...values,
        condition: values.condition as InspectionCondition,
      };

      if (update && Number(area) > 0 && item && item.id) {
        updateInspectionAreaItem &&
          updateInspectionAreaItem({ ...data, id: item.id, area: Number(area) })
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
        if (Number(area) > 0) {
          createInspectionAreaItem &&
            createInspectionAreaItem({ ...data, area: Number(area) })
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

  const {
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    touched,
    values,
    isSubmitting,
    handleChange,
    handleReset,
    handleBlur,
    errors,
  } = formik;

  return (
    <Popup title={'Add new item'} onSubmit={handleSubmit} isSubmitting={isSubmitting} onReset={handleReset}>
      <Form.Group className="mb-3" controlId="InspectionItemFormName">
        <Form.Label className="popup-form-labels">Item Name</Form.Label>
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
      <Row className="gx-0 py-2 border-bottom align-items-center flex-wrap">
        <Col xs={'auto'}>
          <Form.Label className="popup-form-labels me-2">Condition</Form.Label>
        </Col>
        <Form.Group as={Col} xs={'auto'} controlId="InspectionItemFormConditionOkay">
          <Form.Check
            type={'radio'}
            label={`Okay`}
            className="small text-primary"
            name="condition"
            value={'OKAY'}
            defaultChecked={values.condition === 'OKAY'}
            onChange={ev => setFieldValue('condition', ev.target.value)}
            onBlur={() => setFieldTouched('condition')}
            isInvalid={touched.condition && !!errors.condition}
          />
        </Form.Group>
        <Form.Group as={Col} xs={'auto'} className="ms-3" controlId="InspectionItemFormConditionNotOkay">
          <Form.Check
            type={'radio'}
            label={`Not Okay`}
            className="small text-primary"
            name="condition"
            value={'NOT_OKAY'}
            defaultChecked={values.condition === 'NOT_OKAY'}
            onChange={ev => setFieldValue('condition', ev.target.value)}
            onBlur={() => setFieldTouched('condition')}
            isInvalid={touched.condition && !!errors.condition}
          />
        </Form.Group>
        <Col xs={12}>
          <Form.Control.Feedback type="invalid" className={clsx({ 'd-block': errors.condition })}>
            {errors.condition}
          </Form.Control.Feedback>
        </Col>
      </Row>
    </Popup>
  );
};

export default AddNewItem;
