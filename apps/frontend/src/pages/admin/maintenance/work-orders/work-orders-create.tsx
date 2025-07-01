import { useParams } from 'react-router-dom';

import WorkOrderCRUD from './work-orders-crud';

const WorkOrdersCreate = () => {
  const { request } = useParams();

  return <WorkOrderCRUD service_request_id={request ? Number(request) : undefined} />;
};

export default WorkOrdersCreate;
