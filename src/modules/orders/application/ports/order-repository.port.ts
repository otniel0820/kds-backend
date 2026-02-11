import { OrderSummary } from '../contracts/output/order-symary.output';
import { OrderDetailOutput } from '../contracts/output/order-detail.output';
import { OrderStatus, OrderEntity } from '../../domain';

export type OrderFilter = {
  id?: string;
  source?: string;
  externalId?: string;
  status?: OrderStatus[];
  createdFrom?: Date;
  createdTo?: Date;
  limit?: number;
  skip?: number;
};

export const ORDERS_REPOSITORY = Symbol('ORDERS_REPOSITORY');

export interface OrdersRepositoryPort {
  findById(id: string): Promise<OrderEntity | null>;
  findByFilter(filter: OrderFilter): Promise<OrderEntity[]>;
  create(order: OrderEntity): Promise<OrderEntity>;
  update(order: OrderEntity): Promise<OrderEntity>;
  findDetailProjection(id: string): Promise<OrderDetailOutput | null>;
  findList(filter: OrderFilter): Promise<{
    orders: OrderSummary[];
    total: number;
  }>;
  findItemUpdateById(id: string): Promise<OrderSummary>;
}
