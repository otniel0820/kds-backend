import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { variables } from './enviroment.config';

export const corsConfig: CorsOptions = {
  origin:
    variables.NEST_NODE_ENV === 'PRODUCTION'
      ? variables.NEST_CORS_ALLOWED_ORIGINS
      : '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
};
