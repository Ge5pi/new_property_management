import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetTenantServiceRequestsByIdQuery } from 'services/api/tenants/service-requests';

import { getValidID } from 'utils/functions';

import RequestsCRUD from './components/requests-crud';

function RequestsModify() {
  const { request } = useParams();

  const service_request = useGetTenantServiceRequestsByIdQuery(getValidID(request));

  return (
    <ApiResponseWrapper
      {...service_request}
      renderResults={data => {
        return <RequestsCRUD update service_request={data} />;
      }}
    />
  );
}

export default RequestsModify;
