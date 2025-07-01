import { Dispatch, SetStateAction } from 'react';
import { Col, Row } from 'react-bootstrap';

import { useFormikContext } from 'formik';

import { FileAttachments } from 'components/file-attachments';

import { HtmlDisplay } from 'core-ui/render-information';

import { IFileInfo, IUploadProgress } from 'interfaces/IAttachments';
import { IAnnouncementAttachments, ISingleAnnouncement } from 'interfaces/ICommunication';
import { IPropertyAPI } from 'interfaces/IProperties';
import { IUnitsAPI } from 'interfaces/IUnits';

interface IFormInputValues extends ISingleAnnouncement {
  is_all_units?: boolean;
  is_all_properties?: boolean;
  is_selective_units?: boolean;
  is_selective_properties?: boolean;
  old_files: IAnnouncementAttachments[];
  properties: Array<IPropertyAPI>;
  units: Array<IUnitsAPI>;
  files: File[];
}

interface IProps {
  progress: IUploadProgress[];
  setSelectedFiles: Dispatch<SetStateAction<File[]>>;
  filesData: IFileInfo[];
}

const Step02Review = ({ progress, filesData }: IProps) => {
  const { values } = useFormikContext<IFormInputValues>();

  return (
    <div>
      <p className="fw-bold">{values.title}</p>
      <div className="border border-primary border-opacity-25 p-3">
        <HtmlDisplay value={values.body} disableMargin disablePadding className="border-0" />
      </div>
      <Row>
        {values.files.map(file => {
          const currentProgress = progress.find(p => filesData.find(f => f.unique_name === p.file_id));
          const progressed = currentProgress && currentProgress.progress ? currentProgress.progress : 0;

          return (
            <Col key={file.name} xxl={4} xl={6} lg={4} md={6}>
              <FileAttachments progress={progressed} file={file} />
            </Col>
          );
        })}
        {values.old_files.map((file, indx) => (
          <Col key={indx} xxl={4} xl={6} lg={4} md={6}>
            <FileAttachments file={file} />
          </Col>
        ))}
      </Row>

      <p className="mt-5 mb-2">
        <span>No of emails to be sent : </span> {values.send_by_email ? values.units.length : 0}
      </p>
      <p>
        <span>No of tenants receiving this announcement : </span> {values.units.length}
      </p>
    </div>
  );
};

export default Step02Review;
