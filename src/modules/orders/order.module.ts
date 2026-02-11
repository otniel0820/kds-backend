import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ORDERS_REPOSITORY,
  IngestOrderUseCase,
  ListOrdersUseCase,
  UpdateOrderStatusUseCase,
} from './application';
import { ORDER_EVENTS_PORT } from './application/ports/order-events.port';
import { PARTNERS_REPOSITORY } from './application/ports/partners-repository.port';
import { PRODUCTS_REPOSITORY } from './application/ports/products-repository.port';
import { GetOrderDetailUseCase } from './application/use-cases/order-details.usecase';
import { UpdateOrderStatusByExternalIdUseCase } from './application/use-cases/update-order-status-by-external-id.usecase';
import { OrdersMongoRepository } from './infrastructure/mongo/repositories/orders.mongo.repository';
import { PartnersMongoRepository } from './infrastructure/mongo/repositories/partners.mongo.repository';
import { ProductsMongoRepository } from './infrastructure/mongo/repositories/products.mongo.repository';
import {
  OrderMongoModel,
  OrderMongoSchema,
} from './infrastructure/mongo/schemas/order.mongo.schema';
import {
  PartnerMongoModel,
  PartnerMongoSchema,
} from './infrastructure/mongo/schemas/partners.schema';
import {
  ProductMongoModel,
  ProductMongoSchema,
} from './infrastructure/mongo/schemas/products.schema';
import { OrdersController } from './presentation/controllers/orders.controller';
import { OrderEventsAdapter } from './presentation/websocket/orders.event.adapter';
import { OrdersGateway } from './presentation/websocket/orders.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderMongoModel.name, schema: OrderMongoSchema },
      { name: PartnerMongoModel.name, schema: PartnerMongoSchema },
      { name: ProductMongoModel.name, schema: ProductMongoSchema },
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
      provide: PARTNERS_REPOSITORY,
      useClass: PartnersMongoRepository,
    },
    {
      provide: PRODUCTS_REPOSITORY,
      useClass: ProductsMongoRepository,
    },
    OrdersGateway,
    OrderEventsAdapter,
    {
      provide: ORDER_EVENTS_PORT,
      useExisting: OrderEventsAdapter,
    },
    {
      provide: IngestOrderUseCase,
      useFactory: (orders, partners, products, events) =>
        new IngestOrderUseCase(orders, partners, products, events),
      inject: [
        ORDERS_REPOSITORY,
        PARTNERS_REPOSITORY,
        PRODUCTS_REPOSITORY,
        ORDER_EVENTS_PORT,
      ],
    },
    {
      provide: ListOrdersUseCase,
      useFactory: (repo) => new ListOrdersUseCase(repo),
      inject: [ORDERS_REPOSITORY],
    },
    {
      provide: UpdateOrderStatusUseCase,
      useFactory: (repo) => new UpdateOrderStatusUseCase(repo),
      inject: [ORDERS_REPOSITORY],
    },
    {
      provide: GetOrderDetailUseCase,
      useFactory: (repo) => new GetOrderDetailUseCase(repo),
      inject: [ORDERS_REPOSITORY],
    },
    {
      provide: UpdateOrderStatusByExternalIdUseCase,
      useFactory: (repo, events) =>
        new UpdateOrderStatusByExternalIdUseCase(repo, events),
      inject: [ORDERS_REPOSITORY, ORDER_EVENTS_PORT],
    },
  ],
})
export class OrdersModule {}
