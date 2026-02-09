import { Provider } from '@nestjs/common';
import { ORDERS_REPOSITORY } from 'src/application/orders';
import { PARTNERS_REPOSITORY } from 'src/application/orders/ports/partners-repository.port';
import { PRODUCTS_REPOSITORY } from 'src/application/orders/ports/products-repository.port';
import { OrdersMongoRepository } from 'src/infraestructure/persistence/mongo/repositories/orders.mongo.repository';
import { PartnersMongoRepository } from 'src/infraestructure/persistence/mongo/repositories/partners.mongo.repository';
import { ProductsMongoRepository } from 'src/infraestructure/persistence/mongo/repositories/products.mongo.repository';

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
];
