import { useParams } from 'react-router-dom';

import useResponse from 'services/api/hooks/useResponse';
import {
  useAddPropertyPhotoMutation,
  useDeletePropertyPhotoMutation,
  useGetPropertyPhotosQuery,
} from 'services/api/properties';

import { Gallery } from 'components/image-gallery';

import { GalleryModel } from 'core-ui/popups/gallery';
import { SuspenseHOC } from 'core-ui/suspense/suspense-hoc';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { getValidID } from 'utils/functions';

import { IPhoto } from 'interfaces/IPhotos';
import { IPhotoPropertyID } from 'interfaces/IProperties';

const PropertyPhotos = () => {
  const { property: property_id } = useParams();
  const photos = useGetPropertyPhotosQuery(getValidID(property_id));

  // add  property photo
  const [addPropertyPhoto, { isError: isAddPropertyPhotoError, error: addPropertyPhotoError }] =
    useAddPropertyPhotoMutation();

  useResponse({
    successTitle: 'Your photo has been uploaded!',
    isError: isAddPropertyPhotoError,
    error: addPropertyPhotoError,
  });

  // delete  property photo
  const [
    deletePropertyPhoto,
    { isSuccess: isDeletePropertyPhotoSuccess, isError: isDeletePropertyPhotoError, error: deletePropertyPhotoError },
  ] = useDeletePropertyPhotoMutation();

  useResponse({
    isSuccess: isDeletePropertyPhotoSuccess,
    successTitle: 'Photo has been successfully deleted!',
    errorTitle: 'Uh oh, we are unable to delete your photo',
    isError: isDeletePropertyPhotoError,
    error: deletePropertyPhotoError,
  });

  const uploadMedia = async (photos: Array<IPhoto>) => {
    const promise: Array<Promise<unknown>> = [];
    photos.map(photo => {
      if (!isNaN(Number(property_id)) && Number(property_id) > 0) {
        const data = {
          ...photo,
          parent_property: Number(property_id),
        };

        promise.push(addPropertyPhoto(data));
      }
      return photo;
    });

    return await Promise.all(promise);
  };

  const handleGalleryUpload = () => {
    //upload image
    if (!isNaN(Number(property_id)) && Number(property_id) > 0) {
      SweetAlert({
        html: <GalleryModel uploadMedia={uploadMedia} moduleName={'properties'} />,
      }).fire({
        allowOutsideClick: () => !SwalExtended.isLoading(),
      });
    }
  };

  const handleMediaRemoved = async (photo: IPhotoPropertyID) => {
    if (!isNaN(Number(property_id)) && Number(property_id) > 0 && photo && photo.id) {
      return await deletePropertyPhoto(photo.id);
    }

    return Promise.reject('Incomplete data found');
  };

  return <Gallery handleMediaRemoved={handleMediaRemoved} onUpload={handleGalleryUpload} photos={photos} />;
};

export default SuspenseHOC(PropertyPhotos);
