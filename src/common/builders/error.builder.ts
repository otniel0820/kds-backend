import { IErrorKey, errors } from '../dictionaries/errors';
import { IError } from '../schemas/error.schema';

type IBuildErrorReturn<K extends IErrorKey, D> = (typeof errors)[K] & {
  details?: D;
};

export const buildError = <
  K extends IErrorKey,
  D extends Record<string, unknown> = Record<string, unknown>,
>(
  key: K,
  details?: D,
): IBuildErrorReturn<K, D> => {
  const base = errors[key] as unknown as IError;
  const mergedDetails: Record<string, unknown> = {
    ...(base.details ?? {}),
    ...(details ?? {}),
  };

  const result = {
    ...base,
    ...(Object.keys(mergedDetails).length > 0
      ? { details: mergedDetails }
      : {}),
  };

  return result as IBuildErrorReturn<K, D>;
};
