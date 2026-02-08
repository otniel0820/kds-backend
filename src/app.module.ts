import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngestOrderUseCase } from './application/orders/use-cases/ingest-order.usecase';
import { ListOrdersUseCase } from './application/orders/use-cases/list-orders.usecase';
import { UpdateOrderStatusUseCase } from './application/orders/use-cases/update-order-status.usecase';
import { ORDERS_REPOSITORY, OrdersRepositoryPort } from './application/orders';
import { variables } from './config/enviroment.config';
import { OrdersController } from './infraestructure/http/orders/controllers/orders.controller';
import { OrdersMongoRepository } from './infraestructure/persistence/mongo/repositories/orders.mongo.repository';
import {
  OrderMongoModel,
  OrderMongoSchema,
} from './infraestructure/persistence/mongo/schemas/order.mongo.schema';
import { GetOrderDetailUseCase } from './application/orders/use-cases/order-details.usecase';
import { OrderEventsAdapter } from './infraestructure/websocket/orders.event.adapter';
import { OrdersGateway } from './infraestructure/websocket/orders.gateway';
import {
  ORDER_EVENTS_PORT,
  OrderEventsPort,
} from './application/orders/ports/order-events.port';

@Module({
  imports: [
    MongooseModule.forRoot(variables.NEST_MONGO_URL, {
      dbName: 'app',
    }),
    MongooseModule.forFeature([
      { name: OrderMongoModel.name, schema: OrderMongoSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersGateway,
    OrderEventsAdapter,
    OrdersMongoRepository,
    {
      provide: ORDERS_REPOSITORY,
      useExisting: OrdersMongoRepository,
    },
    {
      provide: ORDER_EVENTS_PORT,
      useExisting: OrderEventsAdapter,
    },
    {
      provide: IngestOrderUseCase,
      useFactory: (repo: OrdersRepositoryPort, events: OrderEventsPort) =>
        new IngestOrderUseCase(repo, events),
      inject: [ORDERS_REPOSITORY, ORDER_EVENTS_PORT],
    },
    {
      provide: ListOrdersUseCase,
      useFactory: (repo: OrdersRepositoryPort) => new ListOrdersUseCase(repo),
      inject: [ORDERS_REPOSITORY],
    },
    {
      provide: UpdateOrderStatusUseCase,
      useFactory: (repo: OrdersRepositoryPort) =>
        new UpdateOrderStatusUseCase(repo),
      inject: [ORDERS_REPOSITORY],
    },
    {
      provide: GetOrderDetailUseCase,
      useFactory: (repo: OrdersRepositoryPort) =>
        new GetOrderDetailUseCase(repo),
      inject: [ORDERS_REPOSITORY],
    },
  ],
})
export class AppModule {}
