import { Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { clsx } from 'clsx';

interface ICustomTableHeaderProps {
  heading?: string;
  headingClassName?: string;
  url?: string;
}

const CustomTableHeader = ({ heading = 'Recent', headingClassName = '', url = '' }: ICustomTableHeaderProps) => {
  return (
    <Stack direction="horizontal" className="align-items-center justify-content-between">
      <p className={clsx('fs-6 fw-medium mb-0', headingClassName)}>{heading}</p>
      <Link className="btn btn-link p-0 x-small link-primary" to={url}>
        view all
      </Link>
    </Stack>
  );
};

export default CustomTableHeader;
