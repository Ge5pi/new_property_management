import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import Bills from './bills';
import BillAgainstProperty from './components/bill-crud/bill-against-property/bill-against-property';
import BillAgainstVendor from './components/bill-crud/bill-against-vendor/bill-against-vendor';
import ManagementFee from './components/bill-crud/management-fee';
import OwnerDraw from './components/bill-crud/owner-draws/owner-draw';
import PayOwner from './components/bill-crud/pay-owner';
import TenantPayable from './components/bill-crud/tenant-payable/tenant-payable';
import TransferByCash from './components/bill-crud/transfer-by-cash/transfer-by-cash';
import TransferFunds from './components/bill-crud/transfer-funds/transfer-funds';

const BillsLanding = () => {
  const { hash } = useLocation();

  const { bill_type } = useParams();

  const [childRender, handleChildRender] = useState({
    hash: '',
    render: '',
  });

  useEffect(() => {
    if (hash === '#/details') {
      handleChildRender({
        hash: hash,
        render: 'details',
      });
    } else if (hash === '#/edit' || hash === '#/create') {
      handleChildRender({
        hash: hash,
        render: 'crud',
      });
    }

    return () => {
      handleChildRender({
        hash: '',
        render: '',
      });
    };
  }, [hash]);

  if (childRender.render === 'crud') {
    switch (bill_type) {
      case 'bill_against_vendor':
        return <BillAgainstVendor />;
      case 'bill_against_property':
        return <BillAgainstProperty />;
      case 'management_fee':
        return <ManagementFee />;
      case 'pay_owners':
        return <PayOwner />;
      case 'owner_draws':
        return <OwnerDraw />;
      case 'tenant_payable':
        return <TenantPayable />;
      case 'transfer_owner_funds':
        return <TransferFunds />;
      case 'transfer_by_cash_account':
        return <TransferByCash />;

      default:
        return <Bills />;
    }
  }
  return <Bills />;
};

export default BillsLanding;
