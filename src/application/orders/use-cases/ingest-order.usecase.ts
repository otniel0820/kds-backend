import { OrderEntity } from 'src/domain/orders';
import { OrderStatus } from 'src/domain/orders';
import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { OrderPriority } from 'src/domain/orders/value-objects';
import { IIngestOrderDto } from 'src/infraestructure/http/orders/dtos';

export class IngestOrderUseCase {
  constructor(private readonly repo: OrdersRepositoryPort) {}

  async execute(input: IIngestOrderDto) {
    const existing = await this.repo.findByFilter({
      source: input.source,
      externalId: input.externalId,
    });

    if (existing.length) return this.toDTO(existing[0]);

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
    return this.toDTO(created);
  }

  private toDTO(order: OrderEntity) {
    const p = order.toPrimitives();
    return {
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }
}
