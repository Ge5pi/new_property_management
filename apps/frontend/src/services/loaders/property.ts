import { LoaderFunctionArgs, defer } from 'react-router-dom';

import { propertiesApi } from 'services/api/properties';
import { store } from 'store/redux';

import { getHTTPValidError } from 'utils/functions';

export const SinglePropertyLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const { property } = params;
  if (property && Number(property) > 0) {
    const promise = store.dispatch(propertiesApi.endpoints.getPropertyById.initiate(Number(property)));
    request.signal.onabort = promise.abort;

    const res = promise.then(response => response);

    return defer({ response: res });
  } else throw getHTTPValidError(502);
};
