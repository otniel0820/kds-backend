import { Provider } from '@nestjs/common';
import { ORDERS_REPOSITORY } from 'src/application/orders';
import { ORDER_EVENTS_PORT } from 'src/application/orders/ports/order-events.port';
import { PARTNERS_REPOSITORY } from 'src/application/orders/ports/partners-repository.port';
import { PRODUCTS_REPOSITORY } from 'src/application/orders/ports/products-repository.port';
import { OrdersMongoRepository } from 'src/infraestructure/persistence/mongo/repositories/orders.mongo.repository';
import { PartnersMongoRepository } from 'src/infraestructure/persistence/mongo/repositories/partners.mongo.repository';
import { ProductsMongoRepository } from 'src/infraestructure/persistence/mongo/repositories/products.mongo.repository';
import { OrderEventsAdapter } from 'src/infraestructure/websocket/orders.event.adapter';

export const repositoriesProviders: Provider[] = [
  OrdersMongoRepository,
  {
    provide: ORDERS_REPOSITORY,
    useExisting: OrdersMongoRepository,
  },
  {
    provide: PARTNERS_REPOSITORY,
    useClass: PartnersMongoRepository,
  },
  {
    provide: PRODUCTS_REPOSITORY,
    useClass: ProductsMongoRepository,
  },
  {
    provide: ORDER_EVENTS_PORT,
    useClass: OrderEventsAdapter,
  },
];
