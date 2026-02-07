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
    OrdersMongoRepository,
    {
      provide: ORDERS_REPOSITORY,
      useExisting: OrdersMongoRepository,
    },
    {
      provide: IngestOrderUseCase,
      useFactory: (repo: OrdersRepositoryPort) => new IngestOrderUseCase(repo),
      inject: [ORDERS_REPOSITORY],
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
