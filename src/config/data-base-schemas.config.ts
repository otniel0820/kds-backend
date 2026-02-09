import { MongooseModule } from '@nestjs/mongoose';
import {
  OrderMongoModel,
  OrderMongoSchema,
} from 'src/infraestructure/persistence/mongo/schemas/order.mongo.schema';
import {
  PartnerMongoModel,
  PartnerMongoSchema,
} from 'src/infraestructure/persistence/mongo/schemas/partners.schema';
import {
  ProductMongoModel,
  ProductMongoSchema,
} from 'src/infraestructure/persistence/mongo/schemas/products.schema';

export const mongoSchemas = [
  MongooseModule.forFeature([
    { name: OrderMongoModel.name, schema: OrderMongoSchema },
    { name: PartnerMongoModel.name, schema: PartnerMongoSchema },
    { name: ProductMongoModel.name, schema: ProductMongoSchema },
  ]),
];
