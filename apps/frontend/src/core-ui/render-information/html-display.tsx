import { CSSProperties } from 'react';

import { clsx } from 'clsx';
import { Markup } from 'interweave';

interface IProps {
  title?: string;
  containerClass?: string;
  disableMargin?: boolean;
  disablePadding?: boolean;
  titleClass?: string;
  value: string;
  style?: CSSProperties;
  className?: string;
}

const HtmlDisplay = ({
  value,
  className,
  containerClass,
  titleClass,
  disablePadding,
  disableMargin,
  title,
  style,
}: IProps) => {
  return (
    <div className={clsx('text-primary', { 'm-0': disableMargin, 'mb-4': !disableMargin }, containerClass)}>
      {title && <h4 className={clsx('h6 mb-1 text-capitalize fw-medium', titleClass)}>{title}</h4>}
      <div
        className={clsx('border mt-2', { 'p-3': !disablePadding }, { 'mb-4': !disableMargin }, className)}
        style={style}
      >
        <Markup content={value} />
      </div>
    </div>
  );
};

export default HtmlDisplay;
