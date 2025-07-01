import { CSSProperties, ImgHTMLAttributes, useEffect, useState } from 'react';
import { Image, ImageProps } from 'react-bootstrap';
import { createPortal } from 'react-dom';

import { clsx } from 'clsx';

import { useInViewport } from './hooks/useInViewport';
import { useLazyImage } from './hooks/useLazyImage';

import './lazy-image.styles.css';

interface IProps extends ImageProps, Omit<ImgHTMLAttributes<HTMLImageElement>, 'placeholder' | 'onLoad'> {
  text?: string;
  preview?: boolean;
  showShadow?: boolean;
  size?: '1x1' | '4x3' | '16x9' | '21x9' | 'sm';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  wrapperStyle?: CSSProperties;
  wrapperClass?: string;
  border?: boolean;
}

const LazyImage = ({
  preview = true,
  size = '1x1',
  objectFit = 'cover',
  src,
  style,
  className,
  wrapperClass = '',
  wrapperStyle,
  border,
  ...rest
}: IProps) => {
  const { isInViewport, ref } = useInViewport();
  const { image, setError } = useLazyImage(src, isInViewport);

  const [lightbox, setLightBox] = useState(false);
  const toggleLightbox = () => {
    if (image && preview) setLightBox(prev => !prev);
  };

  useEffect(() => {
    if (lightbox) {
      document.body.classList.add('lazyImage-overflow-hidden');
    } else {
      document.body.classList.remove('lazyImage-overflow-hidden');
    }
  }, [lightbox]);

  return (
    <div
      className={clsx(
        'ratio',
        { [`ratio-1x1`]: size === 'sm' },
        { [`ratio-${size}`]: size !== 'sm' },
        { 'border border-2 border-dark rounded-2': border },
        wrapperClass
      )}
      style={{
        width: size === 'sm' ? 70 : undefined,
        height: size === 'sm' ? 70 : undefined,
        ...wrapperStyle,
      }}
    >
      <Image
        {...rest}
        ref={ref}
        src={image}
        onClick={toggleLightbox}
        className={clsx('skeleton_image', className)}
        onError={() => setError(true)}
        onLoad={() => setError(false)}
        style={{ ...style, objectFit }}
      />
      {image &&
        lightbox &&
        createPortal(
          <div className={clsx('lightbox-preview', { open: lightbox })} onClick={toggleLightbox}>
            <div className="inner">
              <Image className="skeleton_image" src={image} />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default LazyImage;
