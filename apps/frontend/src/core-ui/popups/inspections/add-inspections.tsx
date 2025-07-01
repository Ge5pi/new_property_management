import { Form } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';
import { useGetUnitByIdQuery } from 'services/api/units';

import { Popup } from 'components/popup';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { InputDate } from 'core-ui/input-date';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { getIDFromObject, renderFormError } from 'utils/functions';

import { IInspectionsAPI } from 'interfaces/IInspections';
import { IUnitsAPI } from 'interfaces/IUnits';

interface IProps {
  inspection?: IInspectionsAPI;
  update?: boolean;
  createInspection?: GenericMutationTrigger<IInspectionsAPI, IInspectionsAPI>;
  updateInspection?: GenericMutationTrigger<Partial<IInspectionsAPI>, IInspectionsAPI>;
}
const InspectionSchema = Yup.object().shape({
  unit: yupFilterInput.required('this filed is required!'),
  name: Yup.string().trim().required('This field is required!').min(1),
  date: Yup.date().required('This field is required!'),
});

const AddInspections = ({ inspection, update = false, createInspection, updateInspection }: IProps) => {
  const {
    data: unit_data,
    isLoading: unitLoading,
    isFetching: unitFetching,
  } = useGetUnitByIdQuery(getIDFromObject('unit', inspection));

  const formik = useFormik({
    initialValues: {
      unit: unit_data ? [unit_data] : ([] as Option[]),
      name: inspection?.name ?? '',
      date: inspection?.date ?? '',
    },
    validationSchema: InspectionSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();
      const unit_id = values.unit.length > 0 && Number((values.unit as Array<IUnitsAPI>)[0].id);
      if (unit_id && unit_id > 0) {
        const data: IInspectionsAPI = {
          ...values,
          unit: unit_id,
        };

        if (update && inspection && Number(inspection.id) > 0) {
          updateInspection &&
            updateInspection({ ...data, id: inspection.id })
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
          createInspection &&
            createInspection(data)
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
      } else {
        Notify.show({
          type: 'danger',
          title: 'Invalid Unit ID provided, please select a valid unit',
        });
        setSubmitting(false);
        SwalExtended.hideLoading();
      }
    },
  });

  const {
    handleSubmit,
    handleChange,
    touched,
    values,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
    handleReset,
    handleBlur,
    errors,
  } = formik;

  return (
    <Popup
      title={'Add new Inspection'}
      subtitle="Fill the information to new inspection"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
    >
      <Form.Group className="mb-3" controlId="InspectionFormTitle">
        <Form.Label className="popup-form-labels">Inspection Title</Form.Label>
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

      <FilterPaginateInput
        name="unit"
        model_label="property.Unit"
        labelText="Select Unit"
        controlId={`InspectionsFormUnit`}
        placeholder={`Select`}
        classNames={{
          labelClass: 'popup-form-labels',
          wrapperClass: 'mb-3',
        }}
        selected={values.unit}
        onSelectChange={selected => {
          if (selected.length) {
            setFieldValue('unit', selected);
          } else {
            setFieldValue('unit', []);
          }
        }}
        onBlurChange={() => setFieldTouched('unit', true)}
        isValid={touched.unit && !errors.unit}
        isInvalid={touched.unit && !!errors.unit}
        labelKey={'name'}
        disabled={unitLoading || unitFetching}
        error={errors.unit}
      />

      <InputDate
        name={'date'}
        labelText={'Date'}
        controlId="InspectionFormDate"
        classNames={{ wrapperClass: 'mb-3', labelClass: 'popup-form-labels' }}
        onDateSelection={date => setFieldValue('date', date)}
        value={values.date}
        onBlur={handleBlur}
        isValid={touched.date && !errors.date}
        isInvalid={touched.date && !!errors.date}
        error={errors.date}
      />
    </Popup>
  );
};

export default ProviderHOC(AddInspections);
