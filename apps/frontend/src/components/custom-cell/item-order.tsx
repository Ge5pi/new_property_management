interface IProps {
  value?: { slug: string; name: string };
}

const ItemOrder = ({ value }: IProps) => {
  if (!value) return <span>-</span>;

  return (
    <div className="fw-medium cell-font-size">
      <span className="text-uppercase fw-bold">{value.slug}</span>
      <p className="text-info">{value.name}</p>
    </div>
  );
};

export default ItemOrder;
