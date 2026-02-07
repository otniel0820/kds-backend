import { OrderStatus } from 'src/domain/orders';
import { OrderPriority } from 'src/domain/orders/value-objects';

export type OrderListDTO = {
  id: string;
  source: string;
  displayNumber: string;
  status: OrderStatus;
  priority: OrderPriority;
  activeTimer?: string;
};
