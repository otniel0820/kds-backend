import { Module } from '@nestjs/common';
import { mongoSchemas } from './config/data-base-schemas.config';
import { databaseImports } from './config/data-base.config';
import { repositoriesProviders } from './config/repository-provider.config';
import { useCaseProviders } from './config/use-cases-providers.config';
import { websocketProviders } from './config/web-socket.config';
import { OrdersController } from './infraestructure/http/orders/controllers/orders.controller';

@Module({
  imports: [...databaseImports, ...mongoSchemas],
  controllers: [OrdersController],
  providers: [
    ...repositoriesProviders,
    ...websocketProviders,
    ...useCaseProviders,
  ],
})
export class AppModule {}
