import { useCallback, useEffect, useMemo, useState } from 'react';

import { IPhoto } from 'interfaces/IPhotos';

export const usePhoto = (photo?: Partial<IPhoto>) => {
  const [preview, setPreview] = useState<string | undefined>();
  const [photoDetails, setPreviewPhotoDetails] = useState<Partial<IPhoto> | undefined>();

  useEffect(() => {
    if (photo && photo.image) {
      setPreview(photo.image);
      setPreviewPhotoDetails(photo);
      return;
    }

    setPreview(undefined);
    setPreviewPhotoDetails(undefined);
  }, [photo]);

  const hasImage = useMemo(() => {
    return photo && photo.image ? true : false;
  }, [photo]);

  const updatePreview = useCallback((image?: string) => setPreview(image), []);
  return { preview, hasImage, photoDetails, updatePreview };
};
