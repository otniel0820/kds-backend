import { z } from 'zod';

export const EnviromentSchema = z.object({
  NEST_NODE_ENV: z.enum(['LOCAL', 'DEVELOPMENT', 'SANDBOX', 'PRODUCTION']),
  NEST_PORT: z.string().min(1),
  NEST_MONGO_URL: z.string(),
  NEST_USER_NAME_GLOVO: z.string(),
  NEST_PASSWORD_GLOVO: z.string(),
});

export type IEnviroment = z.infer<typeof EnviromentSchema>;
