import { ReactNode, useMemo, useState } from 'react';
import { Button, ButtonProps, OverlayTrigger, Popover } from 'react-bootstrap';

import { clsx } from 'clsx';

import { MoreHIcon } from 'core-ui/icons';

import { useAuthState } from 'hooks/useAuthState';

interface DropdownButtons extends ButtonProps {
  text: ReactNode;
  permission?: string;
}

interface IProps {
  actions: Array<DropdownButtons>;
  className?: string;
}

const MoreOptions = ({ actions, className }: IProps) => {
  const [show, setShow] = useState(false);
  const { isAccessible } = useAuthState();

  const isAllInaccessible = useMemo(() => {
    return actions.every(({ permission }) => {
      if (permission && !isAccessible(permission)) return true;
      return false;
    });
  }, [actions, isAccessible]);

  return (
    <div className={clsx(className, { 'd-none': isAllInaccessible })}>
      <OverlayTrigger
        flip
        rootClose
        show={show}
        trigger="click"
        onToggle={next => setShow(next)}
        placement="bottom-end"
        overlay={overlayProps => (
          <Popover
            {...overlayProps}
            className="stay-on-top dropdown-menu show"
            arrowProps={{ style: { display: 'none' } }}
          >
            {actions
              .filter(({ permission }) => {
                if (permission && !isAccessible(permission)) return false;
                return true;
              })
              .map((action, i) => (
                <Button
                  key={i}
                  {...action}
                  className={clsx(action.className, 'dropdown-item')}
                  onClick={ev => {
                    setShow(false);
                    if (action.onClick) action.onClick(ev);
                  }}
                >
                  {action.text}
                </Button>
              ))}
          </Popover>
        )}
      >
        <Button variant="light" className="p-1 border-0 action-btns btn-more-options-toggle">
          <MoreHIcon />
        </Button>
      </OverlayTrigger>
    </div>
  );
};

export default MoreOptions;
