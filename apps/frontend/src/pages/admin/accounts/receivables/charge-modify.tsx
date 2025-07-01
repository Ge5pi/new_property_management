import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetChargeByIdQuery } from 'services/api/charges';

import { getValidID } from 'utils/functions';

import ChargesForm from './components/receivables-form/charges-form';

const ChargeModify = () => {
  const { charge: charge_id } = useParams();
  const charge = useGetChargeByIdQuery(getValidID(charge_id));

  return (
    <ApiResponseWrapper
      {...charge}
      renderResults={data => {
        return <ChargesForm charge={data} update />;
      }}
    />
  );
};

export default ChargeModify;
