import {
  IngestOrderUseCase,
  OrdersRepositoryPort,
  ORDERS_REPOSITORY,
  ListOrdersUseCase,
  UpdateOrderStatusUseCase,
} from 'src/application/orders';
import {
  OrderEventsPort,
  ORDER_EVENTS_PORT,
} from 'src/application/orders/ports/order-events.port';
import {
  PartnersRepositoryPort,
  PARTNERS_REPOSITORY,
} from 'src/application/orders/ports/partners-repository.port';
import {
  ProductsRepositoryPort,
  PRODUCTS_REPOSITORY,
} from 'src/application/orders/ports/products-repository.port';
import { GetOrderDetailUseCase } from 'src/application/orders/use-cases/order-details.usecase';

export const useCaseProviders = [
  {
    provide: IngestOrderUseCase,
    useFactory: (
      orders: OrdersRepositoryPort,
      partners: PartnersRepositoryPort,
      products: ProductsRepositoryPort,
      events: OrderEventsPort,
    ): IngestOrderUseCase =>
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
    useFactory: (repo: OrdersRepositoryPort): ListOrdersUseCase =>
      new ListOrdersUseCase(repo),
    inject: [ORDERS_REPOSITORY],
  },
  {
    provide: UpdateOrderStatusUseCase,
    useFactory: (repo: OrdersRepositoryPort): UpdateOrderStatusUseCase =>
      new UpdateOrderStatusUseCase(repo),
    inject: [ORDERS_REPOSITORY],
  },
  {
    provide: GetOrderDetailUseCase,
    useFactory: (repo: OrdersRepositoryPort): GetOrderDetailUseCase =>
      new GetOrderDetailUseCase(repo),
    inject: [ORDERS_REPOSITORY],
  },
];
