import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetVendorsByIdQuery } from 'services/api/vendors';

import { getValidID } from 'utils/functions';

import VendorForm from './components/vendor-form/vendor-form';

const VendorModify = () => {
  const { vendor: vendor_id } = useParams();

  const vendor = useGetVendorsByIdQuery(getValidID(vendor_id));

  return (
    <ApiResponseWrapper
      {...vendor}
      renderResults={data => {
        return <VendorForm vendor={data} update />;
      }}
    />
  );
};

export default VendorModify;
