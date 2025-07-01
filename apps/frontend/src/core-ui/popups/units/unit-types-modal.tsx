import { useMemo } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

import { clsx } from 'clsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationResult } from 'services/api/types/rtk-query';
import {
  useAddUnitTypePhotoMutation,
  useCreateUnitTypeMutation,
  useUpdateUnitTypeMutation,
} from 'services/api/unit-types';

import { Dropzone } from 'components/dropzone';
import { Popup } from 'components/popup';

import { DeleteBtn } from 'core-ui/delete-btn';
import { LazyImage } from 'core-ui/lazy-image';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { usePhoto } from 'hooks/usePhoto';
import { useUploader } from 'hooks/useUploader';

import { FILE_TYPES_IMAGES } from 'constants/file-types';
import { getReadableError, renderFormError } from 'utils/functions';

import { IFileInfo } from 'interfaces/IAttachments';
import { IPhotoUnitTypeID, ISingleUnitType, IUnitTypeAPI } from 'interfaces/IUnits';

interface IProps {
  unitType?: ISingleUnitType;
  property?: string | number;
  update?: boolean;
}

const UnitTypeSchema = Yup.object().shape({
  name: Yup.string().trim().required('This field is required!'),
  image_preview: Yup.boolean().default(false),
  file: Yup.mixed()
    .when('image_preview', {
      is: false,
      then: schema => schema.required('this filed is required!'),
    })
    .nullable(),
});

const UnitTypesModal = ({ unitType, update = false, property }: IProps) => {
  const [addUnitTypePhoto] = useAddUnitTypePhotoMutation();
  const [createUnitType] = useCreateUnitTypeMutation();
  const [updateUnitType] = useUpdateUnitTypeMutation();

  const cover = useMemo(() => {
    if (unitType && unitType.cover_picture_id && unitType.cover_picture) {
      return {
        id: unitType.cover_picture_id,
        image: unitType.cover_picture,
      };
    }
  }, [unitType]);

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
  } = useUploader('unit-types');

  const handleFormSubmission = async (values: IUnitTypeAPI) => {
    const promises: Array<Promise<IFileInfo>> = [];
    selectedFiles.forEach(file => promises.push(handleUpload(file)));
    const attachedFiles = await Promise.all(promises);

    let record_id = unitType && unitType.id ? Number(unitType.id) : -1;
    const response =
      update && record_id > 0
        ? await updateUnitType({ ...values, id: record_id }).unwrap()
        : await createUnitType(values).unwrap();

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
      unit_type: attachment__id,
      image: result.unique_name,
    })) as Array<IPhotoUnitTypeID>;

    const promises: Array<GenericMutationResult<IPhotoUnitTypeID, 'UnitTypePhotos', IPhotoUnitTypeID>> = [];
    if (attachments.length > 0) {
      attachments.map(attachment => promises.push(addUnitTypePhoto(attachment)));
    }

    return await Promise.all(promises);
  };

  const formik = useFormik({
    initialValues: {
      name: unitType?.name ?? '',
      image_preview: hasImage,
      file: null,
    },
    validationSchema: UnitTypeSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      if (!property || Number(property) <= 0) {
        setSubmitting(false);
        SwalExtended.hideLoading();
        Notify.show({ type: 'danger', title: 'Unable to fetch property details' });
        return;
      }

      const data: IUnitTypeAPI = {
        ...values,
        parent_property: Number(property),
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

  const handleImageRemove = async () => {
    setSelectedFiles([]);
    setFieldValue('file', null);
    setFieldValue('image_preview', false);
    updatePreview(undefined);
  };

  const currentProgress = progress.find(p => filesData.find(f => f.unique_name === p.file_id));
  return (
    <Popup
      title={`${update ? 'Update' : 'Add'} Unit Types`}
      subtitle={`${update ? 'Update' : 'Add'} general unit types information here`}
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
        <Col xxl={6} xl={4} md={6}>
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
            <Form.Group controlId="UnitFormTypeImage">
              <div className="ratio ratio-4x3">
                <Dropzone
                  onDrop={onDrop}
                  name="file"
                  accept={FILE_TYPES_IMAGES}
                  maxSize={5242880}
                  onError={error => setFieldError('file', error.message)}
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
        <Col xxl={6} xl={8} md={6}>
          <div className="text-start">
            <Form.Group className="mb-4" controlId="UnitFormTypeName">
              <Form.Label className="popup-form-labels">Unit Type Name</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                placeholder="Enter unit type name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.name && !errors.name}
                isInvalid={touched.name && !!errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
          </div>
        </Col>
      </Row>
    </Popup>
  );
};

export default ProviderHOC(UnitTypesModal);
