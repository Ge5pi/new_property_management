import { useMemo } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { clsx } from 'clsx';
import { useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import { useGetPropertyByIdQuery } from 'services/api/properties';
import { BaseQueryError, GenericMutationResult } from 'services/api/types/rtk-query';
import { useGetUnitTypeByIdQuery } from 'services/api/unit-types';
import { useAddUnitPhotoMutation, useCreateUnitMutation, useUpdateUnitMutation } from 'services/api/units';

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
import { getIDFromObject, getReadableError, getSearchFilter, getValidID, renderFormError } from 'utils/functions';

import { IFileInfo } from 'interfaces/IAttachments';
import { IPropertyAPI } from 'interfaces/IProperties';
import { IPhotoUnitID, ISingleUnit, IUnitTypeAPI, IUnitsAPI } from 'interfaces/IUnits';

interface IProps {
  unit?: ISingleUnit;
  property?: string | number;
  update?: boolean;
}

const UnitSchema = Yup.object().shape({
  property_name: yupFilterInput.required('this filed is required!'),
  unit_type: yupFilterInput.required('this filed is required!'),
  name: Yup.string().trim().required('This field is required!'),
  address: Yup.string().trim().min(5),
  image_preview: Yup.boolean().default(false),
  file: Yup.mixed()
    .when('image_preview', {
      is: false,
      then: schema => schema.required('this filed is required!'),
    })
    .nullable(),
});

const UnitsModal = ({ unit, update = false, property }: IProps) => {
  const {
    data: unit_type_data,
    isLoading: unitTypeLoading,
    isFetching: unitTypeFetching,
  } = useGetUnitTypeByIdQuery(getIDFromObject('unit_type', unit));

  const {
    data: property_data,
    isLoading: propertyLoading,
    isFetching: propertyFetching,
  } = useGetPropertyByIdQuery(getValidID(property));

  const [createUnit] = useCreateUnitMutation();
  const [updateUnit] = useUpdateUnitMutation();
  const [addUnitPhoto] = useAddUnitPhotoMutation();

  const cover = useMemo(() => {
    if (unit && unit.cover_picture_id && unit.cover_picture) {
      return {
        id: unit.cover_picture_id,
        image: unit.cover_picture,
      };
    }
  }, [unit]);

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
  } = useUploader('units');

  const handleFormSubmission = async (values: IUnitsAPI) => {
    const promises: Array<Promise<IFileInfo>> = [];
    selectedFiles.forEach(file => promises.push(handleUpload(file)));
    const attachedFiles = await Promise.all(promises);

    let unit_id = unit && unit.id ? Number(unit.id) : -1;
    const response =
      update && unit_id > 0 ? await updateUnit({ ...values, id: unit_id }).unwrap() : await createUnit(values).unwrap();

    unit_id = Number(response.id);
    const attachments = await handleAttachments(attachedFiles, unit_id);
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
      unit: attachment__id,
      image: result.unique_name,
    })) as Array<IPhotoUnitID>;

    const promises: Array<GenericMutationResult<IPhotoUnitID, 'UnitPhotos', IPhotoUnitID>> = [];
    if (attachments.length > 0) {
      attachments.map(attachment => promises.push(addUnitPhoto(attachment)));
    }

    return await Promise.all(promises);
  };

  const formik = useFormik({
    initialValues: {
      property_name: property_data ? [property_data] : ([] as Option[]),
      unit_type: unit_type_data ? [unit_type_data] : ([] as Option[]),
      name: unit?.name ?? '',
      address: unit?.address ?? '',
      image_preview: hasImage,
      file: null,
    },
    validationSchema: UnitSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      let unit_type_id = 0;
      if (values.unit_type && values.unit_type.length > 0) {
        unit_type_id = Number((values.unit_type as Array<IUnitTypeAPI>)[0].id);
      }

      let property_id = 0;
      if (values.property_name && Array.isArray(values.property_name) && values.property_name.length > 0) {
        property_id = Number((values.property_name[0] as IPropertyAPI).id);
      }

      const data: IUnitsAPI = {
        ...values,
        parent_property: property_id,
        unit_type: unit_type_id,
      };

      handleFormSubmission(data)
        .then(result => {
          Notify.show({ type: result.status, title: result.feedback });
          SwalExtended.close({
            isConfirmed: true,
            value: { property: result.data.parent_property, unit: result.data.id },
          });
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
      setTotalFiles(acceptedFiles.length);
    }
  };

  const handleImageRemove = () => {
    setSelectedFiles([]);
    setFieldValue('file', null);
    setFieldValue('image_preview', false);
    updatePreview(undefined);
  };

  const currentProgress = progress.find(p => filesData.find(f => f.unique_name === p.file_id));
  return (
    <Popup
      title={`${update ? 'Update' : 'Add'} Unit`}
      subtitle={`${update ? 'Update' : 'Add'} general unit information here`}
      successButton={update ? 'Update' : 'Save'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
      progress={{
        total: totalFiles,
        uploaded: totalFilesUpload,
        progress: currentProgress && currentProgress.progress ? currentProgress.progress : 0,
        show: Boolean(selectedFiles.length > 0),
        totalProgress: totalUploadProgress,
      }}
    >
      <Row className="gy-md-0 gy-3 gx-md-4 gx-sm-1 gx-0">
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
            <Form.Group controlId="UnitFormImage">
              <div className="ratio ratio-4x3">
                <Dropzone
                  onDrop={onDrop}
                  accept={FILE_TYPES_IMAGES}
                  name="file"
                  onError={error => setFieldError('file', error.message)}
                  maxSize={5242880}
                  multiple={false}
                  maxFiles={1}
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
            <FilterPaginateInput
              name="property_name"
              model_label="property.Property"
              labelText="Select Property"
              controlId={`UnitsFormProperty`}
              placeholder={`Select`}
              classNames={{
                labelClass: 'popup-form-labels',
                wrapperClass: 'mb-3',
              }}
              selected={values.property_name}
              onSelectChange={selected => {
                if (selected.length) {
                  setFieldValue('property_name', selected);
                } else {
                  setFieldValue('property_name', []);
                }

                setFieldValue('unit_type', []);
              }}
              labelKey={'name'}
              onBlurChange={() => setFieldTouched('property_name', true)}
              isValid={touched.property_name && !errors.property_name}
              isInvalid={touched.property_name && !!errors.property_name}
              disabled={propertyLoading || propertyFetching || Number(property) > 0}
              error={errors.property_name}
            />
            <Form.Group className="mb-4" controlId="UnitFormName">
              <Form.Label className="popup-form-labels">Unit name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter unit name"
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
              name="unit_type"
              labelText="Search Unit Type"
              model_label="property.UnitType"
              filter={getSearchFilter(values.property_name, 'parent_property')}
              controlId={`FixedAssetImportFormUnit`}
              placeholder={`Select Unit`}
              classNames={{
                labelClass: 'popup-form-labels',
                wrapperClass: 'mb-3',
              }}
              selected={values.unit_type}
              labelKey={'name'}
              onSelectChange={selected => {
                if (selected.length) {
                  setFieldValue('unit_type', selected);
                } else {
                  setFieldValue('unit_type', []);
                }
              }}
              onBlurChange={() => setFieldTouched('unit_type', true)}
              isValid={touched.unit_type && !errors.unit_type}
              isInvalid={touched.unit_type && !!errors.unit_type}
              preload={getSearchFilter(values.property_name, 'parent_property', true)}
              disabled={values.property_name.length <= 0 || unitTypeFetching || unitTypeLoading}
              error={errors.unit_type}
            />
            <Form.Group controlId="UnitFormAddress">
              <Form.Label className="popup-form-labels">Floor Address</Form.Label>
              <Form.Control
                placeholder="Enter Unit address"
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

export default ProviderHOC(UnitsModal);
