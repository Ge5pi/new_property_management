import { Avatar } from 'core-ui/user-avatar';

import { IUser } from 'interfaces/IAvatar';

interface IProps {
  value?: string | IUser;
}

const ItemUserName = ({ value }: IProps) => {
  if (!value) return <span>-</span>;
  const name =
    typeof value === 'string'
      ? value
      : value.first_name && value.last_name
        ? `${value.first_name} ${value.last_name}`
        : (value.username ?? '-');

  if (name === '-') return <span>-</span>;
  return <Avatar name={name} size={30} showName suffixClassName="cell-font-size" />;
};

export default ItemUserName;
