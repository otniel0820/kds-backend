import { OrderEntity, OrderStatus } from 'src/domain/orders';
import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { OrderListDTO } from '../dtos';
import { buildResponse } from 'src/common/builders/response.builder';
import { IResponse } from 'src/common/schemas';

export class ListOrdersUseCase {
  constructor(private readonly repo: OrdersRepositoryPort) {}

  async execute(filter?: {
    status?: OrderStatus[];
  }): Promise<IResponse<OrderListDTO[]>> {
    const orders = await this.repo.findByFilter({
      status: filter?.status,
    });

    return buildResponse(
      'KDS_ORD_R0003',
      orders.map((order) => {
        const p = order.toPrimitives();

        return {
          id: p.id!,
          source: p.source,
          displayNumber: p.displayNumber,
          status: p.status,
          priority: p.priority,
          activeTimer: this.resolveActiveTimer(p),
        };
      }),
    );
  }

  private resolveActiveTimer(
    p: ReturnType<typeof OrderEntity.prototype.toPrimitives>,
  ) {
    const map = {
      RECEIVED: p.timers.placedAt,
      CONFIRMED: p.timers.confirmedAt,
      PREPARING: p.timers.preparingAt,
      READY: p.timers.readyAt,
      PICKED_UP: p.timers.pickedUpAt,
      DELIVERED: p.timers.deliveredAt,
      CANCELLED: p.timers.cancelledAt,
    } as const;

    const value = map[p.status];
    return value ? value.toISOString() : undefined;
  }
}
