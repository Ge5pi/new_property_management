import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetLeaseByIdQuery } from 'services/api/lease';

import { getValidID } from 'utils/functions';

import LeasesCRUD from './components/lease-form/leases-crud';

const LeaseModify = () => {
  const { lease: lease_id } = useParams();
  const lease = useGetLeaseByIdQuery(getValidID(lease_id));

  return (
    <ApiResponseWrapper
      {...lease}
      renderResults={data => {
        return <LeasesCRUD operation="update" lease={data} lease_id={Number(lease_id)} />;
      }}
    />
  );
};

export default LeaseModify;
