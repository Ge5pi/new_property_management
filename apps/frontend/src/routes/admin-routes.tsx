import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import { SinglePropertyLoader } from 'services/loaders/property';

import { AdminLayout, SecondarySidebar } from 'components/layouts';
import OutletSuspense from 'components/layouts/layout-container/outlet-suspense';

import { PERMISSIONS } from 'constants/permissions';

import { LoaderType } from 'interfaces/IGeneral';

import GetCrumbs from './crumbs';
import ErrorBoundary from './error-boundary';
import { RouteWithPermissions } from './route-wrapper';
import PrivateRoute, { ProtectedRoute } from './secured-routes';

const ReportsLanding = lazy(() => import('pages/admin/reports/reports-landing'));

const Reports = lazy(() => import('pages/admin/reports/reports'));

const Email = lazy(() => import('pages/admin/communication/emails/emails'));
const EmailCRUD = lazy(() => import('pages/admin/communication/emails/components/email/email-crud'));
const EmailDetails = lazy(() => import('pages/admin/communication/emails/components/details/email-details'));

const EmailTemplates = lazy(() => import('pages/admin/communication/emails/templates'));
const EmailTemplateCreate = lazy(() => import('pages/admin/communication/emails/components/template/template-create'));
const EmailTemplateModify = lazy(() => import('pages/admin/communication/emails/components/template/template-modify'));
const EmailTemplateDetails = lazy(() => import('pages/admin/communication/emails/components/details/template-details'));

const Announcements = lazy(() => import('pages/admin/communication/announcements/announcements'));
const AnnouncementsCreate = lazy(() => import('pages/admin/communication/announcements/announcements-create'));
const AnnouncementsModify = lazy(() => import('pages/admin/communication/announcements/announcements-modify'));
const AnnouncementsDetails = lazy(() => import('pages/admin/communication/announcements/components/details/details'));

const Contacts = lazy(() => import('pages/admin/communication/contacts/contacts'));
const ContactsCreate = lazy(() => import('pages/admin/communication/contacts/contacts-create'));
const ContactsModify = lazy(() => import('pages/admin/communication/contacts/contacts-modify'));
const ContactsDetails = lazy(() => import('pages/admin/communication/contacts/components/details/details'));

const Notes = lazy(() => import('pages/admin/communication/notes/notes'));
const NotesCreate = lazy(() => import('pages/admin/communication/notes/notes-create'));
const NotesModify = lazy(() => import('pages/admin/communication/notes/notes-modify'));
const NotesDetails = lazy(() => import('pages/admin/communication/notes/components/details/details'));

const SystemPreferenceWrapper = lazy(() => import('pages/admin/settings/system-preference/system-preference-wrapper'));

const General = lazy(() => import('pages/admin/settings/system-preference/general'));
const ManagementFee = lazy(() => import('pages/admin/settings/system-preference/management-fee'));
const TypesCategories = lazy(() => import('pages/admin/settings/system-preference/types-categories'));

const BusinessInformation = lazy(() => import('pages/admin/settings/business-information/business-information'));

const Users = lazy(() => import('pages/admin/settings/users-and-roles/users'));
const UserModify = lazy(() => import('pages/admin/settings/users-and-roles/components/users/user-modify'));
const UserCreate = lazy(() => import('pages/admin/settings/users-and-roles/components/users/user-create'));
const UserDetails = lazy(() => import('pages/admin/settings/users-and-roles/user-details'));

const Roles = lazy(() => import('pages/admin/settings/users-and-roles/roles'));
const RolesCreate = lazy(() => import('pages/admin/settings/users-and-roles/components/roles/role-create'));
const RolesModify = lazy(() => import('pages/admin/settings/users-and-roles/components/roles/role-modify'));

const AdminDashboard = lazy(() => import('pages/admin/dashboard/dashboard'));
const DashboardGeneral = lazy(() => import('pages/admin/dashboard/general'));
const DashboardFinancial = lazy(() => import('pages/admin/dashboard/financial'));

const PropertyList = lazy(() => import('pages/admin/property/PropertyList'));
const PropertyForm = lazy(() => import('pages/admin/property/PropertyForm'));

const Properties = lazy(() => import('pages/admin/properties/properties'));
const PropertyDetailWrapper = lazy(() => import('pages/admin/properties/property-details'));

