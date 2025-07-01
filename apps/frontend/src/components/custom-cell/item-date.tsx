import { displayDate } from 'utils/functions';

const ItemDate = ({ value }: { value?: string }) => {
  return <span className="cell-font-size">{displayDate(value)}</span>;
};

export default ItemDate;
