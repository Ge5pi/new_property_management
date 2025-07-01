import { clsx } from 'clsx';

import { DotIcon } from 'core-ui/icons';

interface IItemProps {
  value?: string;
}

const ItemUnitStatus = ({ value }: IItemProps) => {
  if (!value) return <span>-</span>;

  let statusClass = '';
  if (value.toLowerCase() === 'available') {
    statusClass = 'text-success';
  } else if (value.toLowerCase() === 'occupied') {
    statusClass = 'text-danger';
  }

  return (
    <div className={clsx('cell-font-size text-capitalize fw-medium', statusClass)}>
      {value}
      <span className="mx-1">
        <DotIcon />
      </span>
    </div>
  );
};

export default ItemUnitStatus;
