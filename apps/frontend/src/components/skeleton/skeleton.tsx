import { Fragment } from 'react';
import { Placeholder, PlaceholderButtonProps, PlaceholderProps } from 'react-bootstrap';
import { PlaceholderSize } from 'react-bootstrap/esm/usePlaceholder';

declare type ISinglePlaceholderProps = {
  lines?: number;
} & Omit<PlaceholderProps, 'animation' | 'bg'>;

const SingleSkeleton = ({ as = 'div', ...props }: ISinglePlaceholderProps) => {
  if (props.lines && props.lines > 0) {
    return (
      <Fragment>
        {Array(props.lines)
          .fill(0)
          .map((_, i) => (
            <InlineSkeleton key={i} xs={12} />
          ))}
      </Fragment>
    );
  }

  return (
    <Placeholder as={as} animation="wave">
      <InlineSkeleton {...props} bg="placeholder" />
    </Placeholder>
  );
};

export default SingleSkeleton;

declare type IButtonPlaceholderProps = Omit<PlaceholderButtonProps, 'animation' | 'bg'>;
export const ButtonSkeleton = (props: IButtonPlaceholderProps) => {
  return <Placeholder.Button {...props} xs={6} bg="placeholder" animation="wave" />;
};

export const InlineSkeleton = ({ bg = 'placeholder', ...props }: PlaceholderProps) => {
  return <Placeholder {...props} bg={bg} />;
};

interface DescriptionSkeletonProps {
  size?: PlaceholderSize;
  single?: boolean;
}

export const DescriptionSkeleton = ({ single, size }: DescriptionSkeletonProps) => {
  return (
    <Placeholder size={size} as="div" animation="wave">
      {single ? (
        <InlineSkeleton bg="placeholder" as={'p'} xs={10} />
      ) : (
        <Fragment>
          <InlineSkeleton xs={7} bg="placeholder" /> <InlineSkeleton bg="placeholder" xs={4} />{' '}
          <InlineSkeleton bg="placeholder" xs={4} />
          <InlineSkeleton xs={6} bg="placeholder" /> <InlineSkeleton bg="placeholder" xs={8} />
        </Fragment>
      )}
    </Placeholder>
  );
};

declare type AspectRatio = '1x1' | '4x3' | '16x9' | '21x9';
interface ImageSkeletonProps extends Omit<PlaceholderProps, 'animation' | 'className' | 'bg'> {
  size?: AspectRatio;
}
export const ImageSkeleton = ({ size = '16x9', as, ...rest }: ImageSkeletonProps) => {
  return (
    <Placeholder as={as} bg="placeholder" animation="wave" className="border-0 bg-transparent">
      <InlineSkeleton {...rest} className={`ratio ratio-${size}`} />
    </Placeholder>
  );
};
