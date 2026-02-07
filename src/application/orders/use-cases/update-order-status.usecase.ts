import { OrderStatus } from 'src/domain/orders';
import { OrdersRepositoryPort } from '../ports/order-repository.port';

export class UpdateOrderStatusUseCase {
  constructor(private readonly repo: OrdersRepositoryPort) {}

  async execute(input: { id: string; toStatus: OrderStatus }) {
    const order = await this.repo.findById(input.id);
    if (!order) throw new Error('ORDER_NOT_FOUND');

    const updated = await this.repo.update(order.transitionTo(input.toStatus));
    const p = updated.toPrimitives();

    return {
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }
}
