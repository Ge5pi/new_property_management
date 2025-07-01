import { displayDate } from 'utils/functions';

interface IUpdatedBy {
  name: string;
  updated_at: string;
}

interface IItemUpdatedByProps {
  value?: IUpdatedBy;
}

const ItemUpdatedBy = ({ value }: IItemUpdatedByProps) => {
  if (!value) return <span>-</span>;

  return (
    <div>
      <p className="cell-font-size fw-bold m-0 text-black-50" style={{ lineHeight: 1.5 }}>
        {value.name}
      </p>
      <p className="text-capitalize small text-muted m-0" style={{ lineHeight: 1.25 }}>
        {displayDate(value.updated_at, 'MM/DD/YYYY hh:mm A')}
      </p>
    </div>
  );
};

export default ItemUpdatedBy;
