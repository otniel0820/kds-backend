import { OrderSummary } from '../contracts/output/order-symary.output';

export const ORDER_EVENTS_PORT = Symbol('ORDER_EVENTS_PORT');

export interface OrderEventsPort {
  orderIngested(order: OrderSummary): Promise<void>;
  orderStatusUpdated(order: OrderSummary): Promise<void>;
}
