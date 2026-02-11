import { Injectable } from '@nestjs/common';
import { OrdersGateway } from '../websocket/orders.gateway';
import { OrderSummary } from '../../application/contracts/output/order-symary.output';
import { OrderEventsPort } from '../../application/ports/order-events.port';

@Injectable()
export class OrderEventsAdapter implements OrderEventsPort {
  constructor(private readonly gateway: OrdersGateway) {}

  async orderIngested(order: OrderSummary): Promise<void> {
    await Promise.resolve(this.gateway.emitOrderCreated(order));
  }
  async orderStatusUpdated(order: OrderSummary): Promise<void> {
    await Promise.resolve(this.gateway.emitOrderStatusUpdated(order));
  }
}
