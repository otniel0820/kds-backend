import { OrderStatus } from '../value-objects/order-state.vo';
import { OrderTimers } from '../value-objects/order-timers.vo';

const TIMER_BY_STATUS: Partial<Record<OrderStatus, keyof OrderTimers>> = {
  [OrderStatus.CONFIRMED]: 'confirmedAt',
  [OrderStatus.PREPARING]: 'preparingAt',
  [OrderStatus.READY]: 'readyAt',
  [OrderStatus.PICKED_UP]: 'pickedUpAt',
  [OrderStatus.DELIVERED]: 'deliveredAt',
  [OrderStatus.CANCELLED]: 'cancelledAt',
};

export function applyOrderTimer(
  currentTimers: OrderTimers,
  nextStatus: OrderStatus,
  now: Date = new Date(),
): OrderTimers {
  const timerKey = TIMER_BY_STATUS[nextStatus];

  if (!timerKey) {
    return currentTimers;
  }

  return {
    ...currentTimers,
    [timerKey]: now,
  };
}
