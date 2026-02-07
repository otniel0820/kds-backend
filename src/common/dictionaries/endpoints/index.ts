import { ordersEndpoints } from './orders/orders-endpoints.dictionary';

export const endpoints = {
  ...ordersEndpoints,
} as const;

export type IEndpointKey = keyof typeof endpoints;
