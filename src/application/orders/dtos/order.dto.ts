import { OrderStatus } from 'src/domain/orders';
import { OrderPriority } from 'src/domain/orders/value-objects';

export type OrderTimersDto = {
  placedAt?: string;
  confirmedAt?: string;
  preparingAt?: string;
  readyAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
};

export type OrderDto = {
  id: string;
  source: string;
  externalId: string;

  displayNumber: string;
  priority: OrderPriority;

  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  courierName?: string;
  notes?: string;

  status: OrderStatus;
  items: { sku: string; name: string; qty: number }[];

  timers: OrderTimersDto;

  createdAt: string;
  updatedAt: string;
};
