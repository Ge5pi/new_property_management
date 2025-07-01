import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetRoleByIdQuery } from 'services/api/users';

import { getValidID } from 'utils/functions';

import RoleCRUD from './role-crud';

function RoleModify() {
  const { role: role_id } = useParams();
  const role = useGetRoleByIdQuery(getValidID(role_id));

  return <ApiResponseWrapper {...role} renderResults={data => <RoleCRUD role={data} update />} />;
}

export default RoleModify;
