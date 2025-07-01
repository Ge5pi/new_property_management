import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetOwnersByIdQuery } from 'services/api/owners';

import { getValidID } from 'utils/functions';

import OwnerForm from './components/owner-form/owner-form';

const OwnersModify = () => {
  const { owner: owner_id } = useParams();
  const owner = useGetOwnersByIdQuery(getValidID(owner_id));

  return (
    <ApiResponseWrapper
      {...owner}
      renderResults={data => {
        return <OwnerForm owner={data} owner_id={Number(owner_id)} />;
      }}
    />
  );
};

export default OwnersModify;
