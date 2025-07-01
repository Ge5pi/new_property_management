import { RentalInvoices } from 'core-ui/rental-invoices';

import ReceivableHeader from './receivable-navigation';

const Invoices = () => {
  return <RentalInvoices wrapperFor="TENANT" pageHeader={<ReceivableHeader />} />;
};

export default Invoices;
