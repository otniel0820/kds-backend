import { Types } from 'mongoose';
import { OrderStatus } from 'src/domain/orders';
import { OrderPriority } from 'src/domain/orders/value-objects';

export type OrderListLeanDoc = {
  _id: Types.ObjectId;
  display_number: string;
  status: OrderStatus;
  priority: OrderPriority;
  timers: Record<string, Date | undefined>;
  partner?: {
    name: string;
    image: string;
  };
};
