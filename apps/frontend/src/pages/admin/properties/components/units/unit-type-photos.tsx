import { useParams } from 'react-router-dom';

import useResponse from 'services/api/hooks/useResponse';
import {
  useAddUnitTypePhotoMutation,
  useDeleteUnitTypePhotoMutation,
  useGetUnitTypePhotosQuery,
} from 'services/api/unit-types';

import { Gallery } from 'components/image-gallery';

import { GalleryModel } from 'core-ui/popups/gallery';
import { SuspenseHOC } from 'core-ui/suspense/suspense-hoc';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { getValidID } from 'utils/functions';

import { IPhoto } from 'interfaces/IPhotos';
import { IPhotoUnitTypeID } from 'interfaces/IUnits';

const UnitTypePhotos = () => {
  const { type: unit_type_id } = useParams();
  const photos = useGetUnitTypePhotosQuery(getValidID(unit_type_id));

  // add  property photo
  const [addUnitTypePhoto, { isError: isAddUnitTypePhotoError, error: addUnitTypePhotoError }] =
    useAddUnitTypePhotoMutation();

  useResponse({
    successTitle: 'Your photo has been uploaded!',
    isError: isAddUnitTypePhotoError,
    error: addUnitTypePhotoError,
  });

  // delete  property photo
  const [
    deleteUnitTypePhoto,
    { isSuccess: isDeleteUnitTypePhotoSuccess, isError: isDeleteUnitTypePhotoError, error: deleteUnitTypePhotoError },
  ] = useDeleteUnitTypePhotoMutation();

  useResponse({
    isSuccess: isDeleteUnitTypePhotoSuccess,
    successTitle: 'Photo has been successfully deleted!',
    errorTitle: 'Uh oh, we are unable to delete your photo',
    isError: isDeleteUnitTypePhotoError,
    error: deleteUnitTypePhotoError,
  });

  const uploadMedia = async (photos: Array<IPhoto>) => {
    const promise: Array<Promise<unknown>> = [];
    photos.map(photo => {
      if (!isNaN(Number(unit_type_id)) && Number(unit_type_id) > 0) {
        const data = {
          ...photo,
          unit_type: Number(unit_type_id),
        };

        promise.push(addUnitTypePhoto(data));
      }
      return photo;
    });

    return await Promise.all(promise);
  };

  const handleGalleryUpload = () => {
    //upload image
    if (!isNaN(Number(unit_type_id)) && Number(unit_type_id) > 0) {
      SweetAlert({
        html: <GalleryModel uploadMedia={uploadMedia} moduleName={'properties'} />,
      }).fire({
        allowOutsideClick: () => !SwalExtended.isLoading(),
      });
    }
  };

  const handleMediaRemoved = async (photo: IPhotoUnitTypeID) => {
    if (!isNaN(Number(unit_type_id)) && Number(unit_type_id) > 0 && photo && photo.id) {
      return await deleteUnitTypePhoto(photo.id);
    }

    return Promise.reject('Incomplete data found');
  };

  return <Gallery handleMediaRemoved={handleMediaRemoved} onUpload={handleGalleryUpload} photos={photos} />;
};

export default SuspenseHOC(UnitTypePhotos);
