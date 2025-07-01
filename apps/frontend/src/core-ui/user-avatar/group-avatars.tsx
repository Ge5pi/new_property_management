import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Fragment } from 'react/jsx-runtime';

import { NameInitialsAvatarProps } from 'interfaces/IAvatar';

import Avatar from './avatar';

import './user-avatar.styles.css';

interface IProps {
  data: Array<NameInitialsAvatarProps>;
  maxAvatar?: number;
}

const GroupAvatars = ({ data = [], maxAvatar = 3 }: IProps) => {
  return (
    <div className="grouped-avatars">
      {data.map((item, index) => {
        if (index < maxAvatar) {
          return (
            <Fragment key={index}>
              <OverlayTrigger
                overlay={tooltipProps => (
                  <Tooltip {...tooltipProps} id={`tooltip-${index}-${item.name.replaceAll(' ', '_')}`}>
                    {item.name}
                  </Tooltip>
                )}
              >
                <div
                  style={{
                    width: item.size || 32,
                    height: item.size || 32,
                  }}
                  className="grouped-avatar-container"
                >
                  <Avatar {...item} bgClassName="bg-white" />
                </div>
              </OverlayTrigger>
            </Fragment>
          );
        }

        return null;
      })}
    </div>
  );
};

export default GroupAvatars;
