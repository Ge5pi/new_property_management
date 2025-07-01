const ItemSlug = ({ value }: { value?: string }) => {
  const slug = value ? value : '-';
  return <span className="cell-font-size text-uppercase fw-bold">{slug}</span>;
};

export default ItemSlug;
