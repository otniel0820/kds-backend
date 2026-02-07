import 'dotenv/config';
import { buildError } from 'src/common/builders/error.builder';
import { EnviromentSchema } from 'src/common/schemas';

const parsedEnv = EnviromentSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const err = buildError('KDS_SYS_E0001', {
    variables: parsedEnv.error.issues,
  });

  throw new Error(JSON.stringify(err));
}

export const variables = parsedEnv.data;
