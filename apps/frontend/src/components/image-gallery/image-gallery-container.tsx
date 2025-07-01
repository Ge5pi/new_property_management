import { MouseEventHandler, lazy } from 'react';
import { Button } from 'react-bootstrap';

import { clsx } from 'clsx';

import { ApiResponseWrapper } from 'components/api-response-wrapper';

import { InformationSkeleton, InlineSkeleton } from 'components/skeleton';

import { HScroll } from 'core-ui/h-scroll';

const GalleryWrapper = lazy(() => import('components/image-gallery/image-gallery-wrapper'));
const GalleryItem = lazy(() => import('components/image-gallery/gallery-item'));

interface IProps<T, M> {
  onUpload?: MouseEventHandler<HTMLButtonElement> | undefined;
  handleMediaRemoved: (photo: M) => Promise<{ data: string | number } | { error: unknown }>;
  photos: {
    isFetching?: boolean;
    isLoading?: boolean;
    isError?: boolean;
    error?: unknown;
    data?: T;
  };
}

const ImageGalleryContainer = <T, M>({ onUpload, handleMediaRemoved, photos }: IProps<T, M>) => {
  return (
    <GalleryWrapper onUpload={onUpload}>
      <ApiResponseWrapper
        {...photos}
        showMiniError
        loadingComponent={
          <div className="position-relative" style={{ minHeight: 200 }}>
            <InformationSkeleton skeletonType="column" columnCount={3} sm={4} xs={6}>
              <InlineSkeleton className="ratio ratio-1x1" />
            </InformationSkeleton>
          </div>
        }
        renderIfNoResult={
          <div className="position-relative" style={{ minHeight: 200 }}>
            <InformationSkeleton skeletonType="column" columnCount={3} sm={4} xs={6}>
              <InlineSkeleton className="ratio ratio-1x1" />
            </InformationSkeleton>
            <div className="position-absolute top-50 start-50 translate-middle col-lg-auto col-sm-6 col-12">
              <div className="py-lg-4 px-lg-5 py-md-3 px-md-4 p-3 text-center shadow bg-white">
                <h6 className="text-primary fw-bold">You have no photos yet</h6>
                <p className="text-muted small fw-normal">Upload your property photos here</p>
                <Button onClick={onUpload}>Upload your first photo</Button>
              </div>
            </div>
          </div>
        }
        renderResults={photoList => {
          if (!Array.isArray(photoList)) {
            return (
              <div className="d-flex align-items-center justify-content-center flex-column">
                <p className="text-danger">
                  The server received an invalid response from the backend, please contact support
                </p>
              </div>
            );
          }

          return (
            <HScroll
              overlapArrows
              scrollVisible
              scrollContainerClassName="row gx-sm-2 gx-1 gy-2 pb-3 flex-nowrap"
              itemClassName={clsx({
                'col-xxl-3 col-lg-4 col-md-5 col-sm-6 col-12': photoList.length > 0,
                'col-12': photoList.length <= 0,
              })}
            >
              {photoList.map((photo, ix) => (
                <GalleryItem
                  key={ix}
                  url={photo.image}
                  isCover={photo.is_cover}
                  onDelete={() => handleMediaRemoved(photo)}
                />
              ))}
            </HScroll>
          );
        }}
      />
    </GalleryWrapper>
  );
};

export default ImageGalleryContainer;
