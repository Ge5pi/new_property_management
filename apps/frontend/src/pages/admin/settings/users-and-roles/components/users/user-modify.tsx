import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetUserByIdQuery } from 'services/api/users';

import { getValidID } from 'utils/functions';

import UsersCRUD from './users-crud';

function UserModify() {
  const { user: user_id } = useParams();
  const user = useGetUserByIdQuery(getValidID(user_id));

  return <ApiResponseWrapper {...user} renderResults={data => <UsersCRUD user={data} update />} />;
}

export default UserModify;
