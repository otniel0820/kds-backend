import { orderResponses } from './orders/orders-response.dictionary';

export const responses = {
  ...orderResponses,
} as const;

export type IResponseKey = keyof typeof responses;
