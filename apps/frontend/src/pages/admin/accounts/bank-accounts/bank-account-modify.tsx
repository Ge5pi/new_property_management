import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetBankAccountByIdQuery } from 'services/api/bank-accounts';

import { getValidID } from 'utils/functions';

import BankAccountsForm from './bank-account-form/bank-account-form';

const BankAccountModify = () => {
  const { account_id } = useParams();
  const account = useGetBankAccountByIdQuery(getValidID(account_id));

  return (
    <ApiResponseWrapper
      {...account}
      renderResults={data => {
        return <BankAccountsForm account={data} update />;
      }}
    />
  );
};

export default BankAccountModify;
