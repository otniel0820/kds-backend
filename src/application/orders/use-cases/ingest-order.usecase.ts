import { OrderEntity } from 'src/domain/orders';
import { OrderStatus } from 'src/domain/orders';
import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { OrderPriority } from 'src/domain/orders/value-objects';
import { IIngestOrderDto } from 'src/infraestructure/http/orders/dtos';
import { buildResponse } from 'src/common/builders/response.builder';
import { IResponse } from 'src/common/schemas';
import { OrderDto } from '../dtos';

export class IngestOrderUseCase {
  constructor(private readonly repo: OrdersRepositoryPort) {}

  async execute(input: IIngestOrderDto): Promise<IResponse<OrderDto>> {
    const existing = await this.repo.findByFilter({
      source: input.source,
      externalId: input.externalId,
    });

    if (existing.length) {
      return buildResponse('KDS_ORD_R0003', this.toDTO(existing[0]));
    }

    const now = new Date();
    const displayNumber = `#${Date.now()}`;
    const order = new OrderEntity({
      source: input.source,
      externalId: input.externalId,
      displayNumber,
      priority: input.priority ?? OrderPriority.NORMAL,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      deliveryAddress: input.deliveryAddress,
      notes: input.notes,
      status: OrderStatus.RECEIVED,
      items: input.items,
      timers: {
        placedAt: now,
      },
      createdAt: now,
      updatedAt: now,
    });

    const created = await this.repo.create(order);
    return buildResponse('KDS_ORD_R0003', this.toDTO(created));
  }

  private toDTO(order: OrderEntity): OrderDto {
    const p = order.toPrimitives();

    if (!p.id) throw new Error('ORDER_ID_MISSING');

    const iso = (d?: Date) => (d ? d.toISOString() : undefined);

    return {
      id: p.id,
      source: p.source,
      externalId: p.externalId,
      displayNumber: p.displayNumber,
      priority: p.priority,
      status: p.status,
      items: p.items,

      timers: {
        placedAt: iso(p.timers.placedAt),
        confirmedAt: iso(p.timers.confirmedAt),
        preparingAt: iso(p.timers.preparingAt),
        readyAt: iso(p.timers.readyAt),
        pickedUpAt: iso(p.timers.pickedUpAt),
        deliveredAt: iso(p.timers.deliveredAt),
        cancelledAt: iso(p.timers.cancelledAt),
      },

      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }
}
