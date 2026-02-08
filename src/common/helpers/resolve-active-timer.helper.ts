import { OrderEntity } from 'src/domain/orders';

type OrderPrimitives = ReturnType<typeof OrderEntity.prototype.toPrimitives>;

export function resolveActiveTimer(order: OrderPrimitives): string | undefined {
  const map = {
    RECEIVED: order.timers.placedAt,
    CONFIRMED: order.timers.confirmedAt,
    PREPARING: order.timers.preparingAt,
    READY: order.timers.readyAt,
    PICKED_UP: order.timers.pickedUpAt,
    DELIVERED: order.timers.deliveredAt,
    CANCELLED: order.timers.cancelledAt,
  } as const;

  const value = map[order.status as keyof typeof map];

  return value ? value.toISOString() : undefined;
}
