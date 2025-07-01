import { useState } from 'react';
import { Badge } from 'react-bootstrap';

import { Confirmation, PleaseWait } from 'components/alerts';

import { DeleteBtn } from 'core-ui/delete-btn';
import { LazyImage } from 'core-ui/lazy-image';
import { SwalExtended } from 'core-ui/sweet-alert';

interface IImageProps {
  url: string;
  isCover?: boolean;
  onDelete?: () => Promise<{ data: string | number } | { error: unknown }>;
}

const GalleryItem = ({ url = '', onDelete, isCover }: IImageProps) => {
  const [disabled, setDisabled] = useState(false);
  const handleImageRemove = () => {
    if (onDelete) {
      Confirmation({
        title: 'Delete',
        type: 'danger',
        description: 'Are you sure you want to delete this photo?',
      }).then(result => {
        if (result.isConfirmed) {
          PleaseWait();
          setDisabled(true);
          onDelete().finally(() => {
            SwalExtended.close();
            setDisabled(false);
          });
        }
      });
    }
  };

  return (
    <div className="image-container position-relative">
      {isCover ? (
        <Badge className="m-3 position-absolute top-0 start-0" pill bg="info" style={{ zIndex: 1250 }}>
          cover
        </Badge>
      ) : (
        <DeleteBtn
          resetCSS
          className="position-absolute rounded-circle bg-white end-0 m-3"
          style={{ zIndex: 1060 }}
          onClick={handleImageRemove}
          disabled={disabled}
        />
      )}
      <LazyImage src={url} draggable={false} />
    </div>
  );
};

export default GalleryItem;
