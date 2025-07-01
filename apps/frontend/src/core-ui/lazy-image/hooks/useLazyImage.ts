import { useEffect, useState } from 'react';

import { getSignedURL } from 'api/core';

import { getReadableError } from 'utils/functions';

import ImageNotFound from 'assets/images/not_found.webp';

export const useLazyImage = (source: string | undefined, fetchImage: boolean) => {
  const [image, setImage] = useState<string | undefined>();
  const [error, setError] = useState<string | boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (fetchImage) {
        setLoading(true);
        setImage(undefined);
        setError(false);

        if (source && isValidUrl(source)) {
          setImage(source);
          setLoading(false);
          return;
        } else if (source && !isValidUrl(source)) {
          getSignedURL(source)
            .then(result => {
              if ('data' in result && result.data) {
                setImage(result.data.url);
              } else {
                setImage(ImageNotFound);
                setError(() => getReadableError(result.error, true));
              }
            })
            .finally(() => {
              setLoading(false);
            });

          return;
        } else {
          setError(true);
        }
      }
    } catch (error) {
      setError(true);
    }
  }, [source, fetchImage]);

  useEffect(() => {
    if (error) {
      setImage(ImageNotFound);
      setLoading(false);
    }
  }, [error]);

  return { loading, image, setError };
};

const isValidUrl = (urlString: string) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    if (typeof urlString === 'string') {
      if (urlString.startsWith('/static/media')) {
        return true;
      }

      return isDataURL(urlString);
    }

    throw new Error('URL must be string');
  }
};

const isDataURL = (url: string) => {
  const regex = /^data:image(\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@/?%\s]*)$/i;
  return !!url.trim().match(regex);
};
