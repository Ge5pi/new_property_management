import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetTenantPaymentsByIdQuery } from 'services/api/tenants/payments';

import { getValidID } from 'utils/functions';

import PaymentCRUD from './payment-crud';

const ModifyPayment = () => {
  const { id: payment_id } = useParams();
  const payment = useGetTenantPaymentsByIdQuery(getValidID(payment_id));

  return (
    <ApiResponseWrapper
      {...payment}
      renderResults={data => {
        return <PaymentCRUD tenant_payment={data} update />;
      }}
    />
  );
};

export default ModifyPayment;
