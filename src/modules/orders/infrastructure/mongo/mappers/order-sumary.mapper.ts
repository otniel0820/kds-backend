import { OrderSummary } from 'src/modules/orders/application/contracts/output/order-symary.output';
import { OrderListLeanDoc } from '../types';

export class OrderSummaryMapper {
  static fromMongo(doc: OrderListLeanDoc): OrderSummary {
    return {
      id: doc._id.toString(),
      partnerName: doc.partner?.name,
      partnerImage: doc.partner?.image,
      displayNumber: doc.display_number,
      status: doc.status,
      priority: doc.priority,
      activeTimer: this.resolveActiveTimer(doc.status, doc.timers),
      courierName: doc.courier_name ?? undefined,
    };
  }

  private static resolveActiveTimer(
    status: string,
    timers?: Record<string, unknown>,
  ): string | undefined {
    if (!timers) return undefined;

    const statusTimerMap: Record<string, string> = {
      RECEIVED: 'placed_at',
      CONFIRMED: 'confirmed_at',
      PREPARING: 'preparing_at',
      READY: 'ready_at',
      PICKED_UP: 'picked_up_at',
      DELIVERED: 'delivered_at',
      CANCELLED: 'cancelled_at',
    };

    const key = statusTimerMap[status];
    if (!key) return undefined;

    const raw = timers[key];
    if (!raw) return undefined;

    const date = raw instanceof Date ? raw : new Date(raw as string);

    return isNaN(date.getTime()) ? undefined : date.toISOString();
  }
}
