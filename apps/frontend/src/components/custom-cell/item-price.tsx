import { clsx } from 'clsx';

import { formatPricing, isNegativeNumber } from 'utils/functions';

interface IItemPriceProps {
  value?: number | string;
}

const ItemPrice = ({ value }: IItemPriceProps) => {
  return (
    <div
      className={clsx(
        {
          '-ive': isNegativeNumber(value),
        },
        'cell-font-size price-symbol'
      )}
    >
      {formatPricing(value)}
    </div>
  );
};

export default ItemPrice;
