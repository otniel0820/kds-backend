import { OrderStatus } from 'src/domain/orders';
import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { buildResponse } from 'src/common/builders/response.builder';
import { IResponse } from 'src/common/schemas';

export class UpdateOrderStatusUseCase {
  constructor(private readonly repo: OrdersRepositoryPort) {}

  async execute(input: {
    id: string;
    toStatus: OrderStatus;
  }): Promise<IResponse<null>> {
    const order = await this.repo.findById(input.id);
    if (!order) throw new Error('ORDER_NOT_FOUND');

    await this.repo.update(order.transitionTo(input.toStatus));

    return buildResponse('KDS_ORD_R0004');
  }
}
