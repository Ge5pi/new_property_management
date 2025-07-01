import { Stack } from 'react-bootstrap';

import { RecurringIcon } from 'core-ui/icons';

interface IItemProps {
  value?: { id: string | number; slug: string; is_recurring: boolean };
}

const ItemWorkOrder = ({ value }: IItemProps) => {
  if (!value) return <span>-</span>;

  const { is_recurring, slug } = value;
  return (
    <Stack direction="horizontal" className="cell-font-size justify-content-start" gap={2}>
      <span className="text-uppercase fw-bold">{slug}</span>
      {is_recurring && (
        <div className="d-flex align-items-center text-muted">
          <span className="mx-1">
            <RecurringIcon />
          </span>
          <span>Recurring</span>
        </div>
      )}
    </Stack>
  );
};

export default ItemWorkOrder;
