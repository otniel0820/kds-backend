import { MongooseModule } from '@nestjs/mongoose';
import { variables } from './enviroment.config';

export const databaseImports = [
  MongooseModule.forRoot(variables.NEST_MONGO_URL, {
    dbName: 'app',
  }),
] as const;