const PropertyDetails = lazy(() => import('pages/admin/properties/components/details/detail'));
const RentableItems = lazy(() => import('pages/admin/properties/components/rentable-items/rentable-items'));
const RentableItemsDetail = lazy(() => import('pages/admin/properties/components/rentable-items/rentable-item-detail'));
const Marketing = lazy(() => import('pages/admin/properties/components/marketing/marketing'));
const Budget = lazy(() => import('pages/admin/properties/components/budget/budget'));

const Units = lazy(() => import('pages/admin/properties/components/units/units'));
const UnitDetails = lazy(() => import('pages/admin/properties/components/units/unit-detail'));
const UnitTypes = lazy(() => import('pages/admin/properties/components/units/unit-types'));
const UnitTypeDetails = lazy(() => import('pages/admin/properties/components/units/unit-types-detail'));

const Associations = lazy(() => import('pages/admin/properties/associations'));
const AssociationDetailWrapper = lazy(() => import('pages/admin/properties/association-details'));

const BoardOfDirectors = lazy(() => import('pages/admin/properties/components/board-of-directors/board-of-directors'));
const ArchitecturalReviews = lazy(
  () => import('pages/admin/properties/components/architectural-review/architectural-reviews')
);
const Approvals = lazy(() => import('pages/admin/properties/components/approvals/approvals'));
const Violations = lazy(() => import('pages/admin/properties/components/violations/violations'));
const Settings = lazy(() => import('pages/admin/properties/components/violations/settings'));

const ServiceRequests = lazy(() => import('pages/admin/maintenance/service-requests/services-requests'));
const ServiceRequestDetails = lazy(() => import('pages/admin/maintenance/service-requests/service-request-details'));
const ServiceRequestCreate = lazy(() => import('pages/admin/maintenance/service-requests/service-requests-create'));
const ServiceRequestModify = lazy(() => import('pages/admin/maintenance/service-requests/service-requests-modify'));

const WorkOrders = lazy(() => import('pages/admin/maintenance/work-orders/work-orders'));
const WorkOrderDetails = lazy(() => import('pages/admin/maintenance/work-orders/work-orders-details'));
const WorkOrderCreate = lazy(() => import('pages/admin/maintenance/work-orders/work-orders-create'));
const WorkOrderModify = lazy(() => import('pages/admin/maintenance/work-orders/work-orders-modify'));

const Inspections = lazy(() => import('pages/admin/maintenance/inspections/inspections'));
const InspectionDetails = lazy(() => import('pages/admin/maintenance/inspections/inspection-details'));

const Projects = lazy(() => import('pages/admin/maintenance/projects/projects'));
const ProjectDetails = lazy(() => import('pages/admin/maintenance/projects/projects-details'));

const PurchaseOrders = lazy(() => import('pages/admin/maintenance/purchase-orders/purchase-orders'));
const PurchaseOrderDetails = lazy(() => import('pages/admin/maintenance/purchase-orders/components/details/details'));
const PurchaseOrderCreate = lazy(
  () => import('pages/admin/maintenance/purchase-orders/components/purchase-order-form/purchase-order-create')
);
const PurchaseOrderModify = lazy(
  () => import('pages/admin/maintenance/purchase-orders/components/purchase-order-form/purchase-order-modify')
);

const Inventory = lazy(() => import('pages/admin/maintenance/inventory/inventory'));
const InventoryDetails = lazy(() => import('pages/admin/maintenance/inventory/inventory-details'));

const FixedAssets = lazy(() => import('pages/admin/maintenance/fixed-assets/fixed-assets'));

const Calendar = lazy(() => import('pages/admin/calendar/calendar'));

// accounts module
const Charges = lazy(() => import('pages/admin/accounts/receivables/charges'));
const ChargeDetail = lazy(() => import('pages/admin/accounts/receivables/charge-details'));
const CreateCharges = lazy(() => import('pages/admin/accounts/receivables/charge-create'));
const ModifyCharges = lazy(() => import('pages/admin/accounts/receivables/charge-modify'));

const Invoices = lazy(() => import('pages/admin/accounts/receivables/invoices'));
const InvoiceDetails = lazy(() => import('pages/admin/accounts/receivables/invoice-details'));

// TODO:
const Bills = lazy(() => import('pages/admin/accounts/payable/bills-landing'));
const Recurring = lazy(() => import('pages/admin/accounts/payable/recurring-landing'));

