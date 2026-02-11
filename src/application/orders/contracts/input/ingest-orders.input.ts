import { OrderPriorityValue } from 'src/domain/orders/value-objects/order-priority.vo';

export type IngestOrderInput = {
  source: string;
  externalId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  notes?: string;
  priority?: OrderPriorityValue;
  items: {
    slug: string;
    qty: number;
  }[];
};
