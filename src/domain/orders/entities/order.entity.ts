import { OrderStatus } from '../value-objects/order-state.vo';
import { OrderPriority } from '../value-objects/order-priority.vo';
import { OrderTimers } from '../value-objects';
import { assertOrderTransition, applyOrderTimer } from '../services';

export type OrderItem = { sku: string; name: string; qty: number };

export type OrderPrimitives = {
  id?: string;
  source: string;
  externalId: string;
  displayNumber: string;
  priority: OrderPriority;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  courierName?: string;
  notes?: string;
  status: OrderStatus;
  items: OrderItem[];
  timers: OrderTimers;
  createdAt?: Date;
  updatedAt?: Date;
};

export class OrderEntity {
  private props: OrderPrimitives;

  constructor(props: OrderPrimitives) {
    this.props = props;
  }

  get id() {
    return this.props.id;
  }

  get status() {
    return this.props.status;
  }

  toPrimitives(): OrderPrimitives {
    return { ...this.props };
  }

  withDisplayNumber(displayNumber: string): OrderEntity {
    return new OrderEntity({
      ...this.props,
      displayNumber,
    });
  }

  transitionTo(next: OrderStatus): OrderEntity {
    assertOrderTransition(this.props.status, next);

    const now = new Date();

    const updatedTimers = applyOrderTimer(this.props.timers, next, now);
    let courierName = this.props.courierName;

    if (next === OrderStatus.PICKED_UP && !courierName) {
      courierName = this.generateCourierName();
    }

    return new OrderEntity({
      ...this.props,
      status: next,
      timers: updatedTimers,
      courierName,
      updatedAt: now,
    });
  }

  static createFromIngest(input: {
    source: string;
    externalId: string;
    priority?: OrderPriority;
    customerName?: string;
    customerPhone?: string;
    deliveryAddress?: string;
    notes?: string;
    items: OrderItem[];
  }): OrderEntity {
    const now = new Date();

    return new OrderEntity({
      source: input.source,
      externalId: input.externalId,
      displayNumber: OrderEntity.generateDisplayNumber(),
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
  }
  private generateCourierName(): string {
    const couriers = [
      'Carlos Rodriguez',
      'Ana Farias',
      'Luis Salinas',
      'Sofía García',
      'Jorge Martínez',
    ];
    const index = Math.floor(Math.random() * couriers.length);
    return couriers[index];
  }

  private static generateDisplayNumber(): string {
    return `#${Date.now()}`;
  }
}