const Payments = lazy(() => import('pages/admin/accounts/payments/payments'));
const PaymentsDetails = lazy(() => import('pages/admin/accounts/payments/details'));

const BankAccounts = lazy(() => import('pages/admin/accounts/bank-accounts/bank-accounts'));
const BankAccountDetails = lazy(() => import('pages/admin/accounts/bank-accounts/details'));
const BankAccountCreate = lazy(() => import('pages/admin/accounts/bank-accounts/bank-account-create'));
const BankAccountModify = lazy(() => import('pages/admin/accounts/bank-accounts/bank-account-modify'));

const JournalEntries = lazy(() => import('pages/admin/accounts/journal-entries/journal-entries'));
const GL = lazy(() => import('pages/admin/accounts/gl-accounts/gl-accounts'));

const RentalApplications = lazy(() => import('pages/admin/leasing/rental-application/rental-applications'));
const RentalApplicationDetails = lazy(
  () => import('pages/admin/leasing/rental-application/rental-applications-detail')
);

const RentalTemplates = lazy(() => import('pages/admin/leasing/templates/templates'));
const RentalTemplateDetails = lazy(() => import('pages/admin/leasing/templates/template-details'));

const LeaseTemplates = lazy(() => import('pages/admin/leasing/templates/lease-templates'));
const LeaseTemplateDetails = lazy(() => import('pages/admin/leasing/templates/lease-template-details'));

const Leases = lazy(() => import('pages/admin/leasing/leases/leases'));
const LeaseCreate = lazy(() => import('pages/admin/leasing/leases/lease-create'));
const LeaseModify = lazy(() => import('pages/admin/leasing/leases/lease-modify'));
const LeaseRenew = lazy(() => import('pages/admin/leasing/leases/lease-renew'));
const LeaseDetails = lazy(() => import('pages/admin/leasing/leases/components/details/details'));

const Tenants = lazy(() => import('pages/admin/peoples/tenants/tenants'));
const TenantDetails = lazy(() => import('pages/admin/peoples/tenants/tenant-details'));

const Vendors = lazy(() => import('pages/admin/peoples/vendors/vendors'));
const VendorCreate = lazy(() => import('pages/admin/peoples/vendors/vendor-create'));
const VendorModify = lazy(() => import('pages/admin/peoples/vendors/vendor-modify'));

const VendorDetailWrapper = lazy(() => import('pages/admin/peoples/vendors/components/details/vendor-details-wrapper'));

const VendorGeneralDetails = lazy(() => import('pages/admin/peoples/vendors/components/details/general-details'));
const VendorFinancesDetails = lazy(() => import('pages/admin/peoples/vendors/components/details/finances-details'));
const VendorCommunicationList = lazy(() => import('pages/admin/peoples/vendors/components/details/communication-list'));

const VendorTypes = lazy(() => import('pages/admin/peoples/vendors/vendor-types'));

const Owners = lazy(() => import('pages/admin/peoples/owners/owners'));
const OwnerDetails = lazy(() => import('pages/admin/peoples/owners/components/details/details'));
const OwnerCreate = lazy(() => import('pages/admin/peoples/owners/owners-create'));
const OwnerModify = lazy(() => import('pages/admin/peoples/owners/owners-modify'));

const LoginAdmin = lazy(() => import('pages/admin/login/login'));

