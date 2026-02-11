import { Injectable } from '@nestjs/common';
import { OrdersGateway } from '../websocket/orders.gateway';
import { OrderEventsPort } from 'src/application/orders/ports/order-events.port';
import { OrderSummary } from 'src/application/orders/contracts/output/order-symary.output';

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
