import { OrderStatus } from '../value-objects/order-status.vo';

const ALLOWED: Record<string, string[]> = {
  RECEIVED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export function assertOrderTransition(
  from: OrderStatus,
  to: OrderStatus,
): void {
  const allowed = ALLOWED[from.toString()] ?? [];

  if (!allowed.includes(to.toString())) {
    throw new Error(
      `Invalid transition from ${from.toString()} to ${to.toString()}`,
    );
  }
}
