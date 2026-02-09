import { ORDER_EVENTS_PORT } from 'src/application/orders/ports/order-events.port';
import { OrderEventsAdapter } from 'src/infraestructure/websocket/orders.event.adapter';
import { OrdersGateway } from 'src/infraestructure/websocket/orders.gateway';

export const websocketProviders = [
  OrdersGateway,
  OrderEventsAdapter,
  {
    provide: ORDER_EVENTS_PORT,
    useExisting: OrderEventsAdapter,
  },
];
