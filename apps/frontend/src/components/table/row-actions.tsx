import { ReactNode, useMemo } from 'react';
import { Button, ButtonProps, Stack } from 'react-bootstrap';

import { clsx } from 'clsx';

import { DeleteBtn } from 'core-ui/delete-btn';
import { EditBtn } from 'core-ui/edit-button';

import { useAuthState } from 'hooks/useAuthState';

interface ActionButtons extends ButtonProps {
  resetCSS?: boolean;
  icon: ReactNode | 'edit' | 'delete';
  showText?: boolean;
  permission?: string;
  text?: string;
}

interface IProps {
  actions: Array<ActionButtons>;
  className?: string;
}

const RowActions = ({ actions, className }: IProps) => {
  const { isAccessible } = useAuthState();
  const isAllInaccessible = useMemo(() => {
    return actions.every(({ permission }) => {
      if (permission && !isAccessible(permission)) return true;
      return false;
    });
  }, [actions, isAccessible]);

  return (
    <Stack direction="horizontal" className={clsx(className, { 'd-none': isAllInaccessible })} gap={3}>
      {actions
        .filter(({ permission }) => {
          if (permission && !isAccessible(permission)) return false;
          return true;
        })
        .map((action, inx) => {
          const resetStyle = action.resetCSS ?? false;
          const renderText = action.showText ?? false;
          const defaultClass = clsx('p-0', action.className);

          if (action.icon === 'edit') {
            return <EditBtn key={inx} {...action} showText={renderText} className={defaultClass} />;
          }

          if (action.icon === 'delete') {
            return (
              <DeleteBtn key={inx} {...action} showText={renderText} resetCSS={resetStyle} className={defaultClass} />
            );
          }

          return (
            <Button key={inx} {...action} className={clsx('d-inline-flex align-items-center', defaultClass)}>
              {action.icon}
              {action.text && <span className="ms-1">{action.text}</span>}
            </Button>
          );
        })}
    </Stack>
  );
};

export default RowActions;
