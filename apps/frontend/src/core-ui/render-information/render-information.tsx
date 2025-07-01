import { Fragment, ReactElement, ReactNode, useMemo } from 'react';
import { Stack } from 'react-bootstrap';

import { clsx } from 'clsx';

import { CalendarIcon } from 'core-ui/icons';

import {
  displayDate,
  formatPhoneNumber,
  formatPricing,
  isNegativeNumber,
  isValidDate,
  validateEmail,
  validatePhone,
} from 'utils/functions';

declare type BelongsType = 'description' | 'phone' | 'email' | 'link' | 'date' | 'unknown';
interface IRInformation {
  title: string;
  link?: string;
  description?: ReactNode | Array<string>;
  desClass?: string;
  titleClass?: string;
  date?: string;
  showDateIcon?: boolean;
  dateClass?: string;
  html?: JSX.Element;
  icon?: ReactElement;
  containerClass?: string;
  containerMargin?: boolean;
  phone?: string | string[];
  email?: string | string[];
}

const isStringValueValid = <T,>(value?: T) => {
  if (value === undefined || value === '' || value === null || value === 'null' || value === 'undefined') return 'N/A';
  return value;
};

const RenderInformation = ({
  title,
  link,
  description,
  containerClass,
  showDateIcon,
  desClass,
  html,
  icon,
  titleClass,
  containerMargin = true,
  phone,
  email,
  date,
  dateClass,
}: IRInformation) => {
  const contentDetail = useMemo(() => {
    const text = isStringValueValid(description);
    const dateText = isStringValueValid(date);
    const url = isStringValueValid(link);
    const phoneText = isStringValueValid(phone);
    const emailText = isStringValueValid(email);

    if (text !== 'N/A') return { belongs: 'description' as BelongsType, content: text };
    if (dateText !== 'N/A') return { belongs: 'date' as BelongsType, content: dateText };
    if (url !== 'N/A') return { belongs: 'link' as BelongsType, content: url };
    if (phoneText !== 'N/A') return { belongs: 'phone' as BelongsType, content: phoneText };
    if (emailText !== 'N/A') return { belongs: 'email' as BelongsType, content: emailText };
    return { belongs: 'unknown' as BelongsType, content: '' };
  }, [description, date, link, phone, email]);

  return (
    <div className={clsx('text-primary', containerClass, { 'mb-4': containerMargin })}>
      {title && (
        <h4
          className={clsx('h6 mb-1 text-capitalize', titleClass, {
            'fw-medium': !(titleClass && titleClass.includes('fw-')),
          })}
        >
          {title}
        </h4>
      )}
      {!html && (
        <RenderDescription
          belongsTo={contentDetail.belongs}
          text={contentDetail.content}
          className={dateClass ?? desClass}
          showDateIcon={showDateIcon}
          icon={icon}
        />
      )}
      {html && html}
    </div>
  );
};

interface RenderDescriptionProps<T> {
  text: T;
  belongsTo: BelongsType;
  icon?: ReactElement;
  className?: string;
  showDateIcon?: boolean;
}
const RenderDescription = <T extends ReactNode>({
  belongsTo,
  icon,
  className = '',
  text,
  showDateIcon = true,
}: RenderDescriptionProps<T>) => {
  if (text && belongsTo === 'description') {
    return (
      <Fragment>
        {text !== 'N/A' ? (
          <div>
            {Array.isArray(text) ? (
              text.map(text => (
                <Stack direction="horizontal" className={clsx(className)} gap={2} key={text} as={'p'}>
                  <span>{text}</span>
                </Stack>
              ))
            ) : typeof text === 'string' || typeof text === 'number' ? (
              <p
                className={clsx(
                  {
                    '-ive': className.includes('price-symbol') && isNegativeNumber(text),
                  },
                  className
                )}
              >
                {className.includes('price-symbol') ? formatPricing(text) : text}
              </p>
            ) : (
              <Stack direction="horizontal" className={clsx('align-items-center', className)} gap={1} as={'p'}>
                <span>{text} </span> {icon && <span className="mx-1">{icon}</span>}
              </Stack>
            )}
          </div>
        ) : (
          <div
            className={clsx(
              className.replace('price-symbol', '').replace('percentage-symbol', '').replace('sqrFeet-symbol', '')
            )}
          >
            {text}
          </div>
        )}
      </Fragment>
    );
  }

  if (text && belongsTo === 'date') {
    return (
      <Fragment>
        {typeof text === 'string' && isValidDate(text) ? (
          <Stack direction="horizontal" className={clsx('align-items-center', className)} gap={2}>
            <p className="m-0 text-primary">{displayDate(text)}</p>
            {showDateIcon && (
              <span className="text-muted d-inline-block" style={{ lineHeight: 0 }}>
                <CalendarIcon size="18px" />
              </span>
            )}
          </Stack>
        ) : (
          <span className={className}>{text}</span>
        )}
      </Fragment>
    );
  }

  if (text && belongsTo === 'email') {
    return (
      <Fragment>
        {typeof text === 'string' && validateEmail(text) ? (
          <a className="link link-info" href={`mailto:${text}`} rel="noreferrer" target="_blank">
            {text}
          </a>
        ) : Array.isArray(text) ? (
          <Stack direction="horizontal" gap={2}>
            {text.map((t, ix) => (
              <Fragment key={`${t}-${ix}`}>
                {typeof t === 'string' && validateEmail(t) ? (
                  <a className="link link-info" href={`mailto:${t}`} rel="noreferrer" target="_blank">
                    {t}
                  </a>
                ) : (
                  <span>{t}</span>
                )}
                <span className={clsx('vr', { 'd-none': text.length <= 1 || text.length - 1 === ix })} />
              </Fragment>
            ))}
          </Stack>
        ) : (
          <span>{text}</span>
        )}
      </Fragment>
    );
  }

  if (text && belongsTo === 'phone') {
    return (
      <Fragment>
        {typeof text === 'string' && validatePhone(text) ? (
          <a className="link link-info" href={`tel:${text}`}>
            {formatPhoneNumber(text)}
          </a>
        ) : Array.isArray(text) ? (
          <Stack direction="horizontal" gap={2}>
            {text.map((t, ix) => (
              <Fragment key={`${t}-${ix}`}>
                {typeof t === 'string' && validatePhone(t) ? (
                  <a className="link link-info" href={`mailto:${t}`}>
                    {formatPhoneNumber(t)} {text.length > 1 ? ',' : ''}
                  </a>
                ) : (
                  <span>{t}</span>
                )}
                <span className={clsx('vr', { 'd-none': text.length <= 1 || text.length - 1 === ix })} />
              </Fragment>
            ))}
          </Stack>
        ) : (
          <span>{text}</span>
        )}
      </Fragment>
    );
  }

  if (text && belongsTo === 'link') {
    return (
      <Fragment>
        {typeof text === 'string' ? (
          <a className="link link-info" href={text} rel="noreferrer" target="_blank">
            {text}
          </a>
        ) : (
          <span>{text}</span>
        )}
      </Fragment>
    );
  }

  return (
    <div
      className={clsx(
        className.replace('price-symbol', '').replace('percentage-symbol', '').replace('sqrFeet-symbol', '')
      )}
    >
      N/A
    </div>
  );
};

export default RenderInformation;
