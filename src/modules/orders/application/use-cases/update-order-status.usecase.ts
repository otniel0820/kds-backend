import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { buildResponse } from 'src/common/builders/response.builder';
import { IResponse } from 'src/common/schemas';
import {
  OrderStatus,
  OrderStatusValue,
} from '../../domain/value-objects/order-status.vo';

export class UpdateOrderStatusUseCase {
  constructor(private readonly repo: OrdersRepositoryPort) {}

  async execute(input: {
    id: string;
    toStatus: OrderStatusValue;
  }): Promise<IResponse<null>> {
    const order = await this.repo.findById(input.id);

    if (!order) {
      throw new Error('ORDER_NOT_FOUND');
    }

    const nextStatus = OrderStatus.from(input.toStatus);

    order.transitionTo(nextStatus);

    await this.repo.update(order);

    return buildResponse('KDS_ORD_R0004');
  }
}
