import { useCallback, useMemo } from 'react';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { SwalExtended } from 'core-ui/sweet-alert';

import { rentalApplicationSteps } from 'constants/steps';
import { renderFormError } from 'utils/functions';

import { IRentalTemplate } from 'interfaces/IApplications';
import { SearchObject } from 'interfaces/IGeneral';
import { ISingleProperty } from 'interfaces/IProperties';

const rentalApplicationSchema = Yup.object().shape({
  rental_application_template: yupFilterInput.required('This field is required!'),
});

interface IProps {
  property_id: number;
  rental_application_template?: IRentalTemplate | undefined;
  updatePropertyDetails?: GenericMutationTrigger<Partial<ISingleProperty>, ISingleProperty>;
}

const RentalTemplateModal = ({ rental_application_template, property_id, updatePropertyDetails }: IProps) => {
  const formik = useFormik({
    initialValues: {
      rental_application_template: rental_application_template ? [rental_application_template] : ([] as Option[]),
    },
    validationSchema: rentalApplicationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();
      const rental_id =
        values.rental_application_template.length > 0 &&
        Number((values.rental_application_template as Array<IRentalTemplate>)[0].id);

      if (rental_id && updatePropertyDetails) {
        updatePropertyDetails({ id: property_id, rental_application_template: rental_id })
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

  const { handleSubmit, touched, values, setFieldValue, setFieldTouched, isSubmitting, handleReset, errors } = formik;

  const onRentalTemplateSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('rental_application_template', selected);
      } else {
        setFieldValue('rental_application_template', []);
      }
    },
    [setFieldValue]
  );

  const selected_template = useMemo(() => {
    if (values.rental_application_template && values.rental_application_template.length > 0) {
      const name = (values.rental_application_template[0] as IRentalTemplate).name;
      const steps = (values.rental_application_template[0] as SearchObject).selected_steps ?? [];
      return { name, steps };
    }
    return null;
  }, [values.rental_application_template]);

  return (
    <Popup
      title={'Rental Application Template'}
      subtitle={'Update rental template for this property'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
    >
      <div className="text-start">
        <FilterPaginateInput
          name="rental_application_template"
          labelText="Choose a Template For this Property"
          controlId={`DefaultLeaseFormTemplate`}
          placeholder={`Search Rental Application Template`}
          autoFocus
          classNames={{
            labelClass: 'popup-form-labels',
            wrapperClass: 'mb-4',
          }}
          labelKey={'name'}
          selected={values.rental_application_template}
          onSelectChange={onRentalTemplateSelected}
          onBlurChange={() => setFieldTouched('rental_application_template', true)}
          isValid={touched.rental_application_template && !errors.rental_application_template}
          isInvalid={touched.rental_application_template && !!errors.rental_application_template}
          model_label="lease.RentalApplicationTemplate"
          error={errors.rental_application_template}
        />
        {selected_template && (
          <div className="small">
            <p className="text-dark mb-0">
              Steps include in
              <span className="mx-1 fw-bold">{selected_template.name}</span>
            </p>
            <div className="fw-medium text-opacity-50">
              {selected_template.steps &&
                selected_template.steps.length > 0 &&
                rentalApplicationSteps.filter(r => selected_template.steps.includes(r.name)).map(f => `${f.label}, `)}
            </div>
          </div>
        )}
      </div>
    </Popup>
  );
};

export default RentalTemplateModal;
