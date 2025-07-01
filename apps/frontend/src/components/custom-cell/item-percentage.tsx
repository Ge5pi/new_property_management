interface IItemPercentageProps {
  value?: number | string;
}

const ItemPercentage = ({ value }: IItemPercentageProps) => {
  return <div className="cell-font-size percentage-symbol">{!value || value === '' ? 0 : value}</div>;
};

export default ItemPercentage;
