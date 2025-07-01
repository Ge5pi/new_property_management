import { Col, Form, Row } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Dropzone } from 'components/dropzone';
import { FileAttachments } from 'components/file-attachments';
import { Popup } from 'components/popup';

import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { useUploader } from 'hooks/useUploader';

import { FILE_TYPES_IMAGES } from 'constants/file-types';
import { getReadableError } from 'utils/functions';

import { IFileInfo, ModuleType } from 'interfaces/IAttachments';
import { IPhoto } from 'interfaces/IPhotos';

interface IProps {
  uploadMedia: (photos: Array<IPhoto>) => Promise<unknown[]>;
  moduleName: ModuleType;
}

const MediaSchema = Yup.object().shape({
  file: Yup.array().of(Yup.mixed().required('This field is required!')).min(1, 'please select at least 1 file'),
});

const GalleryModel = ({ uploadMedia, moduleName }: IProps) => {
  const { setTotalFiles, handleUpload, totalFiles, progress, filesData, totalFilesUpload, totalUploadProgress } =
    useUploader(moduleName, 'image-gallery');

  const handleFormSubmission = async (files: File[]) => {
    let photos: Array<IPhoto> = [];
    const promises: Array<Promise<IFileInfo>> = [];

    files.map(file => promises.push(handleUpload(file)));
    await Promise.all(promises).then(results => {
      photos = results.map(result => ({
        image: result.unique_name,
        is_cover: false,
      }));
    });

    return await uploadMedia(photos).then(() => {
      SwalExtended.close();
      Notify.show({
        type: 'success',
        title: 'Successfully uploaded media',
      });
    });
  };

  const formik = useFormik({
    initialValues: {
      files: [] as Array<File>,
    },
    validationSchema: MediaSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      if (values.files && values.files.length > 0) {
        setSubmitting(true);
        SwalExtended.showLoading();

        handleFormSubmission(values.files)
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
      } else {
        setSubmitting(false);
        SwalExtended.hideLoading();
      }
    },
  });

  const { handleSubmit, values, errors, touched, setFieldValue, setFieldError, isSubmitting, dirty, handleReset } =
    formik;

  const onDrop = (acceptedFiles: Array<File>) => {
    if (acceptedFiles.length) {
      let files = acceptedFiles;
      if (values.files && Array.isArray(values.files)) {
        const initialValue = values.files as File[];
        files = [...files, ...initialValue];
        files = files.filter((value, index, self) => index === self.findIndex(t => t.name === value.name));
      }

      setFieldValue('files', files);
      setTotalFiles(files.length);
    }
  };

  const currentProgress = progress.find(p => filesData.find(f => f.unique_name === p.file_id));
  return (
    <Popup
      title={'Add Media'}
      successButton="Upload"
      subtitle={'add media into the gallery from here.'}
      onSubmit={handleSubmit}
      onReset={handleReset}
      isSubmitting={isSubmitting}
      disabled={!dirty}
      progress={{
        uploaded: totalFilesUpload,
        progress: currentProgress && currentProgress.progress ? currentProgress.progress : 0,
        totalProgress: totalUploadProgress,
        show: Boolean(values.files.length > 0),
        total: totalFiles,
      }}
    >
      <Row className="gy-md-0 gy-3 gx-md-4 gx-sm-1 gx-0 align-items-stretch">
        <Col xs={12}>
          <Form.Group controlId="GalleryModalImage">
            <div className="ratio ratio-4x3">
              <Dropzone
                name="files"
                onError={error => setFieldError('files', error.message)}
                onDrop={onDrop}
                accept={FILE_TYPES_IMAGES}
                maxSize={5242880}
              />
            </div>
            <Form.Control.Feedback type="invalid" className={touched.files && !!errors.files ? 'd-block' : 'd-none'}>
              {errors.files?.toString()}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      {values.files.length > 0 && (
        <Row className="gx-0 align-items-stretch justify-content-end">
          {values.files.map((file, indx) => {
            const currentFileProgress = progress.find(p =>
              filesData.find(
                f => f.unique_name === p.file_id && `${f.name}.${f.ext}`.toLowerCase() === file.name.toLowerCase()
              )
            );
            const progressed = currentFileProgress && currentFileProgress.progress ? currentFileProgress.progress : 0;
            return (
              <Col key={indx} md={6}>
                <FileAttachments
                  onRemove={() => {
                    setFieldValue(
                      'files',
                      values.files.filter(value => value.name !== file.name)
                    );

                    setTotalFiles(prev => prev - 1);
                  }}
                  progress={progressed}
                  file={file}
                />
              </Col>
            );
          })}
        </Row>
      )}
    </Popup>
  );
};

export default GalleryModel;
