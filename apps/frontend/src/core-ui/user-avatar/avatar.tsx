import { useEffect, useMemo, useRef } from 'react';
import { Stack } from 'react-bootstrap';

import { clsx } from 'clsx';

import { NameInitialsAvatarProps } from 'interfaces/IAvatar';

const Avatar = (props: NameInitialsAvatarProps) => {
  const { name, size = 30, showName = false, suffixClassName = '', bgClassName } = props;

  const avatarRef = useRef<HTMLSpanElement | null>(null);
  const user_name = useMemo(() => {
    const splitName = name.split(' ');
    const fi = splitName[0] ? splitName[0][0] : '';
    const li = splitName.length > 1 ? splitName[splitName.length - 1][0] : '';
    return `${fi}${li}`;
  }, [name]);

  useEffect(() => {
    if (avatarRef.current) {
      const textElem = avatarRef.current.firstElementChild as HTMLElement;
      if (textElem) {
        _scaleTextNode(avatarRef.current, textElem);
      }
    }
  }, [size]);

  return (
    <div className="avatar-wrapper">
      <Stack direction="horizontal" className="align-items-center" gap={2}>
        <span
          ref={avatarRef}
          className={clsx(
            'letter-avatar border rounded-circle',
            { 'bg-dark bg-opacity-10': !bgClassName },
            bgClassName
          )}
          style={{
            width: size,
            height: size,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span className="fw-bold text-primary">{user_name}</span>
        </span>
        {showName && (
          <span className={clsx(suffixClassName, 'text-primary', { 'fw-normal': !suffixClassName.includes('fw-') })}>
            {name}
          </span>
        )}
      </Stack>
    </div>
  );
};

export default Avatar;

const _scaleTextNode = (container: HTMLElement, text: HTMLElement, textSizeRatio = 2.75, textMarginRatio = 0.15) => {
  const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();

  // If the tableNode (outer-container) does not have its fontSize set yet,
  // we'll set it according to "textSizeRatio"
  const baseFontSize = containerHeight / textSizeRatio;
  text.style.fontSize = `${baseFontSize}px`;

  // Measure the actual width of the text after setting the container size
  const { width: textWidth } = text.getBoundingClientRect();

  if (textWidth < 0) return;

  // Calculate the maximum width for the text based on "textMarginRatio"
  const maxTextWidth = containerWidth * (1 - 2 * textMarginRatio);

  // If the text is too wide, scale it down by (maxWidth / actualWidth)
  if (textWidth > maxTextWidth) container.style.fontSize = `calc(1em * ${maxTextWidth / textWidth})`;
};
