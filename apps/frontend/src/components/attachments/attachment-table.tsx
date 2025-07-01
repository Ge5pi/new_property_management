import { useCallback } from 'react';
import { Row as ReactTableRow } from 'react-table';

import { getSignedURL } from 'api/core';

import { ItemDate, ItemUserName } from 'components/custom-cell';
import { SimpleTable } from 'components/table';

import { IAttachments } from 'interfaces/IAttachments';

interface IAttachmentsViewTable {
  data?: readonly object[];
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
}

const AttachmentsForViewTable = ({ data = [], ...props }: IAttachmentsViewTable) => {
  return (
    <div className="shadow page-section mb-3">
      <SimpleTable
        {...props}
        data={data}
        shadow={false}
        showTotal={false}
        wrapperClass="detail-section-table"
        showHeaderInsideContainer
        pageHeader={<p className="fw-bold m-0 text-primary">Attachments</p>}
        columns={[
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
        ]}
      />
    </div>
  );
};

export default AttachmentsForViewTable;
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
