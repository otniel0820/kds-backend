import { OrderStatus } from 'src/domain/orders';
import { OrderPriority } from 'src/domain/orders/value-objects';

export type OrderListDto = {
  id: string;
  partnerName?: string;
  partnerImage?: string;
  displayNumber: string;
  status: OrderStatus;
  priority: OrderPriority;
  activeTimer?: string;
};
