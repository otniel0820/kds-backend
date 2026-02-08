import { OrderListDto } from '../dtos';

export const ORDER_EVENTS_PORT = Symbol('ORDER_EVENTS_PORT');

export interface OrderEventsPort {
  orderIngested(order: OrderListDto): Promise<void>;
}
