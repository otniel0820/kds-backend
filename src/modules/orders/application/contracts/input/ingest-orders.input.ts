import { OrderPriorityValue } from 'src/modules/orders/domain/value-objects';

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
