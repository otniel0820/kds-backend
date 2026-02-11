import { Injectable } from '@nestjs/common';
import { OrdersGateway } from '../websocket/orders.gateway';
import { OrderListDto } from 'src/application/orders/dtos';
import { OrderEventsPort } from 'src/application/orders/ports/order-events.port';

@Injectable()
export class OrderEventsAdapter implements OrderEventsPort {
  constructor(private readonly gateway: OrdersGateway) {}

  async orderIngested(order: OrderListDto): Promise<void> {
    await Promise.resolve(this.gateway.emitOrderCreated(order));
  }
  async orderStatusUpdated(order: OrderListDto): Promise<void> {
    await Promise.resolve(this.gateway.emitOrderStatusUpdated(order));
  }
}
