import { Suspense } from 'react';
import { Await } from 'react-router-dom';

import { isEmpty } from 'utils/functions';

import { LoaderType } from 'interfaces/IGeneral';

interface IProps {
  data: LoaderType<unknown> | string;
  dataKey?: string;
}

const GetCrumbs = ({ data, dataKey }: IProps) => {
  if (typeof data === 'string') {
    return <span>{data}</span>;
  }

  return (
    <Suspense fallback={'...'}>
      <Await resolve={data.response}>
        {response => {
          if (dataKey && 'data' in response && !isEmpty(response.data) && dataKey in response.data) {
            return <span>{response['data'][dataKey]}</span>;
          }
          return null;
        }}
      </Await>
    </Suspense>
  );
};

export default GetCrumbs;
