import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { AxiosError, AxiosRequestConfig } from 'axios';

import { privateAxios } from 'config/axios.config';

import { handleAxiosError } from 'utils/functions';

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    try {
      const result = await privateAxios({ url, method, data, params });
      return { data: result.data === '' ? true : result.data };
    } catch (axiosError) {
      const error = axiosError as AxiosError;
      const err = handleAxiosError(error);
      const dataType = error.response?.headers['content-type']
        ? error.response?.headers['content-type']
        : error.response?.headers['Content-Type'];
      return { error: { status: err.code, data: error.response ? error.response.data : err.message, type: dataType } };
    }
  };

export const api = createApi({
  baseQuery: axiosBaseQuery(),
  // define all tags here
  tagTypes: [
    'Properties',
    'PropertyOwners',
    'PropertyLeaseAttachments',
    'PropertyRenewalAttachments',
    'PropertyAttachments',
    'PropertyPhotos',
    'PropertiesOwned',
    'PropertyUtilityBilling',
    'PropertyLateFeePolicy',

    'Units',
    'UnitPhotos',

    'UnitTypes',
    'UnitTypePhotos',

    'RentableItems',
    'IncreaseRent',
    'ServiceRequests',
    'ServiceRequestsAttachments',
    'Inspections',
    'InspectionAreas',
    'InspectionAreaItems',
    'WorkOrders',
    'WorkOrderForSR',
    'WorkOrderLabors',
    'Owners',
    'Vendors',
    'VendorTypes',
    'VendorsAddress',
    'VendorsAttachments',
    'RentalTemplates',
    'RentalApplicants',
    'RentalApplications',
    'RentalApplicationAttachments',
    'RentalHistory',
    'RentalFinancial',
    'RentalAdditionalIncome',
    'RentalDependents',
    'RentalDependentsPets',
    'RentalEmergencyContact',
    'Leases',
    'LeaseTemplates',
    'LeaseTenant',
    'Tenants',
    'TenantsAttachments',
    'PropertyTypes',
    'InventoryTypes',
    'GeneralTags',
    'GeneralLabels',
    'InventoryLocations',
    'ManagementFee',
    'PropertyUpcomingActivity',
    'UnitUpcomingActivity',
    'TenantUpcomingActivity',
    'OwnerUpcomingActivity',
    'SignedURLs',
    'BusinessInformation',
    'ContactCategories',
    'Inventory',
    'FixedAssets',

    'Projects',
    'Expenses',
    'ExpensesAttachments',

    'Notes',
    'NotesAttachments',
    'Announcements',
    'AnnouncementUnits',
    'AnnouncementsAttachments',
    'Contacts',
    'EmailTemplates',
    'EmailSignatures',
    'Emails',
    'Users',
    'UserRoles',
    'PurchaseOrders',
    'PurchaseOrdersAttachments',
    'PurchaseOrderItem',
    'DashboardStatistics',
    'DashboardGeneralStatistics',
    'PropertiesPortfolio',
    'DashboardUpcomingActivity',
    'Charges',
    'ChargesAttachments',
    'Invoices',
    'Groups',
    'CurrentUser',
    'Calendar',

    'BankAccounts',
    'BankAccountsAttachments',
    'PaymentsAttachments',
    'Payments',
    'GeneralLedgerAccounts',
    'GeneralLedgerTransactions',

    'TenantAnnouncements',
    'TenantCharges',
    'TenantInvoice',
    'TenantLeases',
    'TenantServiceRequests',
    'TenantWorkOrders',
    'TenantContacts',
    'TenantPayments',
    'TenantUserInformation',
    'TenantPaymentsAttachments',
  ],
  endpoints: () => ({}),
});
