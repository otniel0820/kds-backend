import { IUpdateOrderWebhookDto } from 'src/infraestructure/http/orders/dtos';
import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { OrderEventsPort } from '../ports/order-events.port';

export class UpdateOrderStatusByExternalIdUseCase {
  constructor(
    private readonly ordersRepo: OrdersRepositoryPort,
    private readonly events: OrderEventsPort,
  ) {}

  async execute(input: IUpdateOrderWebhookDto): Promise<void> {
    const results = await this.ordersRepo.findByFilter({
      source: input.source,
      externalId: input.externalId,
    });

    const order = results[0];

    order.updateStatus(input.toStatus);

    const updated = await this.ordersRepo.update(order);

    const projection = await this.ordersRepo.findItemUpdateById(
      updated.toPrimitives().id!,
    );

    if (!projection) {
      throw new Error('KDS_ORDER_E0008');
    }

    await this.events.orderStatusUpdated(projection);
  }
}
