import { useState } from 'react';

import { Confirmation, PleaseWait } from 'components/alerts';

import { DeleteBtn } from 'core-ui/delete-btn';
import { SwalExtended } from 'core-ui/sweet-alert';

import { useAuthState } from 'hooks/useAuthState';

import { IUser } from 'interfaces/IAvatar';

interface IUserNameProps {
  value: IUser;
}
export const UploadedBy = ({ value }: IUserNameProps) => <span>{value.username}</span>;

interface IDateProps {
  value: string;
}
export const UpdatedAt = ({ value }: IDateProps) => <span>{new Date(value).toLocaleDateString()}</span>;

interface IDeleteAttachmentProps {
  onConfirm: () => Promise<void>;
  permission?: string;
}

export const DeleteAttachment = ({ onConfirm, permission }: IDeleteAttachmentProps) => {
  const [disabled, setDisabled] = useState(false);
  const { isAccessible } = useAuthState();

  const handleDelete = () => {
    Confirmation({
      title: 'Delete',
      type: 'danger',
      description: 'Are you sure you want to delete this attachment?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        onConfirm().finally(() => {
          SwalExtended.close();
          setDisabled(false);
        });
      }
    });
  };

  if (permission && !isAccessible(permission)) return null;
  return (
    <div className="text-center action-btns">
      <DeleteBtn resetCSS disabled={disabled} onClick={handleDelete} />
    </div>
  );
};
