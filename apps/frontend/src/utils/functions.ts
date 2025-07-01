import { skipToken } from '@reduxjs/toolkit/query';
import { AxiosError, isAxiosError } from 'axios';
import { Buffer } from 'buffer';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import relativeTime from 'dayjs/plugin/relativeTime';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import JSZip from 'jszip';

import { BaseQueryError } from 'services/api/types/rtk-query';

import { HTTPResponse } from 'constants/http-errors';

import { IUser } from 'interfaces/IAvatar';
import { IOwner, IVendor } from 'interfaces/IPeoples';
import { ITenantAPI } from 'interfaces/ITenant';
import { IErrorResponse } from 'interfaces/IToast';

import { normalizeError } from './error.typescript';

import countries from 'data/countries.json';

export const humanFileSize = (size: number) => {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return `${Number((size / Math.pow(1024, i)).toFixed(2)) * 1} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
};

declare type ObjectExtendedID = object & { id?: number | string };
export const getIDFromObject = <T extends ObjectExtendedID>(key: keyof T, object?: T, skip = true) => {
  const obj = object ? object[key] : null;
  if (obj && Number(obj) > 0) return Number(obj);
  if (obj && typeof obj === 'object' && 'id' in obj) return Number(obj.id);
  return skip ? skipToken : -1;
};

export const getValidID = (id?: number | string | null, skip = true) => {
  if (id && isPositiveNumber(id)) return Number(id);
  return skip ? skipToken : -1;
};

declare type ErrorResponseType<T> = T extends true ? string : IErrorResponse;
export const getHTTPValidError = (statusCode: number) => {
  const response = HTTPResponse.find(http => http.code === statusCode);
  if (response) return response;
  return 'An unknown error occurred.';
};

export const handleAxiosError = (error: AxiosError) => {
  let errorResponse: IErrorResponse = {
    message: 'Something went wrong, unable to perform the action.',
  };

  if (error.response) {
    let message = '';
    if (error.response.data) {
      if (typeof error.response.data === 'string') {
        message = error.response.data;
      } else if (typeof error.response.data === 'object' && 'detail' in error.response.data) {
        if (Array.isArray(error.response.data.detail)) {
          message = error.response.data.detail.join('\n');
        }
      }
    }

    const dataType = error.response?.headers['Content-Type'] ?? error.response?.headers['content-type'];
    if (dataType && typeof dataType === 'string') {
      if (dataType.split(';').some(t => ['text/plain', 'text/html'].includes(t))) {
        message = 'Unhandled exception return from the server.';
      }
    }

    const response = getHTTPValidError(error.response.status);
    if (typeof response !== 'string') {
      response.message = message !== '' ? message : response.message;
      errorResponse = Object.assign({}, response);
    } else {
      errorResponse = {
        ...error.response,
        message: message !== '' ? message : response,
      };
    }
  } else {
    if (error.request) {
      errorResponse.message = 'The request was made but no response was received';
      if (!window.navigator.onLine) {
        errorResponse.message += '\nCheck your Network Connection and try again. Thank You!';
      }
    } else {
      errorResponse.code = error.status;
      errorResponse.response = error.name;
      errorResponse.message = error.message;
    }
  }

  return errorResponse;
};

declare type ErrorObjType = { [key: string]: string | string[] | unknown[] };
export const getReadableError = <B extends boolean = false>(
  error: AxiosError | Error | BaseQueryError | unknown,
  getText?: B
): ErrorResponseType<B> => {
  let errorResponse: IErrorResponse = {
    message: 'Something went wrong, unable to perform the action.',
  };

  if (!window.navigator.onLine) {
    errorResponse.message = 'Check your Network Connection and try again. Thank You!';
  }

  if (isAxiosError(error)) {
    errorResponse = Object.assign({}, handleAxiosError(error));
  } else if (error && typeof error === 'object' && 'data' in error && 'status' in error) {
    const queryError = error as BaseQueryError;
    const response = getHTTPValidError(queryError.status);
    let message = '';

    if (queryError.data) {
      if (typeof queryError.data === 'string') {
        message = queryError.data;
        if ('type' in queryError) {
          const dataType = queryError.type;
          if (dataType && typeof dataType === 'string') {
            if (dataType.split(';').some(t => ['text/plain', 'text/html'].includes(t))) {
              message = 'Unhandled exception return from the server.';
            }
          }
        }
      } else if ('detail' in queryError.data) {
        if (Array.isArray(queryError.data.detail)) {
          message = queryError.data.detail.join('\n');
        }
      }
    }

    if ('type' in queryError && queryError.type && typeof queryError.type === 'string') {
      message = (queryError.type as string).includes('text/html')
        ? 'Unhandled exception return from the server.'
        : message;
    }

    if (typeof response !== 'string') {
      response.message = message !== '' ? message : response.message;
      errorResponse = Object.assign({}, response);
    } else {
      errorResponse = {
        message: message !== '' ? message : response,
        code: queryError.status,
      };
    }
  } else {
    const response = normalizeError(error);
    if (response.error) {
      errorResponse.message = response.error.message;
      errorResponse.response = response.error.name;
    } else {
      errorResponse.message = response.message;
    }
  }

  if (getText) return errorResponse.message as ErrorResponseType<B>;
  return errorResponse as ErrorResponseType<B>;
};

// Removable
export const isJson = (item: string | JSON) => {
  item = typeof item !== 'string' ? JSON.stringify(item) : item;

  try {
    item = JSON.parse(item);
  } catch (error) {
    console.error(error);
    return false;
  }

  if (typeof item === 'object' && item !== null) {
    return true;
  }

  return false;
};

export const isEmpty = (obj: object) => {
  for (const prop in obj) {
    if (obj.hasOwnProperty.call(obj, prop)) return false;
  }

  return true;
};

export const hasEmptyKey = <T extends Array<object>>(arr?: T) => {
  if (!arr || arr.length <= 0) return true;
  return arr.some(obj => Object.values(obj).some(val => !val));
};

export const getFileNameExt = (file: File) => {
  const name = file.name;
  const lastDot = name.lastIndexOf('.');

  const fileName = name.substring(0, lastDot);
  const ext = name.substring(lastDot + 1);

  return { fileName, ext };
};

export const getUniqueName = () => {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
  const random = ('' + Math.random()).substring(2, 8);
  return timestamp + random;
};

export const calculatePercentage = (val1: number, val2: number) => {
  if (isNaN(val2) || isNaN(val1)) {
    return 0;
  } else {
    return ((val1 / val2) * 100).toFixed(2);
  }
};

export const getDate = (value: string | undefined | null) => {
  if (!value || value === '') {
    return 'N/A';
  }

  try {
    const date = new Date(value);
    if (isNaN(date.getDate())) return '-';
    return (
      (date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) +
      '/' +
      (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
      '/' +
      date.getFullYear()
    );
  } catch (error) {
    console.error(error);
    return '-';
  }
};

export const isDate = (value: string) => {
  try {
    const date = new Date(value);
    return !isNaN(date.getDate());
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const dayJS = (() => {
  dayjs.extend(isSameOrAfter);
  dayjs.extend(customParseFormat);
  dayjs.extend(advancedFormat);
  dayjs.extend(relativeTime);
  return dayjs;
})();

export const isValidDate = (date: string | Date | null | undefined) => {
  if (date && dayJS(date).isValid()) return true;
  return false;
};

export const displayDate = (date: string | Date | null | undefined, format = 'MM/DD/YYYY') => {
  if (!date || !isValidDate(date)) return '-';
  return dayJS(date).format(format);
};

export const parseTime = (time: string | null | undefined, iFormat = 'HH:mm:ss', oFormat = 'hh:mm A') => {
  if (!time) return '-';
  const dayJSTime = dayJS(time, iFormat);
  if (dayJSTime.isValid()) return dayJSTime.format(oFormat);
  return '-';
};

export const isPositiveNumber = (value: string | number | undefined | null) => {
  return isNumber(value) && Number(value) > 0;
};

export const isNumber = (value: string | number | undefined | null) => {
  return !isNaN(Number(value));
};

export const populateDynamicField = (fieldName: string, values?: Array<string>) => {
  if (values && values.length) {
    return values.map(value => ({
      [fieldName]: value,
    }));
  }

  return [{ [fieldName]: '' }];
};

export const returnIfHave = <T extends object>(defaultArr: Array<T>, value?: Array<T>) => {
  if (!value) return defaultArr;
  if (value.length <= 0) return defaultArr;
  return JSON.parse(
    JSON.stringify(value, function (key, value) {
      return !value ? '' : value;
    })
  ) as Array<T>;
};

export const getCountry = (value?: string) => {
  if (!value) return 'N/A';
  const country = countries.find(c => c.value === value || c.label.toLowerCase() === value.toLowerCase());
  return country ? country.label : 'N/A';
};

export const parseURLParams = (o: object, a: Array<string> = []) => {
  Object.entries(o).forEach(([key, value]) => {
    if (typeof value === 'object')
      parseURLParams(value, a); // recursion
    else {
      if (!value) value = '';
      a.push(`${key}=${encodeURIComponent(value)}`);
    }
  });

  return a.join('&');
};

declare type FieldMetaType = { key: string; message: string; index?: number; sub_key?: string };
declare type fromFuncType = (field: string, message: string | undefined) => void;
export const renderFormError = (error: ErrorObjType | ErrorObjType[], func: fromFuncType) => {
  const fieldMeta: Array<FieldMetaType> = [];
  const readableErrorObject = Array.isArray(error) ? error[0] : error;
  Object.keys(readableErrorObject).forEach(key => {
    const obj = readableErrorObject[key];
    if (Array.isArray(obj)) {
      obj.forEach(err => {
        if (err && typeof err === 'object') {
          const objError = err as ErrorObjType;
          Object.keys(objError).forEach((ki, ix) => {
            const errorMessage = objError[ki];
            fieldMeta.push({
              key,
              message: Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage,
              index: ix,
              sub_key: ki,
            });
          });
        } else {
          const errorMessage = err as Array<string> | string;
          fieldMeta.push({ key, message: Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage });
        }
      });
    } else {
      fieldMeta.push({ key, message: obj });
    }
  });

  fieldMeta.forEach(meta => {
    let key = meta.key;
    if (meta.index) key += `[${meta.index}]`;
    if (meta.sub_key) key += meta.sub_key;
    func(key, meta.message);
  });
};
export const downloadZip = (blobs: Blob[], fileName: string[]) => {
  const zip = new JSZip();
  blobs.forEach(function (blob, idx) {
    zip.file(fileName[idx], blob, { binary: true });
  });

  return zip.generateAsync({ type: 'blob' });
};

export const compare2Arrays = (arr: Array<number>, target: Array<number>, checker: 'some' | 'every' = 'every') => {
  if (checker === 'every') {
    return target.every(v => arr.includes(v));
  }

  return target.some(v => arr.includes(v));
};

export const protectString = (text: string, protection: 'Encrypt' | 'Decrypt') => {
  if (protection === 'Encrypt') return Buffer.from(text).toString('base64');
  else return Buffer.from(text, 'base64').toString();
};

declare type CurrentRole = 'TENANT' | 'ADMIN' | 'LOG_OUT';
const definedRoutes = { ADMIN: '/admin', TENANT: '/tenant' };
export const getPathBasedRole = (defaultRole: CurrentRole) => {
  const { ADMIN, TENANT } = definedRoutes;
  const getPathFromPathname = () => {
    const pathname = window.location.pathname;
    return pathname.startsWith(ADMIN) || pathname.includes(ADMIN) ? ADMIN : TENANT;
  };

  const getPathFromStorage = () => {
    const activeRole = localStorage.getItem('_R_0L');
    if (activeRole) {
      const role = protectString(activeRole, 'Decrypt') as CurrentRole;
      return role === 'ADMIN' ? ADMIN : role === 'TENANT' ? TENANT : getPathFromPathname();
    }

    return getPathFromPathname();
  };

  return defaultRole === 'ADMIN' ? ADMIN : defaultRole === 'TENANT' ? TENANT : getPathFromStorage();
};

export const getUserAccountType = (user: IUser) => {
  if (user.purchased_subscription === null && user.is_tenant && !user.is_admin && !user.is_subscription_staff) {
    return 'TENANT';
  }

  if (user.purchased_subscription !== null && user.is_admin && !user.is_tenant) return 'SUPER_ADMIN';
  if (!user.is_tenant && user.is_subscription_staff && !user.is_admin) return 'ADMIN';

  return 'INACTIVE';
};

export const isObject = (value: unknown): boolean => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const phoneUtil = PhoneNumberUtil.getInstance();
export const validatePhone = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\/".+\/"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export const formatPhoneNumber = (phone: string) => {
  try {
    const numberProto = phoneUtil.parse(phone);
    return phoneUtil.format(numberProto, PhoneNumberFormat.INTERNATIONAL);
  } catch (error) {
    console.error(error);
    return phone;
  }
};

export const formatPricing = (str: string | number | undefined | null) => {
  if (!str) return '0.00';
  if (typeof str === 'number' || isNumber(str)) {
    // .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
    return Number(str)
      .toFixed(2)
      .replace(/./g, function (c, i, a) {
        return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c;
      });
  }

  let match;
  let formattedString = str;
  const regex = /(\d+(?:\.\d+)?)/g;

  while ((match = regex.exec(str)) !== null) {
    if (match[0]) {
      const number = match[1];
      const formattedNumber = Number(number)
        .toFixed(2)
        .replace(/./g, function (c, i, a) {
          return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c;
        });
      formattedString = formattedString.replace(Number(match[0]).toFixed(2), formattedNumber);
    } else {
      regex.lastIndex++;
    }
  }

  return formattedString;
};

export const isNegativeNumber = (amount: string | number | undefined | null) => {
  if (!amount || isNaN(Number(amount))) return false;
  return isNumber(amount) && Number(amount) < 0;
};

export const removeEmptyObjectsByKeys = (object: Record<string, unknown>): Record<string, unknown> => {
  if (!isObject(object)) return {};

  const newObject: Record<string, unknown> = {};
  Object.keys(object).forEach(key => {
    if (object[key]) {
      newObject[key] = object[key];
    }
  });

  return newObject;
};
declare type SearchFilterType<T> = T extends true ? boolean : { key: string; id: number } | undefined;
export const getSearchFilter = <B extends boolean = false>(
  value: Array<object> | object,
  key: string,
  preload?: B
): SearchFilterType<B> => {
  if (Array.isArray(value)) {
    if (value.length > 0) {
      const obj = value[0];
      if ('id' in obj) {
        if (preload) {
          return (Number(obj.id) > 0) as SearchFilterType<B>;
        }
        return { key, id: Number(obj.id) } as SearchFilterType<B>;
      }
    }
    if (preload) return false as SearchFilterType<B>;
    return undefined as SearchFilterType<B>;
  } else {
    if ('id' in value) {
      if (preload) {
        return (Number(value.id) > 0) as SearchFilterType<B>;
      }
      return { key, id: Number(value.id) } as SearchFilterType<B>;
    }
  }

  if (preload) return false as SearchFilterType<B>;
  return undefined as SearchFilterType<B>;
};

export const getStringPersonName = (value: IUser | IOwner | ITenantAPI | IVendor) => {
  let name = '*';
  if (value.first_name && value.last_name) {
    name = `${value.first_name} ${value.last_name}`;
  } else {
    if ('username' in value) {
      name = value.username;
    }
  }
  return name;
};
