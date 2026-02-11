import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OrderSummary } from 'src/application/orders/contracts/output/order-symary.output';

import { variables } from 'src/config';

@WebSocketGateway({
  cors: {
    origin:
      variables.NEST_NODE_ENV === 'PRODUCTION'
        ? variables.NEST_CORS_ALLOWED_ORIGINS
        : '*',
    credentials: true,
  },
})
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  emitOrderCreated(payload: OrderSummary): void {
    this.server.emit('order.created', payload);
  }
  emitOrderStatusUpdated(payload: OrderSummary): void {
    this.server.emit('order.status.updated', payload);
  }
}
