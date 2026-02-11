import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { variables } from 'src/config';
import { OrderSummary } from '../../application/contracts/output/order-symary.output';

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
