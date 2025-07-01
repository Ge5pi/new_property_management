import { parseURLParams } from 'utils/functions';

import { IPaginationData } from 'interfaces/IGeneral';
import {
  IPurchaseOrder,
  IPurchaseOrderAttachments,
  IPurchaseOrderFilter,
  IPurchaseOrderItem,
} from 'interfaces/IMaintenance';

import { api } from './base';

const purchaseOrderAPI = api.injectEndpoints({
  endpoints: build => ({
    getPurchaseOrders: build.query<IPaginationData<IPurchaseOrder>, IPurchaseOrderFilter>({
      query: params => ({
        url: `/api/maintenance/purchase-orders/?${parseURLParams(params)}`,
        method: 'get',
      }),
      transformResponse: (response: IPaginationData<IPurchaseOrder>) => {
        response.results = response.results.map(result => ({
          ...result,
          vendor_name: `${result.vendor_first_name} ${result.vendor_last_name}`,
        }));
        return response;
      },
      transformErrorResponse: baseQueryReturnValue => {
        return baseQueryReturnValue;
      },
      providesTags: response =>
        response
          ? [
              ...response.results.map(({ id }) => ({ type: 'PurchaseOrders' as const, id })),
              { type: 'PurchaseOrders', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'PurchaseOrders', id: 'PARTIAL-LIST' }],
    }),
    getPurchaseOrderById: build.query<IPurchaseOrder, number>({
      query: id => ({
        url: `/api/maintenance/purchase-orders/${id}/`,
        method: 'get',
      }),
      providesTags: (result, error, id) => [{ type: 'PurchaseOrders', id }],
    }),
    createPurchaseOrder: build.mutation<IPurchaseOrder, Omit<IPurchaseOrder, 'items'>>({
      query: data => ({
        url: `/api/maintenance/purchase-orders/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'PurchaseOrders', id: 'PARTIAL-LIST' }],
    }),
    updatePurchaseOrder: build.mutation<IPurchaseOrder, Partial<Omit<IPurchaseOrder, 'items'>>>({
      query: data => ({
        url: `/api/maintenance/purchase-orders/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'PurchaseOrders', id },
        { type: 'PurchaseOrders', id: 'PARTIAL-LIST' },
      ],
    }),
    deletePurchaseOrder: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/maintenance/purchase-orders/${id}/`,
          method: 'delete',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'PurchaseOrders', id },
        { type: 'PurchaseOrders', id: 'PARTIAL-LIST' },
      ],
    }),
    getPurchaseOrderAttachments: build.query<Array<IPurchaseOrderAttachments>, string | number>({
      query: purchase_order_id => {
        return {
          url: `/api/maintenance/purchase-orders/${purchase_order_id}/attachments/`,
          method: 'GET',
        };
      },
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'PurchaseOrdersAttachments' as const, id })),
              { type: 'PurchaseOrdersAttachments', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'PurchaseOrdersAttachments', id: 'PARTIAL-LIST' }],
    }),
    createPurchaseOrderAttachments: build.mutation<IPurchaseOrderAttachments, IPurchaseOrderAttachments>({
      query: data => {
        return {
          url: `/api/maintenance/purchase-orders-attachments/`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: [{ type: 'PurchaseOrdersAttachments', id: 'PARTIAL-LIST' }],
    }),
    deletePurchaseOrderAttachments: build.mutation<void, IPurchaseOrderAttachments>({
      query: data => {
        return {
          url: `/api/maintenance/purchase-orders-attachments/${data.id}/`,
          method: 'delete',
          data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'PurchaseOrdersAttachments', id },
        { type: 'PurchaseOrdersAttachments', id: 'PARTIAL-LIST' },
      ],
    }),

    // Purchase Order Items
    getPurchaseOrderItems: build.query<Array<IPurchaseOrderItem>, string | number>({
      query: purchase_order_id => ({
        url: `/api/maintenance/purchase-orders/${purchase_order_id}/items/`,
        method: 'get',
      }),
      transformResponse: (response: Array<IPurchaseOrderItem>) => {
        return response.map(result => ({
          ...result,
          line_total: result.quantity && result.cost ? result.quantity * result.cost : 0,
          inventory_item: {
            id: result.inventory_item as number,
            name: result.inventory_item_name,
            quantity: result.quantity,
            cost: result.cost,
          },
        }));
      },
      transformErrorResponse: baseQueryReturnValue => {
        return baseQueryReturnValue;
      },
      providesTags: response =>
        response
          ? [
              ...response.map(({ id }) => ({ type: 'PurchaseOrderItem' as const, id })),
              { type: 'PurchaseOrderItem', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'PurchaseOrderItem', id: 'PARTIAL-LIST' }],
    }),
    createPurchaseOrderItem: build.mutation<IPurchaseOrderItem, IPurchaseOrderItem>({
      query: data => ({
        url: `/api/maintenance/purchase-orders-items/`,
        method: 'post',
        data,
      }),
      invalidatesTags: [{ type: 'PurchaseOrderItem', id: 'PARTIAL-LIST' }],
    }),
    updatePurchaseOrderItem: build.mutation<IPurchaseOrderItem, Partial<IPurchaseOrderItem>>({
      query: data => ({
        url: `/api/maintenance/purchase-orders-items/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'PurchaseOrderItem', id },
        { type: 'PurchaseOrderItem', id: 'PARTIAL-LIST' },
      ],
    }),
    deletePurchaseOrderItem: build.mutation<number | string, number | string>({
      query: id => {
        return {
          url: `/api/maintenance/purchase-orders-items/${id}/`,
          method: 'delete',
          id,
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetPurchaseOrdersQuery,
  useGetPurchaseOrderByIdQuery,
  useUpdatePurchaseOrderMutation,
  useCreatePurchaseOrderMutation,
  useDeletePurchaseOrderMutation,

  useGetPurchaseOrderAttachmentsQuery,
  useCreatePurchaseOrderAttachmentsMutation,
  useDeletePurchaseOrderAttachmentsMutation,

  useCreatePurchaseOrderItemMutation,
  useGetPurchaseOrderItemsQuery,
  useDeletePurchaseOrderItemMutation,
  useUpdatePurchaseOrderItemMutation,
} = purchaseOrderAPI;
