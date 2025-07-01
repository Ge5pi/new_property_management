import { useCallback, useMemo } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { clsx } from 'clsx';
import { useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import {
  useAddPropertyPhotoMutation,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
} from 'services/api/properties';
import { useGetPropertyTypeByIdQuery } from 'services/api/system-preferences';
import { BaseQueryError, GenericMutationResult } from 'services/api/types/rtk-query';

import { Dropzone } from 'components/dropzone';
import { Popup } from 'components/popup';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { DeleteBtn } from 'core-ui/delete-btn';
import { LazyImage } from 'core-ui/lazy-image';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { usePhoto } from 'hooks/usePhoto';
import { useUploader } from 'hooks/useUploader';

import { FILE_TYPES_IMAGES } from 'constants/file-types';
import { getIDFromObject, getReadableError, renderFormError } from 'utils/functions';

import { IFileInfo } from 'interfaces/IAttachments';
import { IPhotoPropertyID, IPropertyAPI, ISingleProperty } from 'interfaces/IProperties';
import { PropertyType } from 'interfaces/ISettings';

interface IProps {
  currentRoute?: 'property' | 'association';
  property?: ISingleProperty;
  update?: boolean;
}

const PropertySchema = Yup.object().shape({
  name: Yup.string().trim().required('This field is required!'),
  address: Yup.string().trim().required('This field is required!').min(5),
  property_type: yupFilterInput.required('This field is required!'),
  image_preview: Yup.boolean().default(false),
  file: Yup.mixed()
    .when('image_preview', {
      is: false,
      then: schema => schema.required('This field is required!'),
    })
    .nullable(),
});

const PropertyModal = ({ currentRoute = 'property', property, update = false }: IProps) => {
  const {
    data: property_type,
    isLoading: propertyTypeLoading,
    isFetching: propertyTypeFetching,
  } = useGetPropertyTypeByIdQuery(getIDFromObject('property_type', property));

  const [addPropertyPhoto] = useAddPropertyPhotoMutation();
  const [createProperty] = useCreatePropertyMutation();
  const [updateProperty] = useUpdatePropertyMutation();

  const cover = useMemo(() => {
    if (property && property.cover_picture_id && property.cover_picture) {
      return {
        id: property.cover_picture_id,
        image: property.cover_picture,
      };
    }
  }, [property]);

  const { preview, hasImage, updatePreview } = usePhoto(cover);
  const {
    setSelectedFiles,
    selectedFiles,
    setTotalFiles,
    handleUpload,
    totalFiles,
    totalUploadProgress,
    totalFilesUpload,
    progress,
    filesData,
  } = useUploader('properties');

  const handleFormSubmission = async (values: IPropertyAPI) => {
    const promises: Array<Promise<IFileInfo>> = [];
    selectedFiles.forEach(file => promises.push(handleUpload(file)));
    const attachedFiles = await Promise.all(promises);

    let record_id = property && property.id ? Number(property.id) : -1;
    const response =
      update && record_id > 0
        ? await updateProperty({ ...values, id: record_id }).unwrap()
        : await createProperty(values).unwrap();

    record_id = Number(response.id);
    const attachments = await handleAttachments(attachedFiles, record_id);
    const failedUploads = attachments.filter(result => result.error);
    if (failedUploads.length <= 0) {
      return {
        data: response,
        feedback: `Record has been successfully ${update ? 'updated!' : 'created!'}`,
        status: 'success' as 'success' | 'warning',
      };
    }

    return {
      data: response,
      feedback: `${failedUploads.length}/${selectedFiles.length} files failed to upload. However, the record may have already been ${update ? 'updated!' : 'created!'}`,
      status: 'warning' as 'success' | 'warning',
    };
  };

  const handleAttachments = async (files: IFileInfo[], attachment__id: number) => {
    const attachments = files.map((result, inx) => ({
      is_cover: inx === 0,
      parent_property: attachment__id,
      image: result.unique_name,
    })) as Array<IPhotoPropertyID>;

    const promises: Array<GenericMutationResult<IPhotoPropertyID, 'PropertyPhotos', IPhotoPropertyID>> = [];
    if (attachments.length > 0) {
      attachments.map(attachment => promises.push(addPropertyPhoto(attachment)));
    }

    return await Promise.all(promises);
  };

  const formik = useFormik({
    initialValues: {
      name: property?.name ?? '',
      address: property?.address ?? '',
      property_type: property_type ? [property_type] : ([] as Option[]),
      image_preview: hasImage,
      file: null,
    },
    validationSchema: PropertySchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      let property_type_id = 0;
      if (values.property_type && values.property_type.length > 0) {
        property_type_id = Number((values.property_type as Array<PropertyType>)[0].id);
      }

      const data: IPropertyAPI = {
        ...values,
        property_type: property_type_id,
      };

      handleFormSubmission(data)
        .then(result => {
          Notify.show({ type: result.status, title: result.feedback });
          SwalExtended.close({ isConfirmed: true, value: Number(result.data.id) });
        })
        .catch(err => {
          Notify.show({ type: 'danger', title: 'Something went wrong!', description: getReadableError(err) });
          const error = err as BaseQueryError;
          if (error.status === 400 && error.data) {
            renderFormError(error.data, setFieldError);
          }
        })
        .finally(() => {
          setSubmitting(false);
          SwalExtended.hideLoading();
        });
    },
  });

  const {
    handleSubmit,
    handleChange,
    touched,
    values,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    isSubmitting,
    handleReset,
    handleBlur,
    errors,
  } = formik;

  const onDrop = (acceptedFiles: Array<File>) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = function (e: ProgressEvent<FileReader>) {
        const target = e.target;
        if (target && target.result) {
          updatePreview(target.result.toString());
        }
      };

      reader.readAsDataURL(file);

      setSelectedFiles([file]);
      setFieldValue('file', [file]);
      setTotalFiles(1);
    }
  };

  const handleImageRemove = async () => {
    setSelectedFiles([]);
    setFieldValue('file', null);
    setFieldValue('image_preview', false);
    updatePreview(undefined);
  };

  const onPropertyTypeSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('property_type', selected);
      } else {
        setFieldValue('property_type', []);
      }
    },
    [setFieldValue]
  );

  const currentProgress = progress.find(p => filesData.find(f => f.unique_name === p.file_id));
  return (
    <Popup
      title={`${update ? 'Update' : 'Add'} ${currentRoute}`}
      subtitle={`${update ? 'Update' : 'Add'} basic ${currentRoute} information here`}
      successButton={update ? 'Update' : 'Save'}
      onReset={handleReset}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      progress={{
        total: totalFiles,
        uploaded: totalFilesUpload,
        progress: currentProgress && currentProgress.progress ? currentProgress.progress : 0,
        show: Boolean(selectedFiles.length > 0),
        totalProgress: totalUploadProgress,
      }}
    >
      <Row className="gy-md-0 gy-3 gx-md-4 gx-sm-1 gx-0 align-items-stretch">
        <Col xxl={5} xl={4} md={6}>
          {(values.file && !values.image_preview) || (values.image_preview && typeof preview === 'string') ? (
            <div className={'rounded-1 border border-dark overflow-hidden position-relative'}>
              <DeleteBtn
                resetCSS
                className="position-absolute rounded-circle bg-white end-0 m-3"
                style={{ zIndex: 1250 }}
                onClick={handleImageRemove}
              />
              <LazyImage src={preview} size="4x3" />
            </div>
          ) : (
            <Form.Group controlId={`${currentRoute}FormImage`}>
              <div className="ratio ratio-4x3">
                <Dropzone
                  onDrop={onDrop}
                  accept={FILE_TYPES_IMAGES}
                  maxSize={5242880}
                  multiple={false}
                  maxFiles={1}
                  name="file"
                  onError={error => setFieldError('file', error.message)}
                />
              </div>
            </Form.Group>
          )}
          <Form.Control.Feedback type="invalid" className={clsx({ 'd-block': errors.file })}>
            {errors.file}
          </Form.Control.Feedback>
        </Col>
        <Col xxl={7} xl={8} md={6}>
          <div className="text-start">
            <Form.Group className="mb-4" controlId={`${currentRoute}FormName`}>
              <Form.Label className="popup-form-labels text-capitalize">{currentRoute} Name</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.name && !errors.name}
                isInvalid={touched.name && !!errors.name}
                placeholder="Enter property name"
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
            <FilterPaginateInput
              labelText="Type"
              model_label="system_preferences.PropertyType"
              name="property_type"
              controlId={`${currentRoute}FormType`}
              placeholder={`Choose ${currentRoute} type`}
              classNames={{
                labelClass: 'popup-form-labels',
                wrapperClass: 'mb-4',
              }}
              selected={values.property_type}
              onSelectChange={onPropertyTypeSelected}
              searchIcon={false}
              labelKey={'name'}
              onBlurChange={() => setFieldTouched('property_type', true)}
              isValid={touched.property_type && !errors.property_type}
              isInvalid={touched.property_type && !!errors.property_type}
              disabled={propertyTypeLoading || propertyTypeFetching}
              error={errors.property_type}
            />
            <Form.Group controlId={`${currentRoute}FormAddress`}>
              <Form.Label className="popup-form-labels">Address</Form.Label>
              <Form.Control
                placeholder="Enter property address"
                as="textarea"
                rows={5}
                name="address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.address && !errors.address}
                isInvalid={touched.address && !!errors.address}
              />
              <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
            </Form.Group>
          </div>
        </Col>
      </Row>
    </Popup>
  );
};

export default ProviderHOC(PropertyModal);
