import { Link, useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetBusinessInformationQuery } from 'services/api/business-information';
import { useGetLeaseByIdQuery } from 'services/api/lease';
import { useGetPropertyByIdQuery, useGetPropertyLateFeeInformationQuery } from 'services/api/properties';
import { useGetTenantByIdQuery } from 'services/api/tenants';
import {
  useGetListOfTenantChargesQuery,
  useGetListOfTenantInvoicesQuery,
  useGetTenantInvoiceByIdQuery,
} from 'services/api/tenants/accounts';
import { useGetUnitByIdQuery } from 'services/api/units';

import PageContainer from 'components/page-container';

import { RentalInvoiceDetails } from 'core-ui/rental-invoices';

import { useRedirect } from 'hooks/useRedirect';

import { getIDFromObject, getValidID } from 'utils/functions';

const InvoiceDetails = () => {
  const { invoice_id } = useParams();

  const invoice = useGetTenantInvoiceByIdQuery(getValidID(invoice_id));
  const business_information = useGetBusinessInformationQuery();
  const lease = useGetLeaseByIdQuery(getIDFromObject('lease', invoice.data));
  const primary_tenant = useGetTenantByIdQuery(getIDFromObject('primary_tenant', lease.data));
  const property = useGetPropertyByIdQuery(getIDFromObject('parent_property', invoice.data));
  const late_fee = useGetPropertyLateFeeInformationQuery(getIDFromObject('late_fee_policy', property.data));
  const unit = useGetUnitByIdQuery(getIDFromObject('unit', invoice.data));

  const charges = useGetListOfTenantChargesQuery({ invoice: invoice_id });
  const arrears = useGetListOfTenantInvoicesQuery({ arrear_of: invoice_id });

  const { modifyCurrentPath } = useRedirect();
  const path = modifyCurrentPath('/accounting/payments', 'accounting');
  const invoice_path = modifyCurrentPath('/accounting', 'accounting');

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
            PayNowButton={
              <Link
                className="btn btn-success px-5 py-2 my-4"
                to={data.payment ? `${path}/modify/${data.id}/${data.payment}` : `${path}/create/${data.id}`}
              >
                Pay now
              </Link>
            }
          />
        )}
      />
    </PageContainer>
  );
};

export default InvoiceDetails;
