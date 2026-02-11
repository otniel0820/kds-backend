import { OrderStatus } from '../value-objects/order-status.vo';
import { OrderPriority } from '../value-objects/order-priority.vo';
import { OrderTimers } from '../value-objects';
import { assertOrderTransition } from '../services';

export type OrderItem = {
  productId: string;
  qty: number;
};

type OrderProps = {
  id?: string;
  source: string;
  partner?: string;
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
  private props: OrderProps;

  constructor(props: OrderProps) {
    this.props = { ...props };
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get status(): OrderStatus {
    return this.props.status;
  }

  get displayNumber(): string {
    return this.props.displayNumber;
  }

  get priority(): OrderPriority {
    return this.props.priority;
  }

  get items(): OrderItem[] {
    return [...this.props.items];
  }

  transitionTo(next: OrderStatus): void {
    const current = this.props.status;

    if (current === next) return;

    assertOrderTransition(current, next);

    const now = new Date();

    this.props.status = next;
    this.props.timers.applyTransition(next, now);
    this.props.updatedAt = now;

    if (next.equals(OrderStatus.from('READY')) && !this.props.courierName) {
      this.props.courierName = this.generateCourierName();
    }
  }

  updateDisplayNumber(displayNumber: string): void {
    this.props.displayNumber = displayNumber;
    this.props.updatedAt = new Date();
  }

  static createFromIngest(input: {
    source: string;
    partner?: string;
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
      partner: input.partner,
      externalId: input.externalId,
      displayNumber: OrderEntity.generateDisplayNumber(),
      priority: input.priority ?? OrderPriority.from('NORMAL'),
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      deliveryAddress: input.deliveryAddress,
      notes: input.notes,
      status: OrderStatus.from('RECEIVED'),
      items: input.items,
      timers: new OrderTimers({ placedAt: now }),
      createdAt: now,
      updatedAt: now,
    });
  }

  toPrimitives() {
    return {
      ...this.props,
      status: this.props.status.toString(),
      priority: this.props.priority.toString(),
      timers: this.props.timers.toPrimitives(),
    };
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
