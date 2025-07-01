import { ComponentType, ContextType, ReactElement, WheelEvent, isValidElement, useContext } from 'react';
import { Stack } from 'react-bootstrap';
import { Props, ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';

import { clsx } from 'clsx';

import { ArrowLeft, ArrowRight } from 'core-ui/icons';

import usePreventBodyScroll from './hooks/usePreventBodyScroll';

import 'react-horizontal-scrolling-menu/dist/styles.css';

import './h-scroll.styles.css';

declare type Position = 'center' | 'start' | 'end';
declare type TitleType = ReactElement | string;
interface IProps extends Props {
  headerTitle?: TitleType;
  subtitle?: TitleType;
  arrowsPos?: { show: 'head' | 'footer'; position: Position };
  scrollWithWheel?: boolean;
  scrollVisible?: boolean;
  overlapArrows?: boolean;
  arrows?: boolean;
}

export const ScrollHOC = (ReactComponent: ComponentType<IProps>) => {
  const WithScroll = ({ scrollWithWheel, ...props }: IProps) => {
    const { disableScroll, enableScroll } = usePreventBodyScroll();
    if (scrollWithWheel) {
      return (
        <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
          <ReactComponent {...props} onWheel={onWheel} />
        </div>
      );
    }

    return <ReactComponent {...props} />;
  };

  return WithScroll;
};

const HScroll = ({
  children,
  arrowsPos,
  scrollContainerClassName,
  headerTitle,
  subtitle,
  arrows = true,
  overlapArrows,
  wrapperClassName,
  scrollVisible,
  ...rest
}: IProps) => {
  let props = {
    ...rest,
  };

  if (arrowsPos && arrowsPos.show === 'head') {
    props = {
      ...props,
      Header: <Arrows position={arrowsPos.position} title={headerTitle} subtitle={subtitle} />,
    };
  } else if (arrowsPos && arrowsPos.show === 'footer') {
    props = {
      ...props,
      Footer: <Arrows position={arrowsPos.position} />,
    };
  } else {
    if (arrows) {
      props = {
        ...props,
        LeftArrow,
        RightArrow,
      };
    }
  }

  return (
    <ScrollMenu
      {...props}
      scrollContainerClassName={clsx(scrollContainerClassName, { 'scroll-visible': !arrows || scrollVisible })}
      wrapperClassName={clsx(wrapperClassName, { 'h-scroll-overlap-arrows': overlapArrows })}
    >
      {children}
    </ScrollMenu>
  );
};

export default ScrollHOC(HScroll);

const Arrows = ({ position, title, subtitle }: { position: Position; title?: TitleType; subtitle?: TitleType }) => {
  return (
    <div>
      <Stack
        direction="horizontal"
        className={clsx('mb-2 align-items-center', title ? 'justify-content-between' : `justify-content-${position}`)}
        gap={2}
      >
        {title && (isValidElement(title) ? title : <h6 className="fw-bold fs-5 m-0">{title}</h6>)}
        <Stack direction="horizontal" gap={2} className={clsx(`align-items-center justify-content-${position}`)}>
          <LeftArrow />
          <RightArrow />
        </Stack>
      </Stack>
      {subtitle && (isValidElement(title) ? subtitle : <p className="small mb-4">{subtitle}</p>)}
    </div>
  );
};

const LeftArrow = () => {
  const { scrollPrev, useIsVisible } = useContext(VisibilityContext);

  const isFirstItemVisible = useIsVisible('first', true);
  const isLastItemVisible = useIsVisible('last', false);

  if (isFirstItemVisible && isLastItemVisible) {
    return null;
  }

  if (isFirstItemVisible) {
    return (
      <div className="btn btn-sm btn-light btn-minimal-rounded disabled">
        <ArrowLeft size="16" />
      </div>
    );
  }

  return (
    <button
      className="btn btn-sm btn-light btn-minimal-rounded"
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
      type="button"
    >
      <ArrowLeft size="16" />
    </button>
  );
};

const RightArrow = () => {
  const { scrollNext, useIsVisible } = useContext(VisibilityContext);
  const isFirstItemVisible = useIsVisible('first', true);
  const isLastItemVisible = useIsVisible('last', false);

  if (isFirstItemVisible && isLastItemVisible) {
    return null;
  }

  if (isLastItemVisible) {
    return (
      <div className="btn btn-sm btn-light btn-minimal-rounded disabled">
        <ArrowRight size="16" />
      </div>
    );
  }

  return (
    <button
      className="btn btn-sm btn-light btn-minimal-rounded"
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
      type="button"
    >
      <ArrowRight size="16" />
    </button>
  );
};

declare type scrollVisibilityApiType = ContextType<typeof VisibilityContext>;
const onWheel = (apiObj: scrollVisibilityApiType, ev: WheelEvent) => {
  const isTouchPad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;
  if (isTouchPad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext();
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev();
  }
};
