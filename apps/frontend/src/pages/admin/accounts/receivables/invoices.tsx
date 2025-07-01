import { RentalInvoices } from 'core-ui/rental-invoices';

import { PERMISSIONS } from 'constants/permissions';

import ReceivableHeader from './receivable-navigation';

const Invoices = () => {
  return <RentalInvoices wrapperFor="ADMIN" pageHeader={<ReceivableHeader />} permissions={PERMISSIONS.ACCOUNTS} />;
};

export default Invoices;
