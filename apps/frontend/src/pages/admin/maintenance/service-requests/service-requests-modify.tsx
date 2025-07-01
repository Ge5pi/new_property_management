import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetServiceRequestsByIdQuery } from 'services/api/service-requests';

import { getValidID } from 'utils/functions';

import ServiceRequestsCrud from './components/service-requests-crud';

const ServiceRequestModify = () => {
  const { request } = useParams();
  const service_request = useGetServiceRequestsByIdQuery(getValidID(request));

  return (
    <ApiResponseWrapper
      {...service_request}
      renderResults={data => {
        return <ServiceRequestsCrud service_request={data} update />;
      }}
    />
  );
};

export default ServiceRequestModify;
