import { OrderStatus } from './order-status.vo';

type TimersProps = {
  placedAt?: Date;
  confirmedAt?: Date;
  preparingAt?: Date;
  readyAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
};

type TimerKey = keyof TimersProps;

export class OrderTimers {
  private props: TimersProps;

  private static readonly STATUS_TO_TIMER: Record<string, TimerKey | null> = {
    RECEIVED: 'placedAt',
    CONFIRMED: 'confirmedAt',
    PREPARING: 'preparingAt',
    READY: 'readyAt',
    PICKED_UP: 'pickedUpAt',
    DELIVERED: 'deliveredAt',
    CANCELLED: 'cancelledAt',
  };

  constructor(props: TimersProps) {
    this.props = { ...props };
  }

  applyTransition(status: OrderStatus, now: Date): void {
    const key = OrderTimers.STATUS_TO_TIMER[status.toString()];
    if (!key) return;

    this.props[key] = now;
  }

  toPrimitives(): TimersProps {
    return { ...this.props };
  }
}
