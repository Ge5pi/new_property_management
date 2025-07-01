import { useMemo } from 'react';

import { Avatar } from 'core-ui/user-avatar';

import { getStringPersonName } from 'utils/functions';

import { IUser } from 'interfaces/IAvatar';
import { IOwner, IVendor } from 'interfaces/IPeoples';
import { ITenantAPI } from 'interfaces/ITenant';

interface IProps {
  option: IUser | ITenantAPI | IOwner | IVendor;
}

const ItemMenuItem = ({ option }: IProps) => {
  const icon = useMemo(() => {
    return getStringPersonName(option);
  }, [option]);
  return (
    <div className="text-truncate small">
      <Avatar name={icon} size={25} showName />
    </div>
  );
};

export default ItemMenuItem;
