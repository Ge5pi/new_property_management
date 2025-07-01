import { useEffect } from 'react';

import { Notify } from 'core-ui/toast';

import { getReadableError } from 'utils/functions';

interface IResponse {
  isSuccess?: boolean;
  isError: boolean;
  successTitle?: string;
  error: unknown;
  errorTitle?: string;
}

const useResponse = ({
  isSuccess = false,
  isError = false,
  successTitle = '',
  errorTitle = 'Uh oh, something went wrong',
  error,
}: IResponse) => {
  useEffect(() => {
    if (isSuccess) {
      Notify.show({
        type: 'success',
        title: successTitle,
      });
    }

    if (isError) {
      Notify.show({
        type: 'danger',
        title: errorTitle,
        description: getReadableError(error),
      });
    }
  }, [isSuccess, isError, error, successTitle, errorTitle]);
};

export default useResponse;
