import { OrderStatusValue } from 'src/domain/orders/value-objects/order-status.vo';

export type ListOrdersInput = {
  id?: string;
  source?: string;
  externalId?: string;
  status?: OrderStatusValue[];
  limit?: number;
  skip?: number;
};
