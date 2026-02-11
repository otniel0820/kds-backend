import { OrderStatusValue } from 'src/domain/orders/value-objects/order-status.vo';

export type UpdateOrderStatusWebhookInput = {
  source: string;
  externalId: string;
  toStatus: OrderStatusValue;
};
