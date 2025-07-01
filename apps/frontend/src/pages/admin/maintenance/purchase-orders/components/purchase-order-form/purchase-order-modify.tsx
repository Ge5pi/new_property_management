import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetPurchaseOrderByIdQuery } from 'services/api/purchase-orders';

import { getValidID } from 'utils/functions';

import PurchaseOrderCRUD from './purchase-order-form';

const TemplateModify = () => {
  const { purchase: purchase_order_id } = useParams();
  const purchase_order = useGetPurchaseOrderByIdQuery(getValidID(purchase_order_id));

  return (
    <ApiResponseWrapper
      {...purchase_order}
      renderResults={data => {
        return <PurchaseOrderCRUD purchase_order={data} update />;
      }}
    />
  );
};

export default TemplateModify;
