import { OrderStatusValue } from 'src/modules/orders/domain';

export type UpdateOrderStatusWebhookInput = {
  source: string;
  externalId: string;
  toStatus: OrderStatusValue;
};
