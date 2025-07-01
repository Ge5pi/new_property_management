import { Badge } from 'react-bootstrap';

import { GeneralLabels } from 'interfaces/ISettings';

interface ILabel {
  value?: GeneralLabels | string | number;
}

const ItemLabel = ({ value }: ILabel) => {
  if (!value) return <span>-</span>;
  return (
    <Badge pill bg="transparent" className="border border-primary text-primary border-1">
      {typeof value === 'string' || typeof value === 'number' ? value : value.name}
    </Badge>
  );
};

export default ItemLabel;
