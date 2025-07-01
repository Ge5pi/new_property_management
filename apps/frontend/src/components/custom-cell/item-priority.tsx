import { clsx } from 'clsx';

import { FlagIcon } from 'core-ui/icons';

import { PriorityType } from 'interfaces/IServiceRequests';

interface ItemPriorityProps {
  value?: PriorityType;
}

const ItemPriority = ({ value }: ItemPriorityProps) => {
  if (!value) return <span>-</span>;

  return (
    <div>
      <p
        className={clsx(
          'm-0 cell-font-size',
          { 'text-warning': value === 'NORMAL' },
          { 'text-danger': value === 'URGENT' },
          { 'text-info': value !== 'LOW' }
        )}
      >
        <FlagIcon /> {value}
      </p>
    </div>
  );
};

export default ItemPriority;
