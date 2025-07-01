import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import { TenantLayout } from 'components/layouts/layout-container';
import OutletSuspense from 'components/layouts/layout-container/outlet-suspense';

import ChargeDetails from 'pages/tenant/accounting/charge-details';
import RentalInvoiceDetails from 'pages/tenant/accounting/rental-invoice-details';

import GetCrumbs from './crumbs';
import ErrorBoundary from './error-boundary';
import { RouteWithPermissions } from './route-wrapper';
import PrivateRoute, { ProtectedRoute } from './secured-routes';

const Dashboard = lazy(() => import('pages/tenant/dashboard/dashboard'));

const Requests = lazy(() => import('pages/tenant/requests/requests'));
const RequestsCreate = lazy(() => import('pages/tenant/requests/requests-create'));
const RequestsModify = lazy(() => import('pages/tenant/requests/requests-modify'));
const RequestsDetails = lazy(() => import('pages/tenant/requests/requests-details'));

const WorkOrders = lazy(() => import('pages/tenant/requests/work-orders'));

const Announcements = lazy(() => import('pages/tenant/announcements/announcements'));
const AnnouncementDetails = lazy(() => import('pages/tenant/announcements/details'));

const Documents = lazy(() => import('pages/tenant/documents/documents'));

const RentalInvoices = lazy(() => import('pages/tenant/accounting/rental-invoices'));
const Charges = lazy(() => import('pages/tenant/accounting/charges'));

const Payments = lazy(() => import('pages/tenant/accounting/payments/payments'));
const PaymentsDetails = lazy(() => import('pages/tenant/accounting/payments/details'));
const CreatePayment = lazy(() => import('pages/tenant/accounting/payments/create'));
const ModifyPayment = lazy(() => import('pages/tenant/accounting/payments/modify'));

const Contact = lazy(() => import('pages/tenant/contact-us/contact-us'));

const LoginTenant = lazy(() => import('pages/tenant/auth/login'));
const ForgotPassword = lazy(() => import('pages/tenant/auth/forgot-password'));
const ChangePassword = lazy(() => import('pages/tenant/auth/change-password'));
const OTPConfirmation = lazy(() => import('pages/tenant/auth/otp-confirmation'));

export const tenant: RouteWithPermissions[] = [
  {
    path: '/',
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="tenant" replace />,
      },
      {
        path: 'tenant',
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <LoginTenant />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPassword />,
          },
          {
            path: 'otp-confirmation',
            element: <OTPConfirmation />,
          },
          {
            path: 'change-password',
            element: <ChangePassword />,
          },
        ],
      },
      {
        path: 'tenant',
        element: <PrivateRoute />,
        children: [
          {
            element: <OutletSuspense />,
            children: [
              {
                element: <TenantLayout />,
                children: [
                  {
                    path: 'dashboard',
                    element: <Dashboard />,
                    handle: { crumb: () => <GetCrumbs data="Dashboard" /> },
                  },
                  {
                    path: 'requests',
                    element: <OutletSuspense />,
                    handle: { crumb: () => <GetCrumbs data="Requests" /> },
                    children: [
                      {
                        index: true,
                        element: <Requests />,
                      },
                      {
                        path: 'create',
                        element: <RequestsCreate />,
                      },
                      {
                        path: 'details/:request',
                        element: <RequestsDetails />,
                      },
                      {
                        path: ':request/modify',
                        element: <RequestsModify />,
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
                        ],
                      },
                    ],
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
                        path: 'details/:announcement',
                        element: <AnnouncementDetails />,
                      },
                    ],
                  },
                  {
                    path: 'documents',
                    element: <Documents />,
                    handle: { crumb: () => <GetCrumbs data="Documents" /> },
                  },
                  {
                    path: 'accounting',
                    element: <OutletSuspense />,
                    handle: { crumb: () => <GetCrumbs data="Accounting" /> },
                    children: [
                      {
                        index: true,
                        handle: { crumb: () => <GetCrumbs data="Invoices" /> },
                        element: <RentalInvoices />,
                      },
                      {
                        path: ':invoice_id/details',
                        element: <RentalInvoiceDetails />,
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
                            path: ':charge/details',
                            element: <ChargeDetails />,
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
                          {
                            path: 'create/:invoice_id',
                            element: <CreatePayment />,
                          },
                          {
                            path: 'modify/:invoice_id/:id',
                            element: <ModifyPayment />,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: 'contact-us',
                    element: <Contact />,
                    handle: { crumb: () => <GetCrumbs data="Contact Us" /> },
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
