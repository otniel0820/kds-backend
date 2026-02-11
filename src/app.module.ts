import { Module } from '@nestjs/common';
import { OrdersModule } from './modules/orders/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import { variables } from './config';

@Module({
  imports: [
    MongooseModule.forRoot(variables.NEST_MONGO_URL, {
      dbName: 'app',
    }),
    OrdersModule,
  ],
})
export class AppModule {}
