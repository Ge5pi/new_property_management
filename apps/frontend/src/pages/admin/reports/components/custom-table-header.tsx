import { Button, Stack } from 'react-bootstrap';

import { ExportIcon } from 'core-ui/icons';

interface ICustomTableHeaderProps {
  handleCreateNewRecord: () => void;
  total: number;
}

const CustomTableHeader = ({ handleCreateNewRecord, total }: ICustomTableHeaderProps) => {
  return (
    <Stack direction="horizontal" className="align-items-center justify-content-between">
      <p className="fs-6 fw-bold mb-0">
        Total <span className="mx-1"> :</span>
        {total}
      </p>
      <Button variant={'outline-primary'} size="sm" className="btn-search-adjacent-sm" onClick={handleCreateNewRecord}>
        <ExportIcon /> <span className="ms-2">Export</span>
      </Button>
    </Stack>
  );
};

export default CustomTableHeader;
