import { useParams } from 'react-router-dom';

import useResponse from 'services/api/hooks/useResponse';
import { useCreatePropertyUtilityBillingMutation, useGetPropertyUtilityBillingQuery } from 'services/api/properties';

import { ItemPercentage } from 'components/custom-cell';
import { SimpleTable } from 'components/table';

import { UtilityBillsModal } from 'core-ui/popups/utility-bills';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { PERMISSIONS } from 'constants/permissions';
import { getValidID } from 'utils/functions';

const UtilityBills = () => {
  const { property: property_id } = useParams();
  const { data = [], ...rest } = useGetPropertyUtilityBillingQuery(getValidID(property_id));

  const [
    createUtilityBilling,
    {
      isSuccess: isCreateUtilityBillingSuccess,
      isError: isCreateUtilityBillingError,
      error: createUtilityBillingError,
    },
  ] = useCreatePropertyUtilityBillingMutation();

  useResponse({
    isSuccess: isCreateUtilityBillingSuccess,
    successTitle: 'New Utility Bill has been added',
    isError: isCreateUtilityBillingError,
    error: createUtilityBillingError,
  });

  const columns = [
    {
      Header: 'Utility',
      accessor: 'utility',
    },
    {
      Header: 'Vendor',
      accessor: 'vendor',
      minWidth: 200,
    },
    {
      Header: 'Vendor bill GL',
      accessor: 'vendor_bill_gl',
      minWidth: 200,
    },
    {
      Header: 'Tenant Charge GL',
      accessor: 'tenant_charge_gl',
      minWidth: 200,
    },
    {
      Header: 'Owner contribution',
      accessor: 'owner_contribution_percentage',
      Cell: ItemPercentage,
    },
    {
      Header: 'Tenant Contribution',
      accessor: 'tenant_contribution_percentage',
      Cell: ItemPercentage,
    },
  ];

  return (
    <SimpleTable
      {...rest}
      data={data}
      shadow={false}
      showTotal={false}
      wrapperClass="detail-section-table page-section"
      newRecordButtonPermission={PERMISSIONS.PROPERTY}
      showHeaderInsideContainer
      pageHeader={<p className="fw-bold m-0 text-primary">Utility Billing</p>}
      columns={columns}
      handleCreateNewRecord={() => {
        SweetAlert({
          html: <UtilityBillsModal createUtilityBill={createUtilityBilling} property_id={Number(property_id)} />,
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
    />
  );
};

export default UtilityBills;
