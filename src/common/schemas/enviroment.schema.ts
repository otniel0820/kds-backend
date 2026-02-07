import { z } from 'zod';

export const EnviromentSchema = z.object({
  NEST_NODE_ENV: z.enum(['LOCAL', 'DEVELOPMENT', 'SANDBOX', 'PRODUCTION']),
  NEST_PORT: z.string().min(1),
  NEST_MONGO_URL: z.string(),
});

export type IEnviroment = z.infer<typeof EnviromentSchema>;
