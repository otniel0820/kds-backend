import { OrderStatus } from 'src/domain/orders/value-objects/order-status.vo';
import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { OrderEventsPort } from '../ports/order-events.port';
import { UpdateOrderStatusWebhookInput } from '../contracts/input/update-order-status-webhook.input';

export class UpdateOrderStatusByExternalIdUseCase {
  constructor(
    private readonly ordersRepo: OrdersRepositoryPort,
    private readonly events: OrderEventsPort,
  ) {}

  async execute(input: UpdateOrderStatusWebhookInput): Promise<void> {
    const results = await this.ordersRepo.findByFilter({
      source: input.source,
      externalId: input.externalId,
    });

    const order = results[0];

    const nextStatus = OrderStatus.from(input.toStatus);

    order.transitionTo(nextStatus);

    await this.ordersRepo.update(order);

    const projection = await this.ordersRepo.findItemUpdateById(order.id!);

    await this.events.orderStatusUpdated(projection);
  }
}
