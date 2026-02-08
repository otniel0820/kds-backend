import { OrderEntity } from 'src/domain/orders';
import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { IIngestOrderDto } from 'src/infraestructure/http/orders/dtos';
import { OrderListDto } from '../dtos';
import { OrderEventsPort } from '../ports/order-events.port';
import { resolveActiveTimer } from 'src/common/helpers';

export class IngestOrderUseCase {
  constructor(
    private readonly repo: OrdersRepositoryPort,
    private readonly events: OrderEventsPort,
  ) {}

  async execute(input: IIngestOrderDto): Promise<void> {
    const existing = await this.repo.findByFilter({
      source: input.source,
      externalId: input.externalId,
    });

    if (existing.length) {
      return;
    }

    const order = OrderEntity.createFromIngest(input);

    const created = await this.repo.create(order);
    await this.events.orderIngested(this.toEventDto(created));
  }

  private toEventDto(order: OrderEntity): OrderListDto {
    const p = order.toPrimitives();
    return {
      id: p.id!,
      source: p.source,
      displayNumber: p.displayNumber,
      status: p.status,
      priority: p.priority,
      activeTimer: resolveActiveTimer(p),
    };
  }
}
