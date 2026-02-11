export const ordersEndpoints = {
  INGEST_ORDER_V1: {
    path: 'orders/ingest',
    version: 'v1',
    description: 'Ingest an order',
  },
  GET_ORDER_LIST_V1: {
    path: 'orders/list',
    version: 'v1',
    description: 'Get list of orders',
  },
  UPDATE_ORDER_STATUS_V1: {
    path: 'orders/:id/status',
    version: 'v1',
    description: 'Update order status',
  },
  GET_ORDER_DETAIL_V1: {
    path: 'order/details/:id',
    version: 'v1',
    description: 'Get order detail',
  },
  UPDATE_ORDER_WEBHOOK_V1: {
    path: 'order/update-status',
    version: 'v1',
    description: 'Update order status',
  },
} as const;

export type IEndpointKey = keyof typeof ordersEndpoints;
