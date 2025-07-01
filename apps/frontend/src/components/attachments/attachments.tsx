import { Fragment, useCallback, useState } from 'react';
import { Col, ProgressBar, Row } from 'react-bootstrap';
import { Row as ReactTableRow } from 'react-table';

import { getSignedURL } from 'api/core';

import { ItemDate, ItemUserName } from 'components/custom-cell';
import { Dropzone } from 'components/dropzone';
import { SimpleTable } from 'components/table';

import { Notify } from 'core-ui/toast';

import { useAuthState } from 'hooks/useAuthState';
import { useUploader } from 'hooks/useUploader';

import { FILE_ALL_TYPES } from 'constants/file-types';
import { getReadableError } from 'utils/functions';

import { IAttachments, ModuleType } from 'interfaces/IAttachments';

import { DeleteAttachment } from './attachment-table-cells';

interface IProps {
  uploadInfo: { module: ModuleType; folder?: string };
  disabled?: boolean;
  onUpload?: (data: IAttachments) => Promise<{ data: unknown } | { error: unknown }>;
  onDelete?: (row: object) => Promise<unknown>;
  data?: readonly object[];
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  titleClass?: string;
  uploadPermission?: string;
  deletePermission?: string;
}

const Attachments = ({
  uploadInfo,
  uploadPermission,
  deletePermission,
  disabled,
  onUpload,
  onDelete,
  titleClass,
  data = [],
  ...rest
}: IProps) => {
  const {
    setTotalFiles,
    handleUpload,
    resetProgress,
    totalFiles,
    isUploading,
    progress,
    totalFilesUpload,
    totalUploadProgress,
    filesData,
  } = useUploader(uploadInfo.module, uploadInfo.folder);

  const { isAccessible } = useAuthState();

  const onDrop = (acceptedFiles: Array<File>) => {
    if (!disabled && onUpload && onDelete) {
      const promises: Array<Promise<void>> = [];
      setTotalFiles(prev => {
        const total = prev + acceptedFiles.length;
        acceptedFiles.map(file => {
          promises.push(handleFileUpload(file, total));
          return file;
        });

        return total;
      });

      Promise.all(promises).catch(error => {
        Notify.show({
          type: 'danger',
          title: 'Something went wrong, unable to add record',
          description: getReadableError(error),
        });
      });
    }
  };

  const handleFileUpload = async (file: File, total: number) => {
    if (!disabled && onUpload) {
      handleUpload(file, total)
        .then(async info => {
          const data = {
            name: info?.name,
            file: info.unique_name,
            file_type: info.ext.toUpperCase(),
          };

          onUpload(data);
        })
        .finally(() => {
          resetProgress();
        });
    }
  };

  const handleDeleteAttachment = async (row: ReactTableRow) => {
    if (!disabled && onDelete) {
      await onDelete(row.original);
    }
  };

  const currentFileProgress = progress.find(p => filesData.find(f => f.unique_name === p.file_id));

  const columns = [
    {
      Header: 'Title',
      accessor: 'name',
      Cell: ItemAttachment,
      minWidth: 200,
    },
    {
      Header: 'Type',
      accessor: 'file_type',
    },
    {
      Header: 'Updated at',
      accessor: 'updated_at',
      Cell: ItemDate,
    },
    {
      Header: 'Updated by',
      accessor: 'created_by',
      Cell: ItemUserName,
      minWidth: 200,
    },
    {
      Header: '',
      accessor: 'delete',
      Cell: ({ row }: { row: ReactTableRow }) => (
        <DeleteAttachment onConfirm={() => handleDeleteAttachment(row)} permission={deletePermission} />
      ),
      disableSortBy: true,
      sticky: 'right',
      minWidth: 0,
    },
  ];

  const [error, setError] = useState<string>();

  return (
    <Row className="gx-0 gy-lg-0 gy-3">
      <Col xxl={8} xl={7} lg={8}>
        <SimpleTable
          {...rest}
          data={data}
          shadow={false}
          showTotal={false}
          wrapperClass="detail-section-table"
          newRecordButtonPermission={uploadPermission}
          classes={{ header: titleClass, body: titleClass }}
          showHeaderInsideContainer
          pageHeader={<p className="fw-bold m-0 text-primary">Attachments</p>}
          columns={columns}
        />
      </Col>
      <Col xxl={4} xl={5} lg={4}>
        <div className="p-xl-5 py-5 px-lg-4 px-3 flex-fill">
          <div className="ratio ratio-1x1">
            <Dropzone
              disabled={Boolean(disabled || (uploadPermission && !isAccessible(uploadPermission)))}
              onError={err => setError(err.message)}
              onDrop={onDrop}
              accept={FILE_ALL_TYPES}
              maxSize={5242880}
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          {isUploading && totalFiles > 0 && (
            <Fragment>
              <ProgressBar variant="info" now={Number(totalUploadProgress)} />
              <div className="small d-flex align-items-center mt-1">
                <span className="fw-bold me-1">{`Uploading files: ${totalFilesUpload} of ${totalFiles}`}</span>
                <span className="mx-1"> | </span>
                <span className="ms-1">Current:</span>
                <span className="fw-bold percentage-symbol me-1">
                  {`${currentFileProgress && currentFileProgress.progress ? currentFileProgress.progress : 0}`}
                </span>
                <span className="mx-1"> | </span>
                <span className="ms-1">Total:</span>
                <span className="fw-bold percentage-symbol me-1">{totalUploadProgress}</span>
              </div>
            </Fragment>
          )}
        </div>
      </Col>
    </Row>
  );
};

const ItemAttachment = ({ row, value }: { row: ReactTableRow; value: string }) => {
  const handleAttachmentClick = useCallback((file: string, id?: number) => {
    if (file && id) {
      getSignedURL(file).then(response => {
        if (response.data && response.data.url) {
          window.open(response.data.url, '_blank');
        }
      });
    }
  }, []);

  return (
    <p
      className="text-wrap mb-0 d-inline link link-info cursor-pointer"
      onClick={() => handleAttachmentClick((row.original as IAttachments).file, (row.original as IAttachments).id)}
    >
      {value}
    </p>
  );
};

export default Attachments;
