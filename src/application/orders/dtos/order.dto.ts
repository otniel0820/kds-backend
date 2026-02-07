import { OrderStatus } from 'src/domain/orders';

export type OrderDTO = {
  id: string;
  source: string;
  externalId: string;
  status: OrderStatus;
  items: {
    sku: string;
    name: string;
    qty: number;
  }[];
  createdAt: string;
  updatedAt: string;
};
