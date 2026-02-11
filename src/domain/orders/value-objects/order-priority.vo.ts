export type OrderPriorityValue = 'NORMAL' | 'HIGH';

export class OrderPriority {
  private constructor(private readonly value: OrderPriorityValue) {}

  private static readonly VALUES: Record<OrderPriorityValue, OrderPriority> = {
    NORMAL: new OrderPriority('NORMAL'),
    HIGH: new OrderPriority('HIGH'),
  };

  static from(value: OrderPriorityValue): OrderPriority {
    const priority = this.VALUES[value];
    if (!priority) {
      throw new Error(`Invalid OrderPriority: ${value}`);
    }
    return priority;
  }

  equals(other: OrderPriority): boolean {
    return this.value === other.value;
  }

  toString(): OrderPriorityValue {
    return this.value;
  }
}
