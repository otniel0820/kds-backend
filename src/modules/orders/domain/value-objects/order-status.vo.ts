export type OrderStatusValue =
  | 'RECEIVED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'PICKED_UP'
  | 'DELIVERED'
  | 'CANCELLED';

export class OrderStatus {
  private constructor(private readonly value: OrderStatusValue) {}

  private static readonly INSTANCES: Record<OrderStatusValue, OrderStatus> = {
    RECEIVED: new OrderStatus('RECEIVED'),
    CONFIRMED: new OrderStatus('CONFIRMED'),
    PREPARING: new OrderStatus('PREPARING'),
    READY: new OrderStatus('READY'),
    PICKED_UP: new OrderStatus('PICKED_UP'),
    DELIVERED: new OrderStatus('DELIVERED'),
    CANCELLED: new OrderStatus('CANCELLED'),
  };

  private static readonly TRANSITIONS: Record<
    OrderStatusValue,
    OrderStatusValue[]
  > = {
    RECEIVED: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PREPARING', 'CANCELLED'],
    PREPARING: ['READY', 'CANCELLED'],
    READY: ['PICKED_UP', 'CANCELLED'],
    PICKED_UP: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
  };

  static from(value: OrderStatusValue): OrderStatus {
    const instance = this.INSTANCES[value];

    if (!instance) {
      throw new Error(`Invalid OrderStatus: ${value}`);
    }

    return instance;
  }

  canTransitionTo(next: OrderStatus): boolean {
    return OrderStatus.TRANSITIONS[this.value].includes(next.value);
  }

  assertTransition(next: OrderStatus): void {
    if (!this.canTransitionTo(next)) {
      throw new Error(`Invalid transition from ${this.value} to ${next.value}`);
    }
  }

  equals(other: OrderStatus): boolean {
    return this.value === other.value;
  }

  toString(): OrderStatusValue {
    return this.value;
  }
}
