import { useParams } from 'react-router-dom';

import AssociationByStatus from './components/association-by-status';
import AssociationUnitReport from './components/association-unit-report';
import ChargesReport from './components/charges-report';
import FixedAssetsReports from './components/fixed-assets-reports';
import InspectionReport from './components/inspection-report';
import InventoryReport from './components/inventory-report';
import LeasesReport from './components/leases-report';
import OwnerReport from './components/owner-report';
import ProjectReport from './components/project-report';
import PropertiesByStatus from './components/properties-by-status';
import PropertiesUnitReport from './components/properties-unit-report';
import PurchaseOrdersReport from './components/purchase-orders-report';
import ReceiptsReport from './components/receipts-report';
import RentalApplicationsReport from './components/rental-applications-report';
import ServiceRequestsReport from './components/service-requests-report';
import TenantsReport from './components/tenants-report';
import VendorReport from './components/vendor-report';
import WorkOrdersReport from './components/work-orders-reports';

const ReportsLanding = () => {
  const { report } = useParams();

  switch (report) {
    case 'properties-by-status':
      return <PropertiesByStatus />;
    case 'properties-units-reports':
      return <PropertiesUnitReport />;
    case 'associations-units-report':
      return <AssociationUnitReport />;
    case 'associations-by-status':
      return <AssociationByStatus />;
    case 'service-requests-report':
      return <ServiceRequestsReport />;
    case 'work-orders-report':
      return <WorkOrdersReport />;
    case 'inspection-report':
      return <InspectionReport />;
    case 'projects-report':
      return <ProjectReport />;
    case 'purchase-orders-report':
      return <PurchaseOrdersReport />;
    case 'inventory-report':
      return <InventoryReport />;
    case 'fixed-assets-reports':
      return <FixedAssetsReports />;
    case 'receipts-report':
      return <ReceiptsReport />;
    case 'charges-report':
      return <ChargesReport />;
    case 'rental-applications-report':
      return <RentalApplicationsReport />;
    case 'leases-report':
      return <LeasesReport />;
    case 'tenants-report':
      return <TenantsReport />;
    case 'vendor-report':
      return <VendorReport />;
    case 'owner-report':
      return <OwnerReport />;

    default:
      return null;
  }
};

export default ReportsLanding;
