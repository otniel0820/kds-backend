import { Types } from 'mongoose';
import { OrderStatusValue } from 'src/domain/orders/value-objects/order-status.vo';
import { OrderPriorityValue } from 'src/domain/orders/value-objects/order-priority.vo';

export type OrderListLeanDoc = {
  _id: Types.ObjectId;
  display_number: string;
  status: OrderStatusValue;
  priority: OrderPriorityValue;
  courier_name?: string;
  partner?: {
    name: string;
    image: string;
  };
  timers?: {
    placed_at?: Date;
    confirmed_at?: Date;
    preparing_at?: Date;
    ready_at?: Date;
    picked_up_at?: Date;
    delivered_at?: Date;
    cancelled_at?: Date;
  };
};
