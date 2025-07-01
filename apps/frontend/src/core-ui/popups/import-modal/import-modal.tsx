import { Button, Col, Form, Row } from 'react-bootstrap';

import { useFormik } from 'formik';
import { read, utils } from 'xlsx';
import * as Yup from 'yup';

import { Dropzone } from 'components/dropzone';
import { FileAttachments } from 'components/file-attachments';
import { Popup } from 'components/popup';

import { DownloadIcon } from 'core-ui/icons';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { FILE_CSV_EXCEL } from 'constants/file-types';

interface IProps {
  modalTitle: string;
  handleDownload?: () => void;
  keys?: Array<string>;
}

const MediaSchema = Yup.object().shape({
  files: Yup.array()
    .of(Yup.mixed().required('This field is required!'))
    .required('This field is required!')
    .max(1, 'please select at least 1 file'),
});

const ImportModal = ({ modalTitle, handleDownload, keys }: IProps) => {
  const formik = useFormik({
    initialValues: {
      files: [] as Array<File>,
    },
    validationSchema: MediaSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      if (values.files && values.files.length > 0) {
        const file = values.files[0];
        const reader = new FileReader();
        reader.onload = event => {
          let error = false;
          if (event.target) {
            const wb = read(event.target.result);
            const sheets = wb.SheetNames;

            if (sheets.length) {
              const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
              if (rows.length > 0 && keys) {
                const row = rows[0] as object;
                const hasAllKeys = keys.every(item => item in row);
                if (hasAllKeys) {
                  SwalExtended.close({ value: rows, isConfirmed: true, isDismissed: false, isDenied: false });
                  return;
                }
              }
            }

            error = true;
            SwalExtended.hideLoading();
            setSubmitting(false);
          }

          error = true;
          if (error) {
            Notify.show({
              type: 'warning',
              title: 'Either invalid or incomplete data found.',
              description:
                'Unable to parse import file. Please only use template file and do not change any column names!',
            });

            return;
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        setSubmitting(false);
        SwalExtended.hideLoading();
      }
    },
  });

  const { handleSubmit, values, errors, touched, setFieldValue, isSubmitting, setFieldError, dirty, handleReset } =
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
    }
  };

  return (
    <Popup
      title={modalTitle}
      subtitle={'You can import Excel or CSV file formats'}
      onSubmit={handleSubmit}
      onReset={handleReset}
      isSubmitting={isSubmitting}
      disabled={!dirty || values.files.length <= 0}
      successButton="Import"
    >
      <Row className="gy-4 gx-md-4 gx-sm-1 gx-0 align-items-stretch">
        <Col xs={12}>
          <Button variant="link" onClick={handleDownload} className="link-primary px-0 text-decoration-none">
            <DownloadIcon />
            <span className="mx-1">Download Template</span>
          </Button>
          <p className="fw-normal small">You can download a sample template file from here and add details</p>
        </Col>
        <Col xs={12}>
          <Form.Group controlId="GalleryModalImage">
            <div className="ratio ratio-4x3">
              <Dropzone
                name="files"
                multiple={false}
                maxFiles={1}
                onDrop={onDrop}
                onError={error => setFieldError('files', error.message)}
                accept={FILE_CSV_EXCEL}
                maxSize={5242880}
                disabled={values.files.length >= 1}
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
          {values.files.map((file, indx) => (
            <Col key={indx} md={8} xs={12}>
              <FileAttachments
                onRemove={() => {
                  setFieldValue(
                    'files',
                    values.files.filter(value => value.name !== file.name)
                  );
                }}
                file={file}
              />
            </Col>
          ))}
        </Row>
      )}
    </Popup>
  );
};

export default ImportModal;
