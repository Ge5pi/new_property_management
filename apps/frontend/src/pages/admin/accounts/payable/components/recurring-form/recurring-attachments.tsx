import { Button, Card, Col, Row } from 'react-bootstrap';

import { Table } from 'components/table';

import { TrashIcon } from 'core-ui/icons';

import { IUser } from 'interfaces/IAvatar';

const RecurringAttachments = () => {
  const columns = [
    {
      Header: 'Title',
      accessor: 'name',
      width: '150px',
      disableSortBy: true,
    },
    {
      Header: 'Type',
      accessor: 'file_type',
      width: '100px',
      disableSortBy: true,
    },
    {
      Header: 'Uploaded at',
      accessor: 'uploaded_at',
      Cell: UpdatedAt,
      width: '150px',
      disableSortBy: true,
    },
    {
      Header: 'Uploaded by',
      accessor: 'uploaded_by',
      Cell: UploadedBy,
      width: '150px',
      disableSortBy: true,
    },
    {
      Header: '',
      accessor: 'delete',
      Cell: () => (
        <Button size="sm" variant="outline-danger" className="m-1 remove-file">
          <TrashIcon />
        </Button>
      ),
      disableSortBy: true,
      width: '50px',
    },
  ];

  return (
    <>
      <Card.Header className="border-0 px-0 bg-transparent text-start">
        <Row className="gx-0 align-items-center py-1 flex-wrap">
          <Col>
            <p className="fw-bold m-0 text-primary">Attachment</p>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body className="text-start p-0">
        <Table data={[]} columns={columns} shadow={false} showTotal={false} wrapperClass={'detail-section-table'} />
      </Card.Body>
    </>
  );
};

interface IUserNameProps {
  value: IUser;
}
const UploadedBy = ({ value }: IUserNameProps) => <span>{value.username}</span>;

interface IDateProps {
  value: string;
}
const UpdatedAt = ({ value }: IDateProps) => <span>{new Date(value).toLocaleDateString()}</span>;

export default RecurringAttachments;
