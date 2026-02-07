import { OrderEntity } from 'src/domain/orders';
import { OrderStatus } from 'src/domain/orders';
import { OrderDetailDto } from '../dtos/order-details.dto';

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
  findDetailProjection(id: string): Promise<OrderDetailDto | null>;
}
