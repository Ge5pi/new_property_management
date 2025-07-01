import { Avatar } from 'core-ui/user-avatar';

import { ISingleTenant } from 'interfaces/ITenant';

interface IItemTenantProps {
  value?: string | ISingleTenant;
}

const ItemTenant = ({ value }: IItemTenantProps) => {
  if (!value) return <span>-</span>;
  const name =
    typeof value === 'string'
      ? value
      : value.first_name && value.last_name
        ? `${value.first_name} ${value.last_name}`
        : '-';

  return (
    <div className="me-5 cell-font-size">
      {name === '-' ? name : <Avatar name={name} size={30} showName suffixClassName="cell-font-size" />}
    </div>
  );
};

export default ItemTenant;
