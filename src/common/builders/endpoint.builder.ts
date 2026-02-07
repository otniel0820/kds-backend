import { endpoints } from '../dictionaries/endpoints';

export const buildEndpoint = <K extends keyof typeof endpoints>(key: K) => {
  const endpoint = endpoints[key];

  return {
    ...endpoint,
    fullPath: `/${endpoint.version}/${endpoint.path}`,
  };
};