export const admin: RouteWithPermissions[] = [
  {
    path: '/',
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="admin" replace />,
      },
      {
        path: 'admin',
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <LoginAdmin />,
          },
        ],
      },
      {
        path: 'admin',
        element: <PrivateRoute />,
        children: [
          {
            element: <OutletSuspense />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  {
                    path: 'dashboard',
                    element: <AdminDashboard />,
                    handle: { crumb: () => <GetCrumbs data="Dashboard" /> },
                    children: [
                      {
                        index: true,
                        key: PERMISSIONS.GENERAL_DASHBOARD,
                        element: <DashboardGeneral />,
                      },
                      {
                        path: 'financial',
                        element: <DashboardFinancial />,
                      },
                    ],
                  },
                  {
                    path: 'properties',
                    key: PERMISSIONS.PROPERTY,
                    element: <OutletSuspense />,
                    handle: { crumb: () => <GetCrumbs data="Properties" /> },
                    children: [
                      {
                        index: true,
                        element: <Properties />,
                      },
                      {
                        path: 'list',
                        element: <PropertyList />,
                      },
                      {
                        path: 'new',
                        element: <PropertyForm />,
                      },
                      {
                        path: 'edit/:id',
                        element: <PropertyForm />,
                      },
                      {
                        path: ':property',
                        element: <PropertyDetailWrapper />,
                        handle: { crumb: (data: LoaderType<unknown>) => <GetCrumbs data={data} dataKey="name" /> },
                        loader: SinglePropertyLoader,
                        children: [
                          {
                            path: 'details',
                            element: <PropertyDetails />,
                          },
                          {
                            path: 'units',
                            element: <OutletSuspense />,
                            children: [
                              {
                                index: true,
                                element: <Units />,
                              },
                              {
                                path: 'details/:unit',
                                element: <UnitDetails />,
                              },
                            ],
                          },
                          {
                            path: 'rentable-items',
                            element: <OutletSuspense />,
                            children: [
                              {
                                index: true,
                                element: <RentableItems />,
                              },
                              {
                                path: 'details/:rentable',
                                element: <RentableItemsDetail />,
                              },
                            ],
                          },
                          {
                            path: 'unit-types',
                            element: <OutletSuspense />,
                            children: [
                              {
                                index: true,
                                element: <UnitTypes />,
                              },
                              {
                                path: 'details/:type',
                                element: <UnitTypeDetails />,
                              },
                            ],
                          },
                          {
                            path: 'budget',
                            element: <Budget />,
                          },
                          {
                            path: 'marketing',
                            element: <Marketing />,
                          },
                          {
                            path: '*',
                            element: <Navigate to="details" replace />,
                          },
                        ],
                      },
                      {
                        path: 'associations',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Associations" /> },
                        children: [
                          {
                            index: true,
                            element: <Associations />,
                          },
                          {
                            path: ':property',
                            element: <AssociationDetailWrapper />,
                            handle: { crumb: (data: LoaderType<unknown>) => <GetCrumbs data={data} dataKey="name" /> },
                            loader: SinglePropertyLoader,
                            children: [
                              {
                                path: 'details',
                                element: <PropertyDetails />,
                              },
                              {
                                path: 'units',
                                element: <OutletSuspense />,
                                children: [
                                  {
                                    index: true,
                                    element: <Units />,
                                  },
                                  {
                                    path: 'details/:unit',
                                    element: <UnitDetails />,
                                  },
                                ],
                              },
                              {
                                path: 'unit-types',
                                element: <OutletSuspense />,
                                children: [
                                  {
                                    index: true,
                                    element: <UnitTypes />,
                                  },
                                  {
                                    path: 'details/:type',
                                    element: <UnitTypeDetails />,
                                  },
                                ],
                              },
                              {
                                path: 'directors',
                                element: <BoardOfDirectors />,
                              },
                              {
                                path: 'approvals',
                                element: <Approvals />,
                              },
                              {
                                path: 'arch-reviews',
                                element: <ArchitecturalReviews />,
                              },
                              {
                                path: 'budget',
                                element: <Budget />,
                              },
                              {
                                path: 'violations',
                                element: <Violations />,
                              },
                              {
                                path: 'settings',
                                element: <Settings />,
                              },
                              {
                                path: '*',
                                element: <Navigate to="details" replace />,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: 'maintenance',
                    key: PERMISSIONS.MAINTENANCE,
                    element: <OutletSuspense />,
                    handle: { crumb: () => <GetCrumbs data="Maintenance" /> },
                    children: [
                      {
                        index: true,
                        element: <Navigate to="service-requests" replace />,
                      },
                      {
                        path: 'service-requests',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Service Requests" /> },
                        children: [
                          {
                            index: true,
                            element: <ServiceRequests />,
                          },
                          {
                            path: 'details/:request',
                            element: <ServiceRequestDetails />,
                          },
                          {
                            path: 'create',
                            element: <ServiceRequestCreate />,
                          },
                          {
                            path: 'modify/:request',
                            element: <ServiceRequestModify />,
                          },
                        ],
                      },
                      {
                        path: 'work-orders',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Work Orders" /> },
                        children: [
                          {
                            index: true,
                            element: <WorkOrders />,
                          },
                          {
                            path: ':order/details/:request',
                            element: <WorkOrderDetails />,
                          },
                          {
                            path: 'create/:request?',
                            element: <WorkOrderCreate />,
                          },
                          {
                            path: ':order/modify/:request',
                            element: <WorkOrderModify />,
                          },
                        ],
                      },
                      {
                        path: 'inspections',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Inspections" /> },
                        children: [
                          {
                            index: true,
                            element: <Inspections />,
                          },
                          {
                            path: 'details/:inspection',
                            element: <InspectionDetails />,
                          },
                        ],
                      },
                      {
                        path: 'projects',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Projects" /> },
                        children: [
                          {
                            index: true,
                            element: <Projects />,
                          },
                          {
                            path: 'details/:project',
                            element: <ProjectDetails />,
                          },
                        ],
                      },
                      {
                        path: 'purchase-orders',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Purchase Orders" /> },
                        children: [
                          {
                            index: true,
                            element: <PurchaseOrders />,
                          },
                          {
                            path: 'details/:purchase',
                            element: <PurchaseOrderDetails />,
                          },
                          {
                            path: 'create',
                            element: <PurchaseOrderCreate />,
                          },
                          {
                            path: 'modify/:purchase',
                            element: <PurchaseOrderModify />,
                          },
                        ],
                      },
                      {
                        path: 'inventory',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Inventory" /> },
                        children: [
                          {
                            index: true,
                            element: <Inventory />,
                          },
                          {
                            path: 'details/:inventory',
                            element: <InventoryDetails />,
                          },
                        ],
                      },
                      {
                        path: 'fixed-assets',
                        element: <FixedAssets />,
                        handle: { crumb: () => <GetCrumbs data="Fixed Assets" /> },
                      },
                    ],
                  },
                  {
                    path: 'calendar',
                    element: <Calendar />,
                    handle: { crumb: () => <GetCrumbs data="Calendar" /> },
                  },
                  {
                    path: 'accounts',
                    key: PERMISSIONS.ACCOUNTS,
                    element: <OutletSuspense />,
                    handle: { crumb: () => <GetCrumbs data="Accounts" /> },
                    children: [
                      {
                        index: true,
                        element: <Navigate to="receivables" replace />,
                      },
                      {
                        path: 'receivables',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Receivables" /> },
                        children: [
                          {
                            index: true,
                            element: <Invoices />,
                            handle: { crumb: () => <GetCrumbs data="Invoices" /> },
                          },
                          {
                            path: ':invoice/details',
                            element: <InvoiceDetails />,
                          },
                          {
                            path: 'charges',
                            element: <OutletSuspense />,
                            handle: { crumb: () => <GetCrumbs data="Charges" /> },
                            children: [
                              {
                                index: true,
                                element: <Charges />,
                              },
                              {
                                path: ':charge/modify',
                                element: <ModifyCharges />,
                              },
                              {
                                path: ':charge/details',
                                element: <ChargeDetail />,
                              },
                              {
                                path: 'create',
                                element: <CreateCharges />,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        path: 'payable',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Payable" /> },
                        children: [
                          {
                            index: true,
                            element: <Bills />,
                            handle: { crumb: () => <GetCrumbs data="Bills" /> },
                          },
                          {
                            path: 'bills/:bill_type',
                            element: <Bills />,
                            handle: { crumb: () => <GetCrumbs data="Bills" /> },
                          },
                          {
                            path: 'recurring',
                            element: <Recurring />,
                            handle: { crumb: () => <GetCrumbs data="Recurring" /> },
                          },
                        ],
                      },
                      {
                        path: 'bank-accounts',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Charges" /> },
                        children: [
                          {
                            index: true,
                            element: <BankAccounts />,
                          },
                          {
                            path: ':account_id/modify',
                            element: <BankAccountModify />,
                          },
                          {
                            path: ':account_id/details',
                            element: <BankAccountDetails />,
                          },
                          {
                            path: 'create',
                            element: <BankAccountCreate />,
                          },
                        ],
                      },
                      {
                        path: 'payments',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Payments" /> },
                        children: [
                          {
                            index: true,
                            element: <Payments />,
                          },
                          {
                            path: 'details/:id',
                            element: <PaymentsDetails />,
                          },
                        ],
                      },
                      {
                        path: 'journal-entries',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Journal Entries" /> },
                        children: [
                          {
                            index: true,
                            element: <Navigate to="asset" replace />,
                          },
                          {
                            path: ':account',
                            element: <JournalEntries />,
                          },
                        ],
                      },
                      {
                        path: 'gl-accounts',
                        element: <GL />,
                        handle: { crumb: () => <GetCrumbs data="GL Accounts" /> },
                      },
                    ],
                  },
                  {
                    path: 'leasing',
                    key: PERMISSIONS.LEASING,
                    element: <OutletSuspense />,
                    handle: { crumb: () => <GetCrumbs data="Leasing" /> },
                    children: [
                      {
                        index: true,
                        element: <Navigate to="rental-applications" replace />,
                      },
                      {
                        path: 'rental-applications',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Rental Applications" /> },
                        children: [
                          {
                            index: true,
                            element: <RentalApplications />,
                          },
                          {
                            path: ':applicant/details/:application',
                            element: <RentalApplicationDetails />,
                          },
                        ],
                      },
                      {
                        path: 'leases',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Leases" /> },
                        children: [
                          {
                            index: true,
                            element: <Leases />,
                          },
                          {
                            path: ':lease/modify',
                            element: <LeaseModify />,
                          },
                          {
                            path: ':lease/renew',
                            element: <LeaseRenew />,
                          },
                          {
                            path: 'details/:lease',
                            element: <LeaseDetails />,
                          },
                          {
                            path: 'create',
                            element: <LeaseCreate />,
                          },
                        ],
                      },
                      {
                        path: 'templates',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Templates" /> },
                        children: [
                          {
                            index: true,
                            element: <RentalTemplates />,
                            handle: { crumb: () => <GetCrumbs data="Rental Application" /> },
                          },
                          {
                            path: ':template/details',
                            element: <RentalTemplateDetails />,
                          },
                          {
                            path: 'leases',
                            element: <OutletSuspense />,
                            children: [
                              {
                                index: true,
                                element: <LeaseTemplates />,
                                handle: { crumb: () => <GetCrumbs data="Lease" /> },
                              },
                              {
                                path: ':template/details',
                                element: <LeaseTemplateDetails />,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: 'peoples',
                    key: PERMISSIONS.PEOPLE,
                    element: <OutletSuspense />,
                    handle: { crumb: () => <GetCrumbs data="Peoples" /> },
                    children: [
                      {
                        index: true,
                        element: <Navigate to="tenants" replace />,
                      },
                      {
                        path: 'tenants',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Tenants" /> },
                        children: [
                          {
                            index: true,
                            element: <Tenants />,
                          },
                          {
                            path: ':tenant/details',
                            element: <TenantDetails />,
                          },
                        ],
                      },
                      {
                        path: 'vendors',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Vendors" /> },
                        children: [
                          {
                            index: true,
                            element: <Vendors />,
                          },
                          {
                            path: 'create',
                            element: <VendorCreate />,
                          },
                          {
                            path: ':vendor/modify',
                            element: <VendorModify />,
                          },
                          {
                            path: ':vendor',
                            element: <VendorDetailWrapper />,
                            children: [
                              {
                                path: 'general-details',
                                element: <VendorGeneralDetails />,
                                handle: { crumb: () => <GetCrumbs data="General Details" /> },
                              },
                              {
                                path: 'finances-details',
                                element: <VendorFinancesDetails />,
                                handle: { crumb: () => <GetCrumbs data="Financial Details" /> },
                              },
                              {
                                path: 'messages',
                                key: PERMISSIONS.COMMUNICATION,
                                element: <OutletSuspense />,
                                handle: { crumb: () => <GetCrumbs data="Communications" /> },
                                children: [
                                  {
                                    index: true,
                                    element: <VendorCommunicationList />,
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            path: 'types',
                            handle: { crumb: () => <GetCrumbs data="Types" /> },
                            element: <VendorTypes />,
                          },
                        ],
                      },
                      {
                        path: 'owners',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Owners" /> },
                        children: [
                          {
                            index: true,
                            element: <Owners />,
                          },
                          {
                            path: ':owner/details',
                            element: <OwnerDetails />,
                          },
                          {
                            path: 'create',
                            element: <OwnerCreate />,
                          },
                          {
                            path: ':owner/modify',
                            element: <OwnerModify />,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: 'communication',
                    key: PERMISSIONS.COMMUNICATION,
                    element: <OutletSuspense />,
                    handle: { crumb: () => <GetCrumbs data="Communication" /> },
                    children: [
                      {
                        index: true,
                        element: <Navigate to="announcements" replace />,
                      },
                      {
                        path: 'announcements',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Announcements" /> },
                        children: [
                          {
                            index: true,
                            element: <Announcements />,
                          },
                          {
                            path: 'create',
                            element: <AnnouncementsCreate />,
                          },
                          {
                            path: 'modify/:announcement',
                            element: <AnnouncementsModify />,
                          },
                          {
                            path: 'details/:announcement',
                            element: <AnnouncementsDetails />,
                          },
                        ],
                      },
                      {
                        path: 'emails',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Emails" /> },
                        children: [
                          {
                            index: true,
                            element: <Email />,
                          },
                          {
                            path: 'details/:email',
                            element: <EmailDetails />,
                          },
                          {
                            path: 'create',
                            element: <EmailCRUD />,
                          },
                          {
                            path: 'template',
                            element: <OutletSuspense />,
                            handle: { crumb: () => <GetCrumbs data="Email Templates" /> },
                            children: [
                              {
                                index: true,
                                element: <EmailTemplates />,
                              },
                              {
                                path: 'details/:template',
                                element: <EmailTemplateDetails />,
                              },
                              {
                                path: 'modify/:template',
                                element: <EmailTemplateModify />,
                              },
                              {
                                path: 'create',
                                element: <EmailTemplateCreate />,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        path: 'contacts',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Contacts" /> },
                        children: [
                          {
                            index: true,
                            element: <Contacts />,
                          },
                          {
                            path: 'create',
                            element: <ContactsCreate />,
                          },
                          {
                            path: 'modify/:contact',
                            element: <ContactsModify />,
                          },
                          {
                            path: 'details/:contact',
                            element: <ContactsDetails />,
                          },
                        ],
                      },
                      {
                        path: 'notes',
                        element: <OutletSuspense />,
                        handle: { crumb: () => <GetCrumbs data="Notes" /> },
                        children: [
                          {
                            index: true,
                            element: <Notes />,
                          },
                          {
                            path: 'details/:note',
                            element: <NotesDetails />,
                          },
                          {
                            path: 'modify/:note',
                            element: <NotesModify />,
                          },
                          {
                            path: 'create',
                            element: <NotesCreate />,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: 'reports',
                    element: <OutletSuspense />,
                    handle: { crumb: () => <GetCrumbs data="Reports" /> },
                    children: [
                      {
                        index: true,
                        element: <Reports />,
                      },
                      {
                        path: ':report',
                        element: <ReportsLanding />,
                      },
                    ],
                  },
                ],
              },
              {
                element: <AdminLayout noSidebar />,
                children: [
                  {
                    path: 'settings',
                    element: <SecondarySidebar />,
                    handle: { crumb: () => <GetCrumbs data="Settings" /> },
                    children: [
                      {
                        index: true,
                        element: <Navigate to="system-preferences" replace />,
                      },
                      {
                        path: 'system-preferences',
                        key: PERMISSIONS.SYSTEM_PREFERENCES,
                        element: <SystemPreferenceWrapper />,
                        handle: { crumb: () => <GetCrumbs data="System Preferences" /> },
                        children: [
                          {
                            index: true,
                            element: <TypesCategories />,
                          },
                          {
                            path: 'general',
                            element: <General />,
                          },
                          {
                            path: 'management-fee',
                            element: <ManagementFee />,
                          },
                        ],
                      },
                      {
                        key: PERMISSIONS.ADMIN,
                        subscription: true,
                        path: 'business-information',
                        element: <BusinessInformation />,
                        handle: { crumb: () => <GetCrumbs data="Business Information" /> },
                      },
                      {
                        key: PERMISSIONS.ADMIN,
                        subscription: true,
                        path: 'users-and-roles',
                        element: <OutletSuspense />,
                        children: [
                          {
                            index: true,
                            element: <Users />,
                            handle: { crumb: () => <GetCrumbs data="Users" /> },
                          },
                          {
                            path: 'create',
                            element: <UserCreate />,
                          },
                          {
                            path: 'modify/:user',
                            element: <UserModify />,
                          },
                          {
                            path: 'details/:user',
                            element: <UserDetails />,
                          },
                          {
                            path: 'roles',
                            element: <OutletSuspense />,
                            children: [
                              {
                                index: true,
                                element: <Roles />,
                                handle: { crumb: () => <GetCrumbs data="Roles" /> },
                              },
                              {
                                path: 'create',
                                element: <RolesCreate />,
                              },
                              {
                                path: 'modify/:role',
                                element: <RolesModify />,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
