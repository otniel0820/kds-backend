import { OrderStatus } from 'src/domain/orders';
import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { OrderListDto } from '../dtos';
import { buildResponse } from 'src/common/builders/response.builder';
import { IResponse } from 'src/common/schemas';
import { resolveActiveTimer } from 'src/common/helpers';

export class ListOrdersUseCase {
  constructor(private readonly repo: OrdersRepositoryPort) {}

  async execute(filter?: {
    status?: OrderStatus[];
  }): Promise<IResponse<OrderListDto[]>> {
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
          activeTimer: resolveActiveTimer(p),
        };
      }),
    );
  }
}
