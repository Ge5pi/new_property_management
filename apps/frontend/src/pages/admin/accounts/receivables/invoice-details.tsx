import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetBusinessInformationQuery } from 'services/api/business-information';
import { useGetListOfChargesQuery } from 'services/api/charges';
import { useGetInvoiceByIdQuery, useGetListOfInvoicesQuery } from 'services/api/invoices';
import { useGetLeaseByIdQuery } from 'services/api/lease';
import { useGetPropertyByIdQuery, useGetPropertyLateFeeInformationQuery } from 'services/api/properties';
import { useGetTenantByIdQuery } from 'services/api/tenants';
import { useGetUnitByIdQuery } from 'services/api/units';

import PageContainer from 'components/page-container';

import { RentalInvoiceDetails } from 'core-ui/rental-invoices';

import { useRedirect } from 'hooks/useRedirect';

import { getIDFromObject, getValidID } from 'utils/functions';

const InvoiceDetails = () => {
  const { invoice: invoice_id } = useParams();
  const invoice = useGetInvoiceByIdQuery(getValidID(invoice_id));
  const business_information = useGetBusinessInformationQuery();

  const lease = useGetLeaseByIdQuery(getIDFromObject('lease', invoice.data));
  const primary_tenant = useGetTenantByIdQuery(getIDFromObject('primary_tenant', lease.data));
  const property = useGetPropertyByIdQuery(getIDFromObject('parent_property', invoice.data));

  const late_fee = useGetPropertyLateFeeInformationQuery(getIDFromObject('late_fee_policy', property.data));

  const unit = useGetUnitByIdQuery(getIDFromObject('unit', invoice.data));

  const charges = useGetListOfChargesQuery({ invoice: invoice_id });
  const arrears = useGetListOfInvoicesQuery({ arrear_of: invoice_id });

  const { modifyCurrentPath } = useRedirect();
  const invoice_path = modifyCurrentPath('/receivables', 'receivables');

  return (
    <PageContainer>
      <ApiResponseWrapper
        {...invoice}
        renderResults={data => (
          <RentalInvoiceDetails
            invoice={data}
            business_information={business_information}
            lease={lease}
            primary_tenant={primary_tenant}
            property={property}
            late_fee={late_fee}
            unit={unit}
            arrears={arrears}
            charges={charges}
            invoice_path={invoice_path}
          />
        )}
      />
    </PageContainer>
  );
};

export default InvoiceDetails;
