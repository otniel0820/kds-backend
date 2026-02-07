import { IResponseKey, responses } from '../dictionaries/responses';

type IBuildResponseReturn<K extends IResponseKey, D> = (typeof responses)[K] & {
  data?: D;
};

export const buildResponse = <K extends IResponseKey, D = void>(
  key: K,
  data?: D,
): IBuildResponseReturn<K, D> => {
  return { ...responses[key], data };
};
