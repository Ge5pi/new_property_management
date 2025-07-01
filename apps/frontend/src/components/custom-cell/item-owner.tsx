import { Fragment } from 'react';
import { Stack } from 'react-bootstrap';

import { clsx } from 'clsx';

import { GroupedAvatars } from 'core-ui/user-avatar';

import { NameInitialsAvatarProps } from 'interfaces/IAvatar';
import { ISinglePeopleOwner } from 'interfaces/IPeoples';

interface IProps {
  value?: Array<ISinglePeopleOwner | string>;
}

const ItemOwner = ({ value }: IProps) => {
  if (!value) return <span>-</span>;

  const data: Array<NameInitialsAvatarProps> = [];
  value.map(item => {
    let name = '';
    if (typeof item === 'string') {
      name = item;
    } else {
      name = `${item.first_name} ${item.last_name}`;
    }

    return data.push({
      size: 30,
      name: name ?? '*',
      suffixClassName: 'avatar-text cell-font-size-subtitle',
    });
  });

  return (
    <Stack direction="horizontal" className={clsx({ 'mx-sm-3 ms-3': value.length > 0 })}>
      {value.length > 0 ? (
        <Fragment>
          <GroupedAvatars data={data} maxAvatar={2} />
          {value.length > 2 && <div className="small text-muted ms-2 mt-1">+{value.length - 2} More</div>}
        </Fragment>
      ) : (
        '-'
      )}
    </Stack>
  );
};

export default ItemOwner;
