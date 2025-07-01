import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetWorkOrdersByIdQuery } from 'services/api/work-orders';

import { getValidID } from 'utils/functions';

import WorkOrderCRUD from './work-orders-crud';

const WorkOrdersModify = () => {
  const { order, request } = useParams();

  const work_order = useGetWorkOrdersByIdQuery(getValidID(order));

  return (
    <ApiResponseWrapper
      {...work_order}
      renderResults={data => {
        return <WorkOrderCRUD order={Number(order)} work_order={data} service_request_id={Number(request)} />;
      }}
    />
  );
};

export default WorkOrdersModify;
