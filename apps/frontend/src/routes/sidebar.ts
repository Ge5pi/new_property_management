import {
  AccountsIcon,
  AnnouncementIcon,
  BarChartIcon,
  CalendarIcon,
  ContactIcon,
  DashboardIcon,
  DocumentIcon,
  DollarIcon,
  MaintenanceIcon,
  PeoplesIcon,
  PropertiesIcon,
  RequestIcon,
} from 'core-ui/icons';

import { PERMISSIONS } from 'constants/permissions';

export const adminRoutes = [
  {
    title: 'Dashboard',
    path: 'dashboard',
    icon: DashboardIcon,
  },
  {
    title: 'Properties',
    path: 'properties',
    key: PERMISSIONS.PROPERTY,
    icon: PropertiesIcon,
  },
  {
    title: 'Maintenance',
    path: 'maintenance',
    icon: MaintenanceIcon,
    key: PERMISSIONS.MAINTENANCE,
    subNav: [
      {
        title: 'Service Requests',
        path: 'service-requests',
      },
      {
        title: 'Work Orders',
        path: 'work-orders',
      },
      {
        title: 'Inspections',
        path: 'inspections',
      },
      {
        title: 'Projects',
        path: 'projects',
      },
      {
        title: 'Inventory',
        path: 'inventory',
      },
      {
        title: 'Purchase Orders',
        path: 'purchase-orders',
      },
      {
        title: 'Fixed Assets',
        path: 'fixed-assets',
      },
    ],
  },
  {
    title: 'Calendar',
    path: 'calendar',
    icon: CalendarIcon,
  },
  {
    title: 'Accounts',
    path: 'accounts',
    key: PERMISSIONS.ACCOUNTS,
    icon: AccountsIcon,
    subNav: [
      {
        title: 'Receivables',
        path: 'receivables',
      },
      {
        title: 'Payable',
        path: 'payable',
      },
      {
        title: 'Bank Accounts',
        path: 'bank-accounts',
      },
      {
        title: 'Payments',
        path: 'payments',
      },
      {
        title: 'Journal Entries',
        path: 'journal-entries',
      },
      {
        title: 'GL Accounts',
        path: 'gl-accounts',
      },
    ],
  },
  {
    title: 'Leasing',
    path: 'leasing',
    key: PERMISSIONS.LEASING,
    icon: DollarIcon,
    subNav: [
      {
        title: 'Rental Applications',
        path: 'rental-applications',
      },
      {
        title: 'Leases',
        path: 'leases',
      },
      {
        title: 'Templates',
        path: 'templates',
      },
    ],
  },
  {
    title: 'Peoples',
    path: 'peoples',
    key: PERMISSIONS.PEOPLE,
    icon: PeoplesIcon,
    subNav: [
      {
        title: 'Tenants',
        path: 'tenants',
      },
      {
        title: 'Vendors',
        path: 'vendors',
      },
      {
        title: 'Owners',
        path: 'owners',
      },
    ],
  },
  {
    title: 'Communication',
    path: 'communication',
    key: PERMISSIONS.COMMUNICATION,
    icon: PeoplesIcon,
    subNav: [
      {
        title: 'Announcements',
        path: 'announcements',
      },
      {
        title: 'Emails',
        path: 'emails',
      },
      {
        title: 'Contacts',
        path: 'contacts',
      },
      {
        title: 'Notes',
        path: 'notes',
      },
    ],
  },
  {
    title: 'Reports',
    path: 'reports',
    icon: BarChartIcon,
  },
];

export const tenantRoutes = [
  {
    title: 'Dashboard',
    path: 'dashboard',
    icon: DashboardIcon,
  },
  {
    title: 'Requests',
    path: 'requests',
    icon: RequestIcon,
  },
  {
    title: 'Announcements',
    path: 'announcements',
    icon: AnnouncementIcon,
  },
  {
    title: 'Documents',
    path: 'documents',
    icon: DocumentIcon,
  },
  {
    title: 'Accounting',
    path: 'accounting',
    icon: AccountsIcon,
  },
  {
    title: 'Contact Us',
    path: 'contact-us',
    icon: ContactIcon,
  },
];

export const settingsRoutes = [
  {
    key: PERMISSIONS.SYSTEM_PREFERENCES,
    title: 'System Preferences',
    path: 'system-preferences',
  },
  {
    subscription: true,
    key: PERMISSIONS.ADMIN,
    title: 'Business Information',
    path: 'business-information',
  },
  {
    subscription: true,
    key: PERMISSIONS.ADMIN,
    title: 'Users & Roles',
    path: 'users-and-roles',
  },
];
