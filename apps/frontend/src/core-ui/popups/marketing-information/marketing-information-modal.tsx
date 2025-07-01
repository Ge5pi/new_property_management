import { Form } from 'react-bootstrap';

import { FormikValues, useFormik } from 'formik';
import * as Yup from 'yup';

import { BaseQueryError } from 'services/api/types/rtk-query';

import { Popup } from 'components/popup';

import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { getReadableError, renderFormError } from 'utils/functions';

import { ISingleUnitType } from 'interfaces/IUnits';

const MarketingInformationSchema = Yup.object().shape({
  marketing_title: Yup.string().required('This field is required!'),
  marketing_description: Yup.string().required('This field is required!'),
  marketing_youtube_url: Yup.string().url('Please enter a valid URL Address').required('This field is required!'),
});

interface IProps {
  data?: ISingleUnitType;
  updateDataState: (data: Partial<ISingleUnitType>) => Promise<
    | {
        data: ISingleUnitType;
        error?: undefined;
      }
    | {
        data?: undefined;
        error: unknown;
      }
  >;
}

const MarketingInformationModal = ({ data, updateDataState }: IProps) => {
  const handleFormSubmission = async (values: FormikValues) => {
    return await updateDataState(values);
  };
  const formik = useFormik({
    initialValues: {
      marketing_title: data?.marketing_title ?? '',
      marketing_description: data?.marketing_description ?? '',
      marketing_youtube_url: data?.marketing_youtube_url ?? '',
    },
    validationSchema: MarketingInformationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      handleFormSubmission(values)
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
        .catch(error => {
          Notify.show({
            type: 'danger',
            title: 'Something went wrong, please check your input record',
            description: getReadableError(error),
          });
        })
        .finally(() => {
          setSubmitting(false);
          SwalExtended.hideLoading();
        });
    },
  });

  const { handleSubmit, handleChange, touched, values, isSubmitting, handleReset, handleBlur, errors } = formik;

  return (
    <Popup
      title={'Marketing Information'}
      subtitle={'Update Marketing information'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
    >
      <Form.Group className="mx-sm-0 mx-0 mb-4" controlId="MarketingInformationFormTitle">
        <Form.Label className="popup-form-labels">Marketing Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter description here"
          name="marketing_title"
          value={values.marketing_title}
          onChange={handleChange}
          onBlur={handleBlur}
          isValid={touched.marketing_title && !errors.marketing_title}
          isInvalid={touched.marketing_title && !!errors.marketing_title}
        />
        <Form.Control.Feedback type="invalid">{errors.marketing_title}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mx-sm-0 mx-0 mb-4" controlId="MarketingInformationFormDescription">
        <Form.Label className="popup-form-labels">Description</Form.Label>
        <Form.Control
          placeholder="Some test here..."
          as="textarea"
          rows={5}
          name="marketing_description"
          value={values.marketing_description}
          onChange={handleChange}
          onBlur={handleBlur}
          isValid={touched.marketing_description && !errors.marketing_description}
          isInvalid={touched.marketing_description && !!errors.marketing_description}
        />
        <Form.Control.Feedback type="invalid">{errors.marketing_description}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mx-sm-0 mx-0 mb-4" controlId="MarketingInformationFormOwnerLicense">
        <Form.Label className="popup-form-labels">Youtube Link</Form.Label>
        <Form.Control
          type="text"
          placeholder="https://"
          name="marketing_youtube_url"
          value={values.marketing_youtube_url}
          onChange={handleChange}
          onBlur={handleBlur}
          isValid={touched.marketing_youtube_url && !errors.marketing_youtube_url}
          isInvalid={touched.marketing_youtube_url && !!errors.marketing_youtube_url}
        />
        <Form.Control.Feedback type="invalid">{errors.marketing_youtube_url}</Form.Control.Feedback>
      </Form.Group>
    </Popup>
  );
};

export default MarketingInformationModal;
