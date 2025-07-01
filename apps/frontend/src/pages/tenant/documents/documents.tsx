import { Table } from 'components/table';

import { FileIcon } from 'core-ui/icons';

import TitleSearchFilter from './components/title-search-filter';

function Documents() {
  const Documents = [
    {
      id: '1',
      document_name: 'Charge',
      category: 'demo category',
      updated_date: '12/12/2021',
      size: '4.3',
    },
  ];

  const columns = [
    {
      Header: 'Document name',
      accessor: 'document_name',
      width: '150px',
      Cell: () => (
        <>
          <FileIcon size="18" /> <u className="text-info">report.pdf</u>
        </>
      ),
    },
    {
      Header: 'Category',
      accessor: 'category',
      width: '100px',
    },
    {
      Header: 'Updated date',
      accessor: 'updated_date',
      width: '150px',
    },
    {
      Header: 'Size',
      accessor: 'size',
      width: '150px',
      Cell: () => <span>4.3mb</span>,
    },
  ];

  return (
    <>
      <TitleSearchFilter />
      <Table data={Documents} columns={columns} total={Documents.length} showTotal />
    </>
  );
}

export default Documents;
